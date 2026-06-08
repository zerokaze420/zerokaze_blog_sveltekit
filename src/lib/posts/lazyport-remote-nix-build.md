---
title: "LazyPort Web 远程 Nix 构建思路与教程"
publishDate: "2026-06-08"
author: "Zerokaze"
description: "用白话拆解 lazyport-web 的 Nix 远程构建、LPK 打包和校验发布流程"
tags: [Nix, LazyPort, LPK, 教程]
---

# LazyPort Web 远程 Nix 构建思路与教程

这篇文章讲的是 `/home/tux/code/lazyport-web` 里那套远程 Nix 构建方案。它解决的问题很直接：本机只负责写代码和拿结果，真正吃 CPU、吃网络、吃缓存的构建工作丢给远程机器做；同时产物还要尽量可复现，不能依赖本机刚好装了什么、`node_modules` 里刚好有什么、Docker daemon 刚好是什么状态。

先说一句大白话版本：

> Nix 负责把“怎么构建”固定下来，远程 store 负责在另一台机器上跑构建，脚本负责把远程生成的 `/nix/store` 产物复制回来，再用 `result` 指向它。

## 为什么要这样做

传统前端或 Docker 构建经常有几个问题：

- 本机环境乱了，构建结果也可能跟着变。
- `node_modules`、`dist/`、Docker 缓存都在本机，很难保证换一台机器还能一样。
- 构建 LPK 要经过 Docker、lzc-cli、镜像打包等步骤，链路长，出错点多。
- 如果本机性能一般，每次完整构建都会很慢。

Nix 的思路是反过来：把依赖、命令、输出都写进 `flake.nix`。构建时 Nix 根据这些描述创建隔离环境，输入不变，输出就尽量不变。再配合 `--store ssh-ng://debian`，构建可以发生在远程机器上，但调用方式还是像本地命令一样。

## 整体流程

`lazyport-web` 现在主要有三条构建路：

1. 本地开发构建：`nix develop -c bun run build`
2. 纯 Nix LPK 构建：`nix build .#lpk`
3. 远程 Nix 构建：`nix develop -c scripts/remote-nix-build-lpk.sh`

最推荐理解的是第三条，它背后其实还是在构建 `.#lpk`，只是把 Nix store 换成了远程：

```bash
nix build .#lpk --store ssh-ng://debian --no-link --print-out-paths
nix copy --from ssh-ng://debian /nix/store/...
ln -sfn /nix/store/... result
```

这三步分别是：

- 去远程机器的 Nix store 里构建目标。
- 把远程 store 里的构建结果复制回本机 store。
- 让本地 `result` 符号链接指向最终产物。

这样本机不用真正跑完整构建，只需要能访问远程构建机，并且本机也装了 Nix。

## flake.nix：整套方案的核心

`flake.nix` 是这套构建的说明书。它告诉 Nix：这个项目有哪些包、怎么构建前端、怎么组装后端、怎么生成 Docker 镜像、怎么打出 LPK。

它先锁定输入：

```nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
};
```

意思是依赖主要来自 `nixpkgs`，具体版本会记录在 `flake.lock`。以后别人或者远程机器构建时，用的是同一批 Nix 包版本。

### frontendNodeModules

`frontendNodeModules` 专门负责安装前端依赖：

```nix
frontendNodeModules = pkgs.stdenvNoCC.mkDerivation {
  pname = "lazyport-web-node_modules";
  src = ./.;
  nativeBuildInputs = [
    pkgs.bun
    pkgs.writableTmpDirAsHomeHook
  ];
  buildPhase = ''
    export BUN_INSTALL_CACHE_DIR=$(mktemp -d)
    bun install --frozen-lockfile --ignore-scripts --no-progress
  '';
  installPhase = ''
    mkdir -p $out
    cp -R node_modules $out/node_modules
  '';
  outputHash = "sha256-OLjECUPEboNoY3bIyAp1bh+FltXnIz4m83mkmV2x6QM=";
  outputHashAlgo = "sha256";
  outputHashMode = "recursive";
};
```

这里有几个重点：

- `bun install --frozen-lockfile`：必须按 `bun.lock` 安装，锁文件不匹配就失败。
- `--ignore-scripts`：避免 npm 包里的安装脚本做一些不可控操作。
- `outputHash`：这是 fixed-output derivation。因为安装依赖需要取网络内容，Nix 需要知道最终输出 hash，才能判断它是不是预期产物。
- 输出不是直接构建前端，而是保存一份 Nix 管理的 `node_modules`。

白话说：这一步就是把 `node_modules` 变成 Nix store 里的一个干净产物。

### frontend

`frontend` 用上一步得到的 `node_modules` 构建 Vite 前端：

```nix
frontend = pkgs.stdenvNoCC.mkDerivation {
  pname = "lazyport-web-frontend";
  src = ./.;
  nativeBuildInputs = [
    pkgs.bun
    pkgs.nodejs_22
  ];
  configurePhase = ''
    cp -R ${frontendNodeModules}/node_modules ./node_modules
    patchShebangs node_modules
  '';
  buildPhase = ''
    export LAZYPORT_VERSION=${buildVersion}
    bun run build
  '';
  installPhase = ''
    mkdir -p $out
    cp -R dist/. $out/
  '';
};
```

这里没有用工作区现成的 `node_modules`，而是从 `${frontendNodeModules}` 复制。这样本机有没有跑过 `bun install` 都不重要。

`patchShebangs node_modules` 是 Nix 里很常见的一步，用来修正脚本第一行的解释器路径。因为 Nix 环境里的 `node`、`bash` 不一定在普通系统路径下，修一下可以避免脚本执行时找不到解释器。

### app

`app` 把后端、前端静态文件、`lzc-cli` 包装脚本放到同一个 Nix 输出里：

```nix
app = pkgs.stdenvNoCC.mkDerivation {
  pname = "lazyport-web";
  installPhase = ''
    mkdir -p $out/app $out/bin
    cp -R backend $out/app/backend
    cp -R ${frontend} $out/app/static
    cp -R ${frontendNodeModules}/node_modules $out/app/node_modules
    cat > $out/bin/lzc-cli <<EOF
    ...
    EOF
    cat > $out/bin/lazyport-web <<EOF
    ...
    EOF
  '';
};
```

它做的是应用层组装：

- `backend/` 放进 `$out/app/backend`
- 前端构建结果放进 `$out/app/static`
- `node_modules` 放进 `$out/app/node_modules`
- 生成 `lazyport-web` 启动脚本
- 生成 `lzc-cli` 包装脚本

启动脚本最后跑的是：

```bash
uvicorn backend.app:app --host "${LAZYPORT_BIND_HOST:-0.0.0.0}" --port "${LAZYPORT_BIND_PORT:-8080}"
```

所以 Nix 构建出来的 `app` 已经是一个可以运行的应用目录，不再只是源码。

### dockerImage

`dockerImage` 用 `dockerTools.buildLayeredImage` 生成 Docker archive：

```nix
dockerImage = pkgs.dockerTools.buildLayeredImage {
  name = "lazyport-web";
  tag = "${version}-nix";
  contents = [
    app
    pkgs.bashInteractive
    pkgs.coreutils
    pkgs.cacert
    pkgs.nodejs_22
  ];
  config = {
    Cmd = [ "${app}/bin/lazyport-web" ];
    Env = [
      "LAZYPORT_DATA_DIR=/lzcapp/var/lazyport"
      "LAZYPORT_BIND_PORT=18080"
    ];
    ExposedPorts = {
      "18080/tcp" = {};
    };
  };
};
```

注意，这里不是调用本地 Docker daemon 构建镜像，而是 Nix 自己生成一个 Docker 镜像归档文件。也就是说，`nix build .#dockerImage` 不需要本机 Docker 正在运行。

这点很关键。传统 `docker build` 很依赖本机 Docker 状态，而 `dockerTools` 更像是“用 Nix 拼出一个镜像 tar 包”。

### lpk

`lpk` 是最终的纯 Nix LPK 产物：

```nix
lpk = pkgs.stdenvNoCC.mkDerivation {
  pname = "cloud.lazycat.app.lazyport-web";
  nativeBuildInputs = [
    pkgs.python3
  ];
  installPhase = ''
    mkdir -p $out
    python3 scripts/docker_archive_to_lpk.py \
      --src-root . \
      --docker-archive ${dockerImage} \
      --output $out/cloud.lazycat.app.lazyport-web-v${version}-nix.lpk
  '';
};
```

它没有调用 `lzc-cli`，而是把 Nix 生成的 Docker archive 交给 `scripts/docker_archive_to_lpk.py`，直接按 LPK 包格式组装。

所以 `nix build .#lpk` 的主线是：

```text
bun.lock -> node_modules -> dist -> app -> dockerImage -> docker_archive_to_lpk.py -> .lpk
```

## remote-nix-build-lpk.sh：把构建扔到远程

远程构建入口是：

```bash
nix develop -c scripts/remote-nix-build-lpk.sh
```

脚本开头先定位项目根目录：

```bash
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"
```

这样无论你从哪里执行脚本，它都会回到仓库根目录，避免相对路径错乱。

然后设置几个默认参数：

```bash
REMOTE_BUILDER="${REMOTE_BUILDER:-ssh-ng://debian}"
PACKAGE="${PACKAGE:-.#lpk}"
OUT_LINK="${OUT_LINK:-result}"
NIX_COPY_FLAGS="${NIX_COPY_FLAGS:---no-check-sigs}"
```

含义如下：

| 变量 | 默认值 | 作用 |
|------|--------|------|
| `REMOTE_BUILDER` | `ssh-ng://debian` | 远程 Nix store 地址 |
| `PACKAGE` | `.#lpk` | 要构建的 flake 包 |
| `OUT_LINK` | `result` | 本地结果符号链接 |
| `NIX_COPY_FLAGS` | `--no-check-sigs` | 从远程复制 store path 时的额外参数 |

最常用的是默认构建 LPK：

```bash
nix develop -c scripts/remote-nix-build-lpk.sh
```

如果只想远程构建 Docker 镜像归档：

```bash
nix develop -c env PACKAGE=.#dockerImage scripts/remote-nix-build-lpk.sh
```

如果远程构建机不是 `debian`：

```bash
nix develop -c env REMOTE_BUILDER=ssh-ng://my-builder scripts/remote-nix-build-lpk.sh
```

### 参数处理

脚本支持几个特殊参数：

```bash
--dry-run
--no-check-sigs
--check-sigs
```

`--dry-run` 会只让 Nix 计算构建计划，不复制结果：

```bash
nix build "$PACKAGE" \
  --store "$REMOTE_BUILDER" \
  --no-link \
  "${BUILD_ARGS[@]}"
```

这适合检查远程构建能不能开始、依赖会不会缺，但不想真的把产物拉回来。

`--check-sigs` 和 `--no-check-sigs` 控制复制远程 store path 时要不要校验签名。默认是 `--no-check-sigs`，适合个人开发环境，因为你已经通过 SSH 信任这台构建机。更正式的环境建议配置远程构建机签名 key，然后打开签名校验。

### 真正构建的部分

脚本核心是这段：

```bash
out_path="$(nix build "$PACKAGE" \
  --store "$REMOTE_BUILDER" \
  --no-link \
  --print-out-paths \
  "${BUILD_ARGS[@]}")"
```

解释一下：

- `--store ssh-ng://debian`：构建发生在远程 Nix store。
- `--no-link`：先不要在本机生成 `result`。
- `--print-out-paths`：把最终的 `/nix/store/...` 路径打印出来，脚本保存到 `out_path`。

然后复制回来：

```bash
nix copy --from "$REMOTE_BUILDER" "${COPY_ARGS[@]}" "$out_path"
```

最后更新本地链接：

```bash
ln -sfn "$out_path" "$OUT_LINK"
echo "$OUT_LINK -> $out_path"
```

这里很多人第一次会疑惑：`out_path` 看起来还是 `/nix/store/...`，为什么复制回来后还能用同一个路径？

原因是 Nix store 路径包含内容 hash。只要内容一样，远程和本机的 store path 名字就是一样的。`nix copy` 做的是把这个 store path 的内容从远程 store 复制进本机 store，所以本机也会出现同一个 `/nix/store/...`。

## 远程构建机需要准备什么

最低要求：

1. 本机可以无密码 SSH 到远程机，例如 `ssh debian`。
2. 远程机安装了 Nix。
3. 远程 Nix 启用了 `nix-command` 和 `flakes`。
4. 远程机器架构能构建目标，例如 `x86_64-linux` 或 `aarch64-linux`。

`~/.ssh/config` 可以类似这样：

```sshconfig
Host debian
  HostName 192.168.1.10
  User tux
  IdentityFile ~/.ssh/id_ed25519
```

远程机的 `/etc/nix/nix.conf` 至少需要：

```conf
experimental-features = nix-command flakes
```

如果要开启签名校验，就在远程机生成 key：

```bash
ssh debian 'sudo mkdir -p /etc/nix/signing && sudo chmod 700 /etc/nix/signing'
ssh debian 'sudo /nix/var/nix/profiles/default/bin/nix --extra-experimental-features nix-command key generate-secret --key-name debian-builder > /tmp/debian-builder.sec'
ssh debian 'sudo mv /tmp/debian-builder.sec /etc/nix/signing/debian-builder.sec'
ssh debian 'sudo chmod 600 /etc/nix/signing/debian-builder.sec'
```

导出 public key：

```bash
ssh debian 'sudo cat /etc/nix/signing/debian-builder.sec | /nix/var/nix/profiles/default/bin/nix --extra-experimental-features nix-command key convert-secret-to-public'
```

然后远程机 `/etc/nix/nix.conf` 加：

```conf
secret-key-files = /etc/nix/signing/debian-builder.sec
```

本机 `/etc/nix/nix.conf` 的 `trusted-public-keys` 加上导出的 public key。这样再跑：

```bash
nix develop -c env NIX_COPY_FLAGS= scripts/remote-nix-build-lpk.sh --check-sigs
```

复制远程产物时就会走签名校验。

## docker_archive_to_lpk.py：为什么不直接用 lzc-cli

`scripts/docker_archive_to_lpk.py` 是纯 Nix LPK 构建的关键。它绕开 `lzc-cli`，直接把 Docker archive 转成 LPK 需要的内部结构。

一个 LPK 包本质上是一个 tar，里面放这些东西：

```text
icon.png
package.yml
manifest.yml
images/
images.lock
```

脚本做的事情是：

1. 读取 Nix 生成的 Docker archive。
2. 找到 Docker 镜像里的 config 和 layers。
3. 把 layers gzip 压缩成 OCI layer blob。
4. 生成 `images/oci-layout`、`images/index.json` 和 `images/blobs/sha256/...`。
5. 把 `lzc-manifest.yml` 里的 `embed:app` 替换成 `embed:app@sha256:...`。
6. 生成 `images.lock`，记录 image id 和 layer digest。
7. 把所有文件打成 `.lpk`。

### docker_archive_to_oci

核心函数是 `docker_archive_to_oci`：

```python
def docker_archive_to_oci(docker_archive, images_dir):
    images_dir.mkdir(parents=True, exist_ok=True)
    blobs_dir = images_dir / "blobs" / "sha256"
    ...
```

它先创建 OCI layout 目录：

```text
images/
  oci-layout
  index.json
  blobs/
    sha256/
      ...
```

然后打开 Docker archive：

```python
with tarfile.open(docker_archive, "r:*") as docker_tar:
    manifest_list = json.loads(read_tar_member(docker_tar, "manifest.json"))
```

Docker archive 里的 `manifest.json` 会告诉脚本：

- config 文件是哪一个
- layer 文件有哪些

脚本要求 archive 里只有一个镜像：

```python
if len(manifest_list) != 1:
    raise RuntimeError(...)
```

这让逻辑更简单，也符合 `lazyport-web` 一个 app 镜像的场景。

处理 config：

```python
config_bytes = read_tar_member(docker_tar, config_name)
config_digest = f"sha256:{sha256_bytes(config_bytes)}"
(blobs_dir / config_digest.removeprefix("sha256:")).write_bytes(config_bytes)
```

处理 layer：

```python
layer_bytes = read_tar_member(docker_tar, layer_name)
compressed = gzip.compress(layer_bytes, compresslevel=9, mtime=0)
digest = f"sha256:{sha256_bytes(compressed)}"
diff_digest = f"sha256:{sha256_bytes(layer_bytes)}"
```

这里 `mtime=0` 很重要。gzip 默认会写入当前时间，如果不固定时间，同样内容每次压缩出来 hash 可能不同。设置 `mtime=0` 后，压缩结果更稳定。

最后它生成 OCI manifest 和 index：

```python
index = {
    "schemaVersion": 2,
    "manifests": [
        {
            "mediaType": "application/vnd.oci.image.manifest.v1+json",
            "digest": manifest_digest,
            "annotations": {"org.opencontainers.image.ref.name": "app"},
        }
    ],
}
```

`org.opencontainers.image.ref.name` 这里写成 `app`，后面 `manifest.yml` 里的 `embed:app` 就是靠这个名字对应上。

### build_lpk

`build_lpk` 负责真正打包：

```python
manifest_template = (src_root / "lzc-manifest.yml").read_text()
manifest = manifest_template.replace("embed:app", f"embed:app@{config_digest}")
(tmpdir / "manifest.yml").write_text(manifest)
```

也就是说，源码里的 `lzc-manifest.yml` 可以先写一个抽象引用：

```yaml
image: embed:app
```

打包时脚本再替换成带 digest 的精确引用：

```yaml
image: embed:app@sha256:...
```

`images.lock` 也是脚本生成的：

```text
version: 1
images:
  app:
    image_id: sha256:...
    upstream: ''
    layers:
      - digest: sha256:...
        source: embed
```

最后把固定文件写进 tar：

```python
for name in ["icon.png", "images", "images.lock", "manifest.yml", "package.yml"]:
    tar.add(path, arcname=name)
```

这就是 `nix build .#lpk` 不依赖 `lzc-cli` 的原因：LPK 需要的结构已经自己生成了。

## verify-nix-lzc-build.sh：为什么还要校验路径

既然已经有纯 Nix LPK，为什么还有 `scripts/verify-nix-lzc-build.sh`？

因为发布时不仅要证明“纯 Nix 能打包”，还要证明“这个 Nix 生成的镜像可以被 lzc-cli 那条传统链路接受”。这条脚本就是兼容性校验。

它开头有一段：

```bash
if [[ -z "${IN_NIX_SHELL:-}" ]]; then
  exec nix develop -c bash "$0" "$@"
fi
```

意思是：如果当前不在 Nix dev shell，就重新用 `nix develop` 进入环境再执行自己。这样脚本不依赖用户手动先进入 shell。

然后检查命令：

```bash
require_cmd docker
require_cmd nix
require_cmd python3
```

这条校验路径需要 Docker，因为它要把 Nix 生成的 Docker archive load 到本地 Docker daemon，再让 `lzc-cli` 走 Dockerfile 打包。

### 第一步：构建 Nix 镜像

```bash
nix build .#dockerImage --no-eval-cache
```

这一步生成的是 `lazyport-web:0.1.0-nix` 这个镜像的 Docker archive，输出在 `result`。

### 第二步：加载进 Docker

```bash
docker load -i result
docker image inspect "$IMAGE_NAME"
```

`IMAGE_NAME` 默认是：

```bash
lazyport-web:${PACKAGE_VERSION}-nix
```

如果 `package.yml` 里的 version 是 `0.1.0`，那就是：

```text
lazyport-web:0.1.0-nix
```

### 第三步：生成临时 lzc-cli 配置

脚本会写一个临时文件 `.lzc-cli-build-nix-verify.yml`：

```yaml
pkgout: ./build
icon: ./assets/icon.png
images:
  app:
    builder: local
    dockerfile: ./Dockerfile.nix
    context: .
```

这里的 `Dockerfile.nix` 很特别，只有一行：

```dockerfile
FROM lazyport-web:0.1.0-nix
```

也就是说，`lzc-cli` 不是重新从源码构建镜像，而是基于刚刚 `docker load` 进去的 Nix 镜像再打包。这样可以测试：

- Nix 生成的镜像能不能被 Docker 识别。
- `lzc-cli project build` 能不能吃这个镜像。
- 最终 LPK 里的嵌入镜像引用是不是完整。

### 第四步：修复 image_id

脚本里有个 `repair_lpk_image_ids` 函数，它会解包 LPK，读取：

```text
images/index.json
images/blobs/sha256/...
manifest.yml
images.lock
```

然后找到每个 embedded image 的真实 config digest，把 `manifest.yml` 和 `images.lock` 里的 image id 修正成真实值。

这是为了处理 `lzc-cli` 打包后嵌入镜像引用可能不完全一致的问题。脚本会以包内 OCI index 为准，重新对齐：

```text
embed:app@sha256:真实 config digest
images.lock 里的 image_id: 真实 config digest
```

最后重新打包覆盖原来的 LPK。

## Dockerfile.lzc 和 lzc-build.yml：传统路径

`Dockerfile.lzc` 是传统 Docker 构建路径用的。它分三段：

1. `oven/bun` 构建前端。
2. `node:22-slim` 安装固定版本 `@lazycatcloud/lzc-cli@2.0.6`。
3. `python:3.13-slim` 安装后端依赖、复制前端 dist、启动 uvicorn。

它适合普通 `lzc-cli project build`：

```bash
nix develop -c npx --yes @lazycatcloud/lzc-cli@2.0.6 project build
```

对应的 `lzc-build.yml` 是：

```yaml
pkgout: ./build
icon: ./assets/icon.png
images:
  app:
    builder: remote
    dockerfile: ./Dockerfile.lzc
    context: .
    upstream-match: registry.lazycat.cloud
```

这条路径的意义是：保留和官方/传统 LPK 工具链一致的构建方式。它不如纯 Nix 路径可控，但适合验证项目按常规方式也能打包。

## GitHub Actions 发布流程

`.github/workflows/release-lpk.yml` 是自动发布 LPK 的流程。

触发条件：

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

也就是推送到 `main` 或手动触发都会跑。

主要步骤：

1. checkout 代码，并拉完整 git 历史。
2. 安装 Nix，启用 `nix-command flakes`。
3. 设置 Docker Buildx。
4. 执行 `nix develop -c scripts/verify-nix-lzc-build.sh`。
5. 检查 LPK 里的 `manifest.yml` 是否引用了存在的 embedded image blob。
6. 根据 `package.yml` version、GitHub run number、commit sha 生成 tag。
7. 创建 git tag。
8. 创建 GitHub Release，并上传 `build/*.lpk`。

它用的是校验路径，不是直接 `nix build .#lpk`。原因很务实：Release 产物要确认能通过 `lzc-cli` 那条链路，并且包内嵌入镜像引用完整。

## 实际使用教程

### 1. 进入 Nix 环境

这个项目默认用 Nix，不建议直接用系统环境跑：

```bash
nix develop
```

或者直接每条命令前面加：

```bash
nix develop -c ...
```

### 2. 本地构建前端

```bash
nix develop -c bun install
nix develop -c bun run build
```

这是开发调试用的，不是最可复现的 LPK 路径。

### 3. 本地纯 Nix 构建 LPK

```bash
nix build .#lpk
```

完成后看：

```bash
ls -l result
```

`result` 会指向一个 Nix store 目录，里面有：

```text
cloud.lazycat.app.lazyport-web-v0.1.0-nix.lpk
```

### 4. 远程构建 LPK

确认本机能连上远程构建机：

```bash
ssh debian
```

然后执行：

```bash
nix develop -c scripts/remote-nix-build-lpk.sh
```

如果只是想看看会不会构建：

```bash
nix develop -c scripts/remote-nix-build-lpk.sh --dry-run
```

如果要换远程机：

```bash
nix develop -c env REMOTE_BUILDER=ssh-ng://my-builder scripts/remote-nix-build-lpk.sh
```

如果只远程构建镜像：

```bash
nix develop -c env PACKAGE=.#dockerImage scripts/remote-nix-build-lpk.sh
```

### 5. 校验 lzc-cli 路径

这条需要 Docker daemon：

```bash
nix develop -c scripts/verify-nix-lzc-build.sh
```

成功后产物在：

```text
build/cloud.lazycat.app.lazyport-web-v0.1.0-nix-verify.lpk
```

### 6. 安装 result 里的 LPK

`flake.nix` 里还提供了一个 app：

```bash
nix run .#deployLpk
```

开发 shell 里还包了一层快捷方式：

```bash
nix develop
nix deployLpk
```

它会找 `./result/*.lpk`，然后执行：

```bash
lzc-cli lpk install "$lpk"
```

## 常见问题

### sudo 后找不到 nix

远程机器上如果这样报错：

```text
sudo: nix: command not found
```

说明 root 的 PATH 没有 Nix。用绝对路径：

```bash
/nix/var/nix/profiles/default/bin/nix
```

例如：

```bash
ssh debian 'sudo /nix/var/nix/profiles/default/bin/nix --extra-experimental-features nix-command key generate-secret --key-name debian-builder > /tmp/debian-builder.sec'
```

### experimental feature 没开

如果看到：

```text
experimental Nix feature 'nix-command' is disabled
```

就在 `/etc/nix/nix.conf` 里加：

```conf
experimental-features = nix-command flakes
```

然后重启 nix daemon：

```bash
sudo systemctl restart nix-daemon
```

### 复制远程产物时签名失败

个人开发可以先用默认的：

```bash
--no-check-sigs
```

也就是脚本默认行为。

更规范的做法是远程构建机配置 `secret-key-files`，本机配置 `trusted-public-keys`，然后用 `--check-sigs`。

### fixed-output hash 不匹配

如果改了 `bun.lock` 或依赖版本，`frontendNodeModules` 的 `outputHash` 可能会不匹配。这是正常的，说明依赖输出变了。

处理方式是重新构建，根据 Nix 报错里的 `got: sha256-...` 更新 `flake.nix` 里的 `outputHash`。

## 总结

`lazyport-web` 这套远程 Nix 构建可以按一句话理解：

> 用 `flake.nix` 固定构建过程，用远程 Nix store 执行重活，用脚本把 store path 拉回本机，用 LPK 转换脚本绕开不稳定的本地 Docker/lzc-cli 依赖，再用校验脚本保证传统发布链路还能工作。

各脚本分工也很清楚：

| 文件 | 作用 |
|------|------|
| `flake.nix` | 定义开发环境、前端构建、应用组装、Docker archive、LPK 产物 |
| `scripts/remote-nix-build-lpk.sh` | 把 `nix build` 派发到远程 Nix store，并复制结果回本机 |
| `scripts/docker_archive_to_lpk.py` | 把 Nix 生成的 Docker archive 转成 LPK 包 |
| `scripts/verify-nix-lzc-build.sh` | 用 Nix 镜像走一遍 Docker + lzc-cli 校验构建 |
| `Dockerfile.nix` | 让 lzc-cli 使用已经由 Nix 生成并 load 进 Docker 的镜像 |
| `Dockerfile.lzc` | 传统 Docker/lzc-cli 构建路径 |
| `lzc-build.yml` | 传统 lzc-cli 项目构建配置 |
| `.github/workflows/release-lpk.yml` | CI 上构建、校验、打 tag、发布 LPK |

这套设计的核心价值不是“命令更短”，而是把构建链路拆清楚：依赖安装归 Nix，前端产物归 Nix，应用镜像归 Nix，LPK 组包归脚本，远程执行归 Nix store，发布兼容性归校验脚本。每一层只做一件事，出问题时也更容易定位。
