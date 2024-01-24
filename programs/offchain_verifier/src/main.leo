program offchain_verifier.aleo {

    struct Credentials {
        issuer: address,
        subject: address,
        dob: u32,
        nationality: field,
        expiry: u32
    }

    inline get_psd_hash(msg: Credentials) -> field {
        return Poseidon2::hash_to_field(msg);
    }

    inline get_bhp_hash(msg: Credentials) -> field {
        return BHP1024::hash_to_field(msg);
    }


    function get_hash(hash_type: u8, msg: Credentials) -> field {
        if (hash_type.eq(1u8)) {
            return get_bhp_hash(msg);
        }
        return get_psd_hash(msg);
    }


    function signature_verification(msg_hash: field, sig: signature, issuer: address) -> bool {
        return signature::verify(sig, issuer, msg_hash);
    }

    transition verify(
        sig: signature,
        hash_type: u8,
        msg: Credentials,
    ) -> bool {
        return signature_verification(get_hash(hash_type, msg), sig, msg.issuer);
    }
}