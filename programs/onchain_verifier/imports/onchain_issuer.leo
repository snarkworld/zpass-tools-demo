// The 'onchain_issuer' program.
program onchain_issuer.aleo {

    struct Credentials {
        issuer: address,
        subject: address,
        dob: u32,
        nationality: field,
        expiry: u32
    }
    record SignedCredential {
        owner: address,
        issuer: address,
        subject: address,
        dob: u32,
        nationality: field,
        expiry: u32,
        sig: signature
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

    transition issue(
        sig: signature,
        hash_type: u8,
        msg: Credentials
    ) -> SignedCredential {
        let hash: field = get_hash(hash_type, msg);
        let sig_is_verified: bool = signature_verification(
        hash,
        sig,
        msg.issuer
        );
        assert(sig_is_verified);
        return SignedCredential {
            owner: msg.subject,
            issuer: msg.issuer,
            subject: msg.subject,
            dob: msg.dob,
            nationality: msg.nationality,
            expiry: msg.expiry,
            sig
        };
    }
}
