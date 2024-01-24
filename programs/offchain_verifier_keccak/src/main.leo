program offchain_verifier_keccak.aleo {

    struct Credentials {
        issuer: address,
        subject: address,
        dob: u32,
        nationality: field,
        expiry: u32
    }

    inline get_keccak_hash(msg: Credentials) -> field {
        return Keccak256::hash_to_field(msg);
    }

    function signature_verification(msg_hash: field, sig: signature, issuer: address) -> bool {
        return signature::verify(sig, issuer, msg_hash);
    }

    transition verify(
        sig: signature,
        msg: Credentials,
    ) -> bool {
        return signature_verification(get_keccak_hash(msg), sig, msg.issuer);
    }
}