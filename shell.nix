# This installs the build requirements using Nix.
# Enter environment using `nix-shell` and continue from README.md's '## Setup Steps'

let
  rust_overlay = import (builtins.fetchTarball "https://github.com/oxalica/rust-overlay/archive/master.tar.gz");
  pkgs = import <nixpkgs> { overlays = [ rust_overlay ]; };
in
with pkgs;
mkShell {
  buildInputs = [
    nodejs
    wasm-pack
    pkg-config
    openssl
    binaryen # For wasm-opt (optional, but nice to have no warnings)
    (rust-bin.fromRustupToolchain {
      channel = "stable";
      components = [ "cargo" ];
      targets = [ "wasm32-unknown-unknown" ];
    })
  ];
}
