use super::*;

/// Exposes a Rust function to JavaScript for signing messages.
/// Returns the response as `SignResponse` or a `JsValue` error.
#[wasm_bindgen]
pub fn sign_message(private_key: String, message: SignInboundMessage, hash_alg: HashAlgorithm) -> Result<SignResponse, JsValue> {
    match sign_message_with_logger(private_key, message, hash_alg, &ConsoleLogger) {
        Ok((signature, hash)) => {
            Ok(
                SignResponse::new(signature, hash)
            )
        }
        Err(err) => {
            Err(JsValue::from_str(&err.to_string()))
        }
    }
}

/// A struct representing the response of a signing operation.
#[wasm_bindgen]
pub struct SignResponse {
    pub(crate) signature: String,
    pub(crate) hash: String,
}

impl SignResponse {
    /// Creates a new instance of `SignResponse`.
    pub fn new(signature: String, hash: String) -> Self {
        SignResponse { signature, hash }
    }
}

#[wasm_bindgen]
impl SignResponse {
    /// Returns the signature from the response.
    #[wasm_bindgen(getter)]
    pub fn signature(&self) -> String {
        self.signature.clone()
    }

    /// Sets the signature in the response.
    #[wasm_bindgen(setter)]
    pub fn set_signature(&mut self, signature: String) {
        self.signature = signature;
    }

    /// Returns the hash from the response.
    #[wasm_bindgen(getter)]
    pub fn hash(&self) -> String {
        self.hash.clone()
    }

    /// Sets the hash in the response.
    #[wasm_bindgen(setter)]
    pub fn set_hash(&mut self, hash: String) {
        self.hash = hash;
    }
}

/// An enum representing the various hash algorithms supported.
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum HashAlgorithm {
    POSEIDON2 = 0,
    BHP1024 = 1,
    SHA3_256 = 2,
    KECCAK256 = 3
}

/// A struct representing the message to be signed in.
#[wasm_bindgen]
#[derive(Debug, Clone)]
pub struct SignInboundMessage {
    pub(crate) subject: String,
    pub(crate) dob: u32,
    pub(crate) nationality: Option<String>,
    pub(crate) expiry: Option<u32>,
}

#[wasm_bindgen]
impl SignInboundMessage {
    /// Constructor for `SignInboundMessage`.
    #[wasm_bindgen(constructor)]
    pub fn new(subject: String, dob: u32, nationality: Option<String>, expiry: Option<u32>) -> SignInboundMessage {
        // Create a new instance with provided values
        SignInboundMessage {
            subject,
            dob,
            nationality,
            expiry
        }
    }

    // Getter methods for various fields...
    #[wasm_bindgen(getter)]
    pub fn subject(&self) -> String {
        self.subject.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn dob(&self) -> u32 {
        self.dob.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn nationality(&self) -> Option<String> {
        self.nationality.clone()
    }

    #[wasm_bindgen(getter)]
    pub fn expiry(&self) -> Option<u32> { self.expiry.clone() }
}

/// Exposes a Rust function to JavaScript for converting a string option to a field value.
#[wasm_bindgen]
pub fn get_field_from_value(str: Option<String>) -> Result<String, String> {
    let field = string_to_field(str).map_err(|e| e.to_string())?;
    Ok(field.to_string())
}
