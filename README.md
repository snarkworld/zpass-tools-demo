# zPass Tools

zPass Tools integrates the innovative capabilities of WebAssembly (wasm) with Rust, Node.js, and Aleo, offering a unique toolkit that exemplifies state-of-the-art cryptographic functions and decentralized applications.

## Installation

### Prerequisites

Before installation, ensure you have the following prerequisites:

#### Node.js (version 18 or higher)

Download and install from [Node.js](https://nodejs.org/en/download/).

#### Rust (rustc 1.71.1 & cargo 1.71.1)

- Install Rust using:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
  ```

#### wasm-pack

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
   Navigate to the issuer directory and build the wasm package targeting a bundler:

   ```bash
   cd issuer
   wasm-pack build --target bundler
   ```

3. **Start the Application**
   Return to the root directory and launch the application:
   ```bash
   cd ..
   npm run dev
   ```

Enjoy using **zPass Tools**!

<Disclaimer>
#### Disclaimer

#### Non-Production Build

This repository is for demonstration and educational purposes only and is not intended for production use. It's a showcase of integrating advanced technologies like Aleo, WebAssembly, Rust, and Node.js.

#### Note:
- Security: May contain vulnerabilities unsuitable for a production environment.
- Testing: Limited testing implies potential bugs or stability issues.
- Maintenance: Updates or security patches are not guaranteed.
- Purpose: Designed primarily for demonstration and education in advanced cryptographic and decentralized technologies.

#### Recommendations:

- Learning Tool: Ideal for understanding Aleo's blockchain technology and cryptographic functions.
- Experimentation: A platform for testing and exploration, not for real-world application deployment.
- Feedback & Contributions: Contributions to enhance its educational value are welcome.

By utilizing this code, you acknowledge this disclaimer, understanding its limitations for non-production use.

</Disclaimer>
