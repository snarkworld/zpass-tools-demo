// Extern crate
extern crate core;

// Modules
mod helpers;
pub mod wasm;
mod error;

// Crate level imports
pub use wasm::*;

// Standard library imports
use std::convert::TryFrom;
use std::str::FromStr;

// External crate imports
use snarkvm::prelude::{
    Address, Field, Identifier, Literal, Network, Plaintext, PrivateKey, Scalar, Signature, TestRng,
    Testnet3 as CurrentNetwork, ToBits, ToFields, Uniform, Value, Zero, U32
};
use indexmap::IndexMap;
use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use anyhow::anyhow;

// Internal module imports
use crate::error::CustomError;
use crate::helpers::{
    ConsoleLogger, Logger, create_hash, generate_message_with_addresses_and_fields,
    sign_message_with_private_key, string_to_field, string_to_value_fields,
    verify_signature_with_address_and_message,
};

#[derive(Serialize, Deserialize)]
pub struct Message {
    issuer: String,
    subject: String,
    dob: String,
}
#[derive(Debug)]
struct Credential {
    issuer: Address<CurrentNetwork>,
    subject: Address<CurrentNetwork>,
    dob: U32<CurrentNetwork>,
    nationality: Field<CurrentNetwork>,
    expiry: U32<CurrentNetwork>,
}

/// Signs the provided message using the given private key.
///
/// This function also logs various stages of the signing process using the provided logger.
///
/// # Parameters
///
/// - `private_key`: A string representing the private key to sign the message.
/// - `message`: The message to be signed, wrapped inside `SignInboundMessage` struct.
/// - `hash`: The hash algorithm to be used.
/// - `logger`: Logger to log various stages of the signing process.
///
/// # Returns
///
/// A result with tuple of signature and hash as strings if successful, otherwise returns a `CustomError`.
pub fn sign_message_with_logger(private_key: String, message: SignInboundMessage, hash: HashAlgorithm, logger: &dyn Logger) -> Result<(String, String), CustomError> {
    let private_key = PrivateKey::<CurrentNetwork>::from_str(&private_key)
        .map_err(|e| anyhow!("Failed to parse private key: {}", e))?;
    let issuer = Address::<CurrentNetwork>::try_from(&private_key)
        .map_err(|e| anyhow!("Failed to parse issuer address: {}", e))?;
    let subject = Address::<CurrentNetwork>::from_str(message.subject.as_str())
        .map_err(|e| anyhow!("Failed to parse subject address: {}", e))?;
    let dob = U32::new(message.dob);
    let nationality = string_to_field(message.nationality)?;
    let expiry = U32::new(message.expiry.unwrap_or_default());

    logger.log(&format!("Income Hash Algo: {:?}", hash));

    let credential  = Credential {
        issuer,
        subject,
        dob,
        nationality,
        expiry
    };

    let credentials_message: Value<CurrentNetwork> = generate_message_with_addresses_and_fields(credential)?;
    let hash = create_hash(credentials_message.clone(), hash)?;
    let mut rng = TestRng::default();

    let hash_fields = string_to_value_fields(hash.to_string().as_str());

    let (signature, _nonce) = sign_message_with_private_key(
        &private_key,
        hash_fields.as_slice(),
        &mut rng
    )?;

    let verified = verify_signature_with_address_and_message(
        &signature,
        &issuer,
        hash_fields.as_slice()
    );

    assert!(verified, "Signature was not verified properly!");

    logger.log(&format!("DOB Field is: {:?}", dob.to_string()));
    logger.log(&format!("Message: {:?}", credentials_message));
    logger.log(&format!("Signature: {:?}", signature));
    logger.log(&format!("Verified: {:?}", verified));
    logger.log(&format!("Nationality: {:?}", nationality));
    logger.log(&format!("Expiration: {:?}", expiry));
    logger.log(&format!("Hash: {:?}", hash));


    Ok((signature.to_string(), hash.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use helpers::StdoutLogger;
    use crate::helpers::{create_hash, generate_message_with_addresses_and_fields, string_to_value};

    fn get_test_data() -> (String, String, String, u32) {
        let private_key = "APrivateKey1zkp5LqRmm7535XfiX77VPQEgsS2Dj1B2DvH4QNP1UYrHEoR".to_string();
        let issuer = "aleo1ekyuzclmcw3aj7qncsxxaapxem82mgrd8zadgrrvl5k705zx6q9s7usuqy".to_string();
        let subject = "aleo14w44zfrehup9g894j7tgeyz5gsjuxn0nfn09vd2fvpznrg85rs8skywkte".to_string();
        let dob = 20000101u32;
        (private_key, issuer, subject, dob)
    }

    #[test]
    fn test_sign_message_with_private_key() {
        let (private_key, _, subject, dob) = get_test_data();
        let message = SignInboundMessage {
            subject,
            dob,
            nationality: None,
            expiry: None
        };
        let result = sign_message_with_logger(private_key, message, HashAlgorithm::POSEIDON2, &StdoutLogger);

        assert!(result.is_ok());

        let (_, _) = result.unwrap();
    }

    #[test]
    fn test_create_hash_with_different_messages_psd2() {
        let message1 = string_to_value("123field");
        let message2 = string_to_value("321field");

        let hash1 = create_hash(message1, HashAlgorithm::POSEIDON2).unwrap();
        let hash2 = create_hash(message2, HashAlgorithm::POSEIDON2).unwrap();

        assert_ne!(hash1, hash2, "Hashes of different messages should be different");
    }

    #[test]
    fn test_create_hash_with_different_messages_bhp1024() {
        let message1 = string_to_value("123field");
        let message2 = string_to_value("321field");

        let hash1 = create_hash(message1, HashAlgorithm::BHP1024).unwrap();
        let hash2 = create_hash(message2, HashAlgorithm::BHP1024).unwrap();

        assert_ne!(hash1, hash2, "Hashes of different messages should be different");
    }

    #[test]
    fn test_create_hash_with_same_messages_psd2() {
        let message = string_to_value("123field");


        let hash1 = create_hash(message.clone(), HashAlgorithm::POSEIDON2).unwrap();
        let hash2 = create_hash(message.clone(), HashAlgorithm::POSEIDON2).unwrap();

        println!("{}", hash1.clone());
        println!("{}", hash2.clone());

        assert_eq!(hash1, hash2, "Hashes of the same message should be the same");
    }

    #[test]
    fn test_create_hash_with_same_messages_bhp2014() {
        let message = string_to_value("123field");

        let hash1 = create_hash(message.clone(), HashAlgorithm::BHP1024).unwrap();
        let hash2 = create_hash(message.clone(), HashAlgorithm::BHP1024).unwrap();

        println!("{}", hash1.clone());
        println!("{}", hash2.clone());

        assert_eq!(hash1, hash2, "Hashes of the same message should be the same");
    }

    #[test]
    fn test_create_hash_with_same_messages_sha3() {
        let message = string_to_value("123field");

        let hash1 = create_hash(message.clone(), HashAlgorithm::SHA3_256).unwrap();
        let hash2 = create_hash(message.clone(), HashAlgorithm::SHA3_256).unwrap();

        println!("{}", hash1.clone());
        println!("{}", hash2.clone());

        assert_eq!(hash1, hash2, "Hashes of the same message should be the same");
    }

    #[test]
    fn test_create_hash_with_same_messages_keccak256() {
        let message = string_to_value("123field");

        let hash1 = create_hash(message.clone(), HashAlgorithm::KECCAK256).unwrap();
        let hash2 = create_hash(message.clone(), HashAlgorithm::KECCAK256).unwrap();

        println!("{}", hash1.clone());
        println!("{}", hash2.clone());

        assert_eq!(hash1, hash2, "Hashes of the same message should be the same");
    }

    #[test]
    fn test_generate_message() {
        let (_private_key, issuer, subject, dob) = get_test_data();
        let credential = Credential {
            issuer: Address::<CurrentNetwork>::from_str(issuer.as_str()).unwrap(),
            subject: Address::<CurrentNetwork>::from_str(subject.as_str()).unwrap(),
            dob: U32::new(dob),
            nationality: string_to_field(Some("American".to_string())).unwrap(),
            expiry: U32::new(20211010u32),
        };

        println!("{:?}", credential);

        let result = generate_message_with_addresses_and_fields(credential);

        assert!(result.is_ok(), "Message generation should be successful");
    }
}
