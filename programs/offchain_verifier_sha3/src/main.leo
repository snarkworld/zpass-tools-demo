// The 'offchain_verifier_sha3' program.
program offchain_verifier_sha3.aleo {

    struct Credentials {
        issuer: address,
        subject: address,
        dob: u32,
        nationality: field,
        expiry: u32
    }

    inline get_sha3_hash(msg: Credentials) -> field {
        return SHA3_256::hash_to_field(msg);
    }

    function signature_verification(msg_hash: field, sig: signature, issuer: address) -> bool {
        return signature::verify(sig, issuer, msg_hash);
    }

    transition verify(
        sig: signature,
        msg: Credentials,
    ) -> bool {
        return signature_verification(get_sha3_hash(msg), sig, msg.issuer);
    }
}