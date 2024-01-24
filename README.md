# zPass Tools

## Installation

### Prerequisites

1. **Node.js (version 18 or higher)**

   - Download from [Node.js official website](https://nodejs.org/en/download/)

2. **Rust (rustc 1.71.1 & cargo 1.71.1)**
   - Install using the following command:
     ```bash
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     ```

3. **wasm-pack**
   - Install using the following command:
     ```bash
     curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
     ```

### Setup Steps

1. **Install Node Modules**
   ```bash
   npm i
   ```

2. **Build wasm Package**
   ```bash
   cd issuer
   wasm-pack build --target bundler
   ```

3. **Start the Application**
   ```bash
   cd ..
   npm run dev
   ```

Enjoy using **zPass Tools**!