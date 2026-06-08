---
title: "别再相信本机环境：Nix 远程构建教程"
publishDate: "2026-06-08"
author: "Zerokaze"
description: "从环境乱飞讲起，白话拆一下 Nix 怎么把构建扔到远程机器跑"
tags: [Nix, 教程, Linux]
---

# 别再相信本机环境：Nix 远程构建教程

因为喜欢到处试各种“一键安装”“一键开发环境”“一键构建”，导致本机环境被各种脚本轮番教育。今天 Node 版本不对，明天 Python 依赖炸了，后天 Docker 缓存开始抽象。最离谱的是构建失败以后，你甚至不知道是谁的问题：是项目的问题，是本机 PATH 的问题，是某个全局工具版本的问题，还是上周随手装的脚本偷偷改了什么东西。

然后机器还不止一台。笔记本、台式机、服务器，每台机器装过的东西都不一样。你在 A 机器上能构建，换到 B 机器就开始红温；B 机器修好了，服务器又缺一堆依赖。久而久之，构建这件事就从“跑个命令”变成了“考古本机环境”。

所以后来我越来越觉得：别太相信本机环境。

Nix 远程构建要解决的就是这个问题：

> 构建规则写在 `flake.nix`，依赖由 Nix 固定，真正干活可以交给远程机器，本机只负责发任务和拿结果。

## 这东西在干嘛

先不要把 Nix 想得太玄。它在这里主要做三件事：

1. 把构建要用的工具固定下来，比如 Bun、Node、Python、系统库。
2. 把构建步骤写清楚，比如先装依赖，再 build，再把产物复制到 `$out`。
3. 把构建结果放进 `/nix/store`，用内容 hash 管起来。

远程构建只是再加一步：不在本机 store 构建，而是在远程 store 构建。

本地构建长这样：

```bash
nix build .#myPackage
```

远程构建长这样：

```bash
nix build .#myPackage --store ssh-ng://builder --no-link --print-out-paths
```

大白话翻译：

- `.#myPackage`：我要构建 flake 里的某个目标。
- `--store ssh-ng://builder`：别在本机构建，去 SSH 后面的那台机器构建。
- `--no-link`：先别创建本地 `result`。
- `--print-out-paths`：把构建结果的 store path 打出来。

构建完以后，再把远程产物拉回来：

```bash
nix copy --from ssh-ng://builder /nix/store/...
ln -sfn /nix/store/... result
```

这就是远程构建最核心的三板斧：

```text
nix build --store 远程机器
nix copy --from 远程机器
ln -sfn 结果 result
```

## 为什么不是 ssh 上去手动 build

当然可以 SSH 上去手动跑：

```bash
ssh builder
cd project
nix build
```

但这又回到了老问题：远程机器上有没有源码？是不是最新提交？路径是不是对？你是不是忘了 pull？构建结果怎么拿回来？拿回来以后怎么和本机 store 对齐？

`--store ssh-ng://builder` 的体验不一样。你仍然在本机项目目录里发起构建，Nix 自己负责和远程 store 通信。你不需要手动进远程目录，也不需要在远程机器上维护一份同路径源码。

Nix 会把需要的输入传给远程构建端，远程端按同一套 flake 规则构建。构建结果是 store path，比如：

```text
/nix/store/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-my-package
```

这个路径不是随便起的，它和内容、输入、构建规则有关。远程是这个路径，复制回本机以后还是这个路径。因为 Nix store path 本来就是内容寻址的一部分。

## flake.nix：把构建收编

远程构建能稳定的前提，是你先把构建写进 `flake.nix`。不然你只是把混乱从本机搬到了远程机器。

一个典型结构大概是这样：

```nix
{
  description = "example remote build project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs, ... }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAllSystems = f:
        nixpkgs.lib.genAttrs systems
          (system: f nixpkgs.legacyPackages.${system});
    in
    {
      packages = forAllSystems (pkgs: {
        default = pkgs.stdenvNoCC.mkDerivation {
          pname = "my-app";
          version = "0.1.0";
          src = ./.;

          nativeBuildInputs = [
            pkgs.bun
            pkgs.nodejs_22
          ];

          buildPhase = ''
            bun install --frozen-lockfile
            bun run build
          '';

          installPhase = ''
            mkdir -p $out
            cp -R dist/. $out/
          '';
        };
      });
    };
}
```

这段不复杂。它只是告诉 Nix：

- 依赖来自哪一版 `nixpkgs`。
- 支持哪些系统架构。
- 默认包怎么构建。
- 构建需要什么工具。
- build 阶段跑什么。
- install 阶段把什么放到 `$out`。

这里最关键的是 `$out`。Nix 构建最后只认 `$out` 里的东西。你 build 出来的产物如果没复制到 `$out`，那就等于没交卷。

## 锁住依赖：别再吃本机 node_modules

很多前端项目最容易乱的地方就是 `node_modules`。本机有一份，CI 有一份，服务器又有一份。版本看起来差不多，实际谁也不知道里面是什么状态。

更稳的做法是把依赖也拆成 Nix 的一层产物。比如先构建一份固定的 `node_modules`：

```nix
frontendNodeModules = pkgs.stdenvNoCC.mkDerivation {
  pname = "my-app-node_modules";
  version = "0.1.0";
  src = ./.;

  nativeBuildInputs = [
    pkgs.bun
    pkgs.writableTmpDirAsHomeHook
  ];

  dontConfigure = true;

  buildPhase = ''
    export BUN_INSTALL_CACHE_DIR=$(mktemp -d)
    bun install --frozen-lockfile --ignore-scripts --no-progress
  '';

  installPhase = ''
    mkdir -p $out
    cp -R node_modules $out/node_modules
  '';

  dontFixup = true;
  outputHash = "sha256-...";
  outputHashAlgo = "sha256";
  outputHashMode = "recursive";
};
```

这一步的意思是：别用工作区里那份不知道被谁污染过的 `node_modules`，让 Nix 按锁文件安装一份，然后把它放进 store。

几个点：

- `--frozen-lockfile`：锁文件说什么就是什么，不允许偷偷更新。
- `--ignore-scripts`：减少安装脚本乱跑带来的不确定性。
- `outputHash`：因为下载依赖涉及网络，Nix 要提前知道输出 hash。

之后真正构建前端时，从这份固定依赖复制：

```nix
frontend = pkgs.stdenvNoCC.mkDerivation {
  pname = "my-app-frontend";
  version = "0.1.0";
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
    bun run build
  '';

  installPhase = ''
    mkdir -p $out
    cp -R dist/. $out/
  '';
};
```

这样构建不再关心你本机有没有 `node_modules`，也不关心它是不是昨天留下来的。Nix 会按自己的依赖产物来。

`patchShebangs node_modules` 是 Nix 里经常用的修补动作。很多脚本第一行会写 `/usr/bin/env node`，在 Nix 隔离环境里不一定稳，修一下解释器路径可以少踩坑。

## 写一个远程构建脚本

命令每次手敲很烦，所以可以包一层脚本：

```bash
#!/usr/bin/env bash
set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

REMOTE_BUILDER="${REMOTE_BUILDER:-ssh-ng://builder}"
PACKAGE="${PACKAGE:-.#default}"
OUT_LINK="${OUT_LINK:-result}"
NIX_COPY_FLAGS="${NIX_COPY_FLAGS:---no-check-sigs}"

BUILD_ARGS=()
DRY_RUN=0

for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=1
      BUILD_ARGS+=("$arg")
      ;;
    --no-check-sigs)
      NIX_COPY_FLAGS="--no-check-sigs"
      ;;
    --check-sigs)
      NIX_COPY_FLAGS=""
      ;;
    *)
      BUILD_ARGS+=("$arg")
      ;;
  esac
done

if [[ "$DRY_RUN" -eq 1 ]]; then
  exec nix build "$PACKAGE" \
    --store "$REMOTE_BUILDER" \
    --no-link \
    "${BUILD_ARGS[@]}"
fi

out_path="$(nix build "$PACKAGE" \
  --store "$REMOTE_BUILDER" \
  --no-link \
  --print-out-paths \
  "${BUILD_ARGS[@]}")"

COPY_ARGS=()
if [[ -n "$NIX_COPY_FLAGS" ]]; then
  read -r -a COPY_ARGS <<< "$NIX_COPY_FLAGS"
fi

nix copy --from "$REMOTE_BUILDER" "${COPY_ARGS[@]}" "$out_path"
ln -sfn "$out_path" "$OUT_LINK"
echo "$OUT_LINK -> $out_path"
```

这个脚本的逻辑很朴素：

1. 回到项目根目录。
2. 读取远程构建机地址。
3. 读取要构建的 flake 目标。
4. 远程 `nix build`。
5. `nix copy` 拉回本机。
6. 更新 `result`。

默认用法：

```bash
nix develop -c scripts/remote-nix-build.sh
```

换远程机器：

```bash
nix develop -c env REMOTE_BUILDER=ssh-ng://my-builder scripts/remote-nix-build.sh
```

换构建目标：

```bash
nix develop -c env PACKAGE=.#frontend scripts/remote-nix-build.sh
```

只看构建计划：

```bash
nix develop -c scripts/remote-nix-build.sh --dry-run
```

## 远程机器要准备什么

远程机器不用装项目的一堆开发工具，但需要这些基础条件：

1. 本机能无密码 SSH 上去。
2. 远程机器安装了 Nix。
3. 远程 Nix 启用了 `nix-command` 和 `flakes`。
4. 远程机器架构能构建目标，比如 `x86_64-linux` 或 `aarch64-linux`。

SSH 配置可以长这样：

```sshconfig
Host builder
  HostName <builder-host>
  User your-user
  IdentityFile ~/.ssh/id_ed25519
```

远程机器的 Nix 配置至少要有：

```conf
experimental-features = nix-command flakes
```

如果你用的是 daemon 模式，改完配置后重启：

```bash
sudo systemctl restart nix-daemon
```

先测试 SSH：

```bash
ssh builder 'nix --version'
```

再测试远程 store：

```bash
nix store ping --store ssh-ng://builder
```

能通以后再跑远程构建。

## 签名校验：开发可以糙，正式别糙

脚本里默认用了：

```bash
--no-check-sigs
```

这适合个人开发环境：我能 SSH 到这台机器，我也信它，先别为了签名把自己卡死。

但更正式的做法是让远程构建机给 store path 签名，本机信任它的 public key。

远程机器生成 key：

```bash
ssh builder 'sudo mkdir -p /etc/nix/signing && sudo chmod 700 /etc/nix/signing'
ssh builder 'sudo nix key generate-secret --key-name builder > /tmp/builder.sec'
ssh builder 'sudo mv /tmp/builder.sec /etc/nix/signing/builder.sec'
ssh builder 'sudo chmod 600 /etc/nix/signing/builder.sec'
```

导出 public key：

```bash
ssh builder 'sudo cat /etc/nix/signing/builder.sec | nix key convert-secret-to-public'
```

远程机器 `/etc/nix/nix.conf` 加：

```conf
secret-key-files = /etc/nix/signing/builder.sec
```

本机 `/etc/nix/nix.conf` 的 `trusted-public-keys` 加上导出的 public key。

然后跑：

```bash
nix develop -c scripts/remote-nix-build.sh --check-sigs
```

如果 `sudo nix` 报找不到命令，大概率是 root 的 PATH 没有 Nix。可以用绝对路径：

```bash
/nix/var/nix/profiles/default/bin/nix
```

## 远程构建适合什么场景

它很适合这些情况：

- 本机性能一般，构建很慢。
- 有多台机器，不想每台都手动配开发环境。
- 项目依赖多，本机环境容易乱。
- 想把构建结果放进 Nix store 管起来。
- 想让 CI、本机、服务器尽量跑同一套构建规则。

但它不是万能药。

如果你的 `flake.nix` 里面还在偷偷依赖本机路径、全局命令、未声明的环境变量，那远程构建一样会炸。Nix 远程构建只是把问题暴露得更早，不会替你把脏构建变干净。

## 常见爆炸点

### flakes 没开

报这个：

```text
experimental Nix feature 'nix-command' is disabled
```

就在 `nix.conf` 里加：

```conf
experimental-features = nix-command flakes
```

### sudo 后找不到 nix

报这个：

```text
sudo: nix: command not found
```

说明 root 的 PATH 没有 Nix。用绝对路径：

```bash
/nix/var/nix/profiles/default/bin/nix
```

### outputHash 不匹配

如果 fixed-output derivation 报 hash 不匹配，一般是锁文件或依赖输出变了。Nix 报错里会给 `got: sha256-...`，把它更新到 `flake.nix` 里即可。

这不是玄学报错，它是在告诉你：这份依赖产物和你之前声明的不一样。

### 远程架构不对

比如你本机是 `x86_64-linux`，远程是 `aarch64-linux`，而 flake 里没写对应系统，或者某些依赖不支持目标架构，就会炸。

所以 flake 里最好明确支持系统：

```nix
systems = [ "x86_64-linux" "aarch64-linux" ];
```

### 复制 store path 签名失败

开发时可以先用：

```bash
--no-check-sigs
```

正式一点就配置远程签名 key 和本机 trusted public key。

## 总结

Nix 远程构建本质上是在治一种病：不要让构建继续依赖“我这台机器刚好能跑”。

`flake.nix` 把构建规则收紧，`--store ssh-ng://builder` 把重活搬到远程机器，`nix copy` 把 store path 拉回本机。最后你拿到的不是某个目录里随手生成的产物，而是一份由 Nix store 管起来的构建结果。

这套东西的价值不是命令变短，而是把构建从玄学现场变成一条能拆、能查、能迁移的流程。本机乱一点没关系，远程机器强一点也可以，关键是构建规则别乱飞。
