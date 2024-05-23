 { description = "Nix Development Flake for your package";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/master";

  outputs =
    { self, nixpkgs, flake-utils }:

    flake-utils.lib.eachDefaultSystem
      (system:
      let
        pkgs = import nixpkgs { inherit system; };
        python = pkgs.python310;
        pythonPackages = python.pkgs;
      in
      {
        devShells.default = pkgs.mkShell {
          name = "your_package";
          nativeBuildInputs = [ pkgs.bashInteractive ];
          buildInputs = with pythonPackages; [
            pkgs.nodePackages.pyright
            pkgs.poetry
            setuptools
            wheel
            venvShellHook
          ];
          venvDir = ".venv";
          src = null;
          postVenv = ''
            unset SOURCE_DATE_EPOCH
          '';
          postShellHook = ''
            unset SOURCE_DATE_EPOCH
            unset LD_PRELOAD

            PYTHONPATH=$PWD/$venvDir/${python.sitePackages}:$PYTHONPATH
          '';
        };
      });
}
