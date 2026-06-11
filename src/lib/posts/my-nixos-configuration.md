---
title: "我的 NixOS 配置：从 Flake 到桌面和服务器"
publishDate: "2026-06-11"
author: "Zerokaze"
description: "讲解我在 /home/tux/code/nixos 中维护的 NixOS Flake 配置：主机分层、共享模块、Home Manager、桌面环境和日常维护方式。"
tags: [NixOS, Nix, Linux, 配置]
---

# 我的 NixOS 配置：从 Flake 到桌面和服务器

我的 NixOS 配置放在 `/home/tux/code/nixos`。这个仓库不是单台机器的 `configuration.nix`，而是一个 Flake 仓库，用同一套入口管理桌面机、笔记本和服务器。

它的目标很直接：硬件差异留在 `hosts/`，可复用能力沉到 `Modules/` 和 `homeModules/`，所有主机都从 `flake.nix` 生成。这样改桌面环境、Shell、输入法、虚拟化、Docker 之类的配置时，不需要在多台机器之间复制粘贴。

## 总体结构

仓库核心目录如下：

```text
/home/tux/code/nixos
├── flake.nix
├── home.nix
├── hosts/
│   ├── desktop/
│   ├── laptop/
│   └── server/
├── Modules/
│   ├── desktop/
│   ├── services/
│   └── user/
├── homeModules/
│   ├── desktop/
│   └── shell/
└── config/
    ├── hypr/
    └── niri/
```

这套结构分成三层：

| 层级 | 目录 | 职责 |
| --- | --- | --- |
| Flake 入口 | `flake.nix` | 定义输入源、共享模块、主机输出 |
| 系统配置 | `hosts/`、`Modules/` | 管理 NixOS 层面的服务、硬件、用户、桌面能力 |
| 用户配置 | `home.nix`、`homeModules/`、`config/` | 管理 Home Manager、终端、编辑器、桌面配置文件 |

我比较喜欢这种拆法，因为它把“机器是什么”和“能力是什么”分开了。`desktop`、`laptop`、`server` 是机器；`pipewire`、`docker`、`virt`、`fish`、`plasma` 是能力。机器只选择自己需要的能力。

## Flake 入口

`flake.nix` 里最重要的是 `inputs`、共享模块和 `hostDefs`。

输入源包含：

- `nixpkgs`：使用 `nixos-unstable`。
- `home-manager`：跟随同一个 `nixpkgs`。
- `hyprland`：桌面环境的一部分。
- `zen-browser`：浏览器 Flake 输入。
- `plasma-manager`：用 Home Manager 管理 KDE Plasma 配置。

主机定义集中在 `hostDefs`：

```nix
hostDefs = {
  "nixos"   = { type = "desktop"; dir = "desktop"; };
  "desktop" = { type = "desktop"; dir = "desktop"; };
  "laptop"  = { type = "desktop"; dir = "laptop"; };
  "server"  = { type = "server";  dir = "server"; };
};
```

这里的设计很实用：`nixos` 和 `desktop` 都指向同一台桌面机，前者可以作为本机默认别名，后者更像语义化名称。`laptop` 复用桌面类模块，但硬件和电源策略不同。`server` 则走更小的模块集合。

生成主机配置时，`mkModules` 会把模块拼起来：

```nix
mkModules = def:
  globalModules
  ++ (if def.type == "desktop" then desktopModules else [ ])
  ++ [ (./hosts + "/${def.dir}/configuration.nix") ];
```

这意味着所有机器都会加载 `globalModules`，桌面类机器额外加载 `desktopModules`，最后再加载自己的 `hosts/<name>/configuration.nix`。

## 共享模块

共享模块分为两组：全局模块和桌面模块。

全局模块目前包含 OpenSSH、`nh` 和 Hyprland overlay。`nh` 的配置很关键：

```nix
programs.nh = {
  enable = true;
  clean.enable = true;
  clean.extraArgs = "--keep-since 4d --keep 3";
  flake = "/home/tux/code/nixos";
};
```

这样之后可以在任意目录执行：

```bash
nh os switch
```

不用每次都手写 `sudo nixos-rebuild switch --flake /home/tux/code/nixos#...`。同时 `nh clean` 会保留最近 4 天和 3 个 generation，避免 Nix store 无限增长。

桌面模块包含：

- `Modules/user/tux.nix`：创建 `tux` 用户，默认 shell 是 fish，并加入 `wheel`、`libvirtd`。
- `Modules/desktop/i18n.nix`：设置 `en_US.UTF-8`、`zh_CN.UTF-8`、时区和 fcitx5 中文输入法。
- `Modules/environment.nix`：集中设置 Wayland、Qt、fcitx、Android SDK license 等环境变量。
- `Modules/services/dae.nix`：启用 dae，并指向外部配置文件。
- Home Manager：把用户态配置接进系统构建。
- Hyprland、Plasma、Niri 相关模块。

这种拆法的好处是：桌面体验相关的公共配置只写一次，桌面机和笔记本都能复用。

## 三类主机

桌面机配置位于 `hosts/desktop/configuration.nix`。它启用了 systemd-boot、Zen kernel、Intel Arc 相关图形包、SDDM、Plasma 6、Hyprland、Niri、NetworkManager、fish、`nix-ld`、Docker、libvirt 和 PipeWire。

桌面机的默认会话是：

```nix
services.displayManager.defaultSession = "hyprland";
```

这说明 Plasma 被保留为完整桌面环境，但日常默认进入 Hyprland。Niri 也同时启用，并为 file chooser 指定 KDE portal：

```nix
xdg.portal.config.niri = {
  "org.freedesktop.impl.portal.FileChooser" = [ "kde" ];
};
```

笔记本配置位于 `hosts/laptop/configuration.nix`。它和桌面机很像，但额外启用了 TLP，并关闭 `power-profiles-daemon`：

```nix
services.power-profiles-daemon.enable = false;
```

TLP 模块里把接电时的 CPU 策略设置为 performance，把电池模式设置为 powersave，并设置电池充电阈值：

```nix
START_CHARGE_THRESH_BAT0 = 40;
STOP_CHARGE_THRESH_BAT0 = 80;
```

服务器配置位于 `hosts/server/configuration.nix`。它明显更克制：GRUB、NetworkManager、Asia/Shanghai 时区、OpenSSH，以及 `vim`、`wget`、`fish`、`git`、`tmux`、`btop` 等基础工具。它没有加载桌面模块，也不会引入 Home Manager 的桌面配置。

## Home Manager

`home.nix` 是用户态配置入口，绑定用户 `tux`：

```nix
home.username = "tux";
home.homeDirectory = "/home/tux";
```

它导入了 Git、fish、starship、VS Code、kitty、helix、Hyprland、Niri、Plasma 等模块，并安装一组日常工具，比如 `htop`、`devenv`、`docker`、`yazi`、`firefox`、`rust-analyzer`、`nodejs`、`bun`、`grim`、`slurp`、`wl-clipboard`。

这里有一个值得保留的边界：系统服务放在 NixOS module，用户体验放在 Home Manager。比如：

- Docker daemon 是系统服务，放在 `Modules/services/docker.nix`。
- VS Code 插件是用户配置，放在 `homeModules/vscode.nix`。
- Hyprland 程序启用在系统层，具体配置文件通过 Home Manager 写到 `~/.config/hypr/`。

Hyprland 的 Home Manager 模块没有把配置内容直接塞进 Nix 字符串，而是引用 `config/hypr/hyprland.lua`：

```nix
xdg.configFile."hypr/hyprland.lua" = {
  source = hyprlandConf;
  force = true;
};
```

然后生成一个很薄的 `hyprland.conf`：

```nix
xdg.configFile."hypr/hyprland.conf" = {
  text = "source = ~/.config/hypr/hyprland.lua";
  force = true;
};
```

这样复杂窗口管理器配置仍然保留在原生配置文件里，Nix 只负责分发和链接。

## 桌面体验

这套配置的桌面重点是 Wayland。

系统环境变量集中设置了：

```nix
QT_QPA_PLATFORM = "wayland";
NIXOS_OZONE_WL = "1";
QT_QPA_PLATFORMTHEME = "qt6ct";
GTK_IM_MODULE = "fcitx";
QT_IM_MODULE = "fcitx";
XMODIFIERS = "@im=fcitx";
SDL_IM_MODULE = "fcitx";
```

这几项解决的是日常桌面最常见的问题：Qt 走 Wayland，Chromium/Electron 类程序走 Ozone Wayland，Qt 主题走 `qt6ct`，输入法统一走 fcitx5。

KDE Plasma 的配置通过 `plasma-manager` 管理，包括图标、光标、暗色外观、壁纸、快捷键和 KWin 行为。例如工作区数量被固定为 4：

```nix
kwinrc.Desktops.Number = {
  value = 4;
  immutable = true;
};
```

这类配置如果靠图形界面点，重装后很难恢复；写进 Home Manager 后，桌面偏好也成为系统配置的一部分。

## 服务和开发环境

服务模块主要关注几个高频场景：

| 模块 | 作用 |
| --- | --- |
| `pipewire.nix` | 启用 PipeWire、ALSA、PulseAudio 兼容和 rtkit |
| `docker.nix` | 启用 Docker，并把 `tux` 加入 `docker` 组 |
| `virt.nix` | 启用 libvirt、virt-manager、TPM 模拟和 USB 重定向 |
| `dae.nix` | 启用 dae |
| `tlp.nix` | 管理笔记本性能、电源和充电阈值 |

开发环境没有全部塞进一个超大的 `environment.systemPackages`。系统层只放更偏系统的工具，Home Manager 再补用户常用工具。这样的好处是配置职责更清楚：系统能力属于机器，编辑器、Shell、终端和语言工具属于用户。

## 日常使用

检查 Flake：

```bash
nix flake check --show-trace
```

切换指定主机：

```bash
sudo nixos-rebuild switch --flake .#desktop
sudo nixos-rebuild switch --flake .#laptop
sudo nixos-rebuild switch --flake .#server
```

如果在已配置 `nh` 的机器上，日常更推荐：

```bash
nh os switch
```

添加新机器时，一般只需要三步：

1. 在 `hosts/` 下新增主机目录。
2. 写入对应的 `configuration.nix` 和 `hardware-configuration.nix`。
3. 在 `flake.nix` 的 `hostDefs` 中新增一项。

如果新机器也是桌面，就设为 `type = "desktop"`；如果是服务器，就设为 `type = "server"`。真正需要特别处理的内容放在该主机自己的 `configuration.nix`，不要污染共享模块。

## 我喜欢这套配置的原因

这套配置的重点不是“把所有东西都 Nix 化”，而是把稳定边界固定下来：

- 主机差异在 `hosts/`。
- 系统能力在 `Modules/`。
- 用户环境在 `homeModules/`。
- 复杂外部配置在 `config/`。
- 统一入口在 `flake.nix`。

这样做之后，NixOS 配置就不是一份越来越长的 `configuration.nix`，而是一个可以扩展的系统描述。桌面机可以激进一点，启用 Hyprland、Niri、Plasma、Docker、libvirt；服务器可以保持简单，只保留 SSH 和基础工具。两者仍然共享同一个 Flake 入口和同一套维护方式。

对个人机器来说，这已经足够实用：能复现，能迁移，能分层，也不会为了抽象而抽象。
