export const SIGVERIFY_PROGRAM_KECCAK_256 = `
program offchain_verifier_keccak.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as Credentials.private;
    hash.keccak256 r1 into r2 as field;
    call signature_verification r2 r0 r1.issuer into r3;
    output r3 as boolean.private;

`;

export const SIGVERIFY_PROGRAM_SHA3_256 = `
program offchain_verifier_sha3.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as Credentials.private;
    hash.sha3_256 r1 into r2 as field;
    call signature_verification r2 r0 r1.issuer into r3;
    output r3 as boolean.private;
`;

export const SIGVERIFY_PROGRAM = `
program offchain_verifier.aleo;

struct Credentials:
    issuer as address;
    subject as address;
    dob as u32;
    nationality as field;
    expiry as u32;

closure get_hash:
    input r0 as u8;
    input r1 as Credentials;
    is.eq r0 1u8 into r2;
    hash.bhp1024 r1 into r3 as field;
    hash.psd2 r1 into r4 as field;
    ternary r2 r3 r4 into r5;
    output r5 as field;

closure signature_verification:
    input r0 as field;
    input r1 as signature;
    input r2 as address;
    sign.verify r1 r2 r0 into r3;
    output r3 as boolean;

function verify:
    input r0 as signature.private;
    input r1 as u8.private;
    input r2 as Credentials.private;
    call get_hash r1 r2 into r3;
    call signature_verification r3 r0 r2.issuer into r4;
    output r4 as boolean.private;
`;
