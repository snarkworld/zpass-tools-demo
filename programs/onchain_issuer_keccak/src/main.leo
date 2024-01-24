// The 'onchain_issuer_keccak' program.
program onchain_issuer_keccak.aleo {
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

    inline get_keccak_hash(msg: Credentials) -> field {
        return Keccak256::hash_to_field(msg);
    }

    function signature_verification(msg_hash: field, sig: signature, issuer: address) -> bool {
        return signature::verify(sig, issuer, msg_hash);
    }

    transition issue(
        sig: signature,
        msg: Credentials
    ) -> SignedCredential {
        let hash: field = get_keccak_hash(msg);
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
