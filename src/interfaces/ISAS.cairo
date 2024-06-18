use starknet::ContractAddress;
use attestme::{
    helpers::common::{Attestation, Signature},
    interfaces::{ISchemaResolver, ISchemaRegistry, ISemver}
}; // common::{Attestation, Signature}


/// @notice A struct representing the arguments of the attestation request.
#[derive(Copy, Drop, Serde)]
struct AttestationRequestData {
    recipient: ContractAddress, // The recipient of the attestation.
    expirationTime: u64, // The time when the attestation expires (Unix timestamp).
    revocable: bool, // Whether the attestation is revocable.
    refUID: u128, // The UID of the related attestation.
    data: felt252, // Custom attestation data.
    value: u256 // An explicit ETH amount to send to the resolver. This is important to prevent accidental user errors.
}

/// @notice A struct representing the full arguments of the attestation request.
#[derive(Copy, Drop, Serde)]
struct AttestationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: AttestationRequestData // The arguments of the attestation request.
}

/// @notice A struct representing the full arguments of the full delegated attestation request.
#[derive(Drop, Serde)]
struct DelegatedAttestationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: AttestationRequestData, // The arguments of the attestation request.
    signature: Signature, // The ECDSA signature data.
    attester: ContractAddress, // The attesting account.
    deadline: u64 // The deadline of the signature/request.
}

/// @notice A struct representing the full arguments of the multi attestation request.
#[derive(Drop, Serde)]
struct MultiAttestationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: Array<AttestationRequestData> // The arguments of the attestation request.
}

/// @notice A struct representing the full arguments of the delegated multi attestation request.
#[derive(Drop, Serde)]
struct MultiDelegatedAttestationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: Array<AttestationRequestData>, // The arguments of the attestation requests.
    signatures: Array<
        Signature
    >, // The ECDSA signatures data. Please note that the signatures are assumed to be signed with increasing nonces.
    attester: ContractAddress, // The attesting account.
    deadline: u64 // The deadline of the signature/request.
}

/// @notice A struct representing the arguments of the revocation request.
#[derive(Copy, Drop, Serde)]
struct RevocationRequestData {
    uid: u128, // The UID of the attestation to revoke.
    value: u256 // An explicit ETH amount to send to the resolver. This is important to prevent accidental user errors.
}

/// @notice A struct representing the full arguments of the revocation request.
#[derive(Copy, Drop, Serde)]
struct RevocationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: RevocationRequestData // The arguments of the revocation request.
}

/// @notice A struct representing the arguments of the full delegated revocation request.
#[derive(Copy, Drop, Serde)]
struct DelegatedRevocationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: RevocationRequestData, // The arguments of the revocation request.
    signature: Signature, // The ECDSA signature data.
    revoker: ContractAddress, // The revoking account.
    deadline: u64 // The deadline of the signature/request.
}

/// @notice A struct representing the full arguments of the multi revocation request.
#[derive(Drop, Serde)]
struct MultiRevocationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: Array<RevocationRequestData> // The arguments of the revocation request.
}

/// @notice A struct representing the full arguments of the delegated multi revocation request.
#[derive(Drop, Serde)]
struct MultiDelegatedRevocationRequest {
    schema: felt252, // The unique identifier of the schema.
    data: Array<RevocationRequestData>, // The arguments of the revocation requests.
    signatures: Array<
        Signature
    >, // The ECDSA signatures data. Please note that the signatures are assumed to be signed with increasing nonces.
    revoker: ContractAddress, // The revoking account.
    deadline: u64 // The deadline of the signature/request.
}



