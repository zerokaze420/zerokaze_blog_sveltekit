{
  description = "一个基于Nix flake的Bun开发环境，包含前端构建和Podman容器";

  inputs = {
    nixpkgs.url = "https://flakehub.com/f/NixOS/nixpkgs/0.1";
    bun2nix.url = "github:baileyluTCD/bun2nix";
    bun2nix.inputs.nixpkgs.follows = "nixpkgs";
  };

  nixConfig = {
    extra-substituters = [
      "https://cache.nixos.org"
      "https://cache.garnix.io"
    ];
    extra-trusted-public-keys = [
      "cache.nixos.org-1:6NCHdD59X431o0gWypbMrAURkbJ16ZPMQFGspcDShjY="
      "cache.garnix.io:CTFPyKSLcx5RMJKfLo5EEPUObbA78b0YQ2DTCJXqr9g="
    ];
  };

  outputs = inputs:
    let
      # 定义支持的系统架构
      supportedSystems = [ "x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin" ];
      # 为每个支持的系统应用一个函数，导入相应的nixpkgs
      # 这个函数会向传入的 f 函数提供 { pkgs, system }
      forEachSupportedSystem = f: inputs.nixpkgs.lib.genAttrs supportedSystems (system: f {
        pkgs = import inputs.nixpkgs { inherit system; };
        inherit system; # 传递 system 变量
      });
    in
    {
      # 定义开发shell环境
      # 修复：这里也需要接收 system 参数，以匹配 forEachSupportedSystem 的调用方式
      devShells = forEachSupportedSystem ({ pkgs, system }: {
        default = pkgs.mkShell {
          packages = with pkgs; [
            bun
            bun2nix # <--- 添加了 bun2nix
          ]; # 在开发环境中提供bun和bun2nix
        };
      });

      packages = forEachSupportedSystem ({ pkgs, system }: {
        # 将 my-package 重命名为 default
        default = pkgs.callPackage ./default.nix {
          inherit (inputs.bun2nix.lib.${system}) mkBunDerivation;
        };
      });
    };
}
