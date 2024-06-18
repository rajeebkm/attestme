use starknet::ContractAddress;

// A representation of an empty/uninitialized UID.
const EMPTY_UID: u128 = 0;

// A zero expiration represents an non-expiring attestation.
const NO_EXPIRATION_TIME: felt252 = 0;

mod Errors {
    const AccessDenied: felt252 = 'AccessDenied';
    const DeadlineExpired: felt252 = 'DeadlineExpired';
    const InvalidEAS: felt252 = 'InvalidEAS';
    const InvalidLength: felt252 = 'InvalidLength';
    const InvalidSignature: felt252 = 'InvalidSignature';
    const NotFound: felt252 = 'NotFound';
    const AlreadyExists: felt252 = 'AlreadyExists';
    const AlreadyRevoked: felt252 = 'AlreadyRevoked';
    const AlreadyRevokedOffchain: felt252 = 'AlreadyRevokedOffchain';
    const AlreadyTimestamped: felt252 = 'AlreadyTimestamped';
    const InsufficientValue: felt252 = 'InsufficientValue';
    const InvalidAttestation: felt252 = 'InvalidAttestation';
    const InvalidAttestations: felt252 = 'InvalidAttestations';
    const InvalidExpirationTime: felt252 = 'InvalidExpirationTime';
    const InvalidOffset: felt252 = 'InvalidOffset';
    const InvalidRegistry: felt252 = 'InvalidRegistry';
    const InvalidRevocation: felt252 = 'InvalidRevocation';
    const InvalidRevocations: felt252 = 'InvalidRevocations';
    const InvalidSchema: felt252 = 'InvalidSchema';
    const InvalidVerifier: felt252 = 'InvalidVerifier';
    const Irrevocable: felt252 = 'Irrevocable';
    const NotPayable: felt252 = 'NotPayable';
    const WrongSchema: felt252 = 'WrongSchema';

}

/// @notice A struct representing ECDSA signature data.
#[derive(Copy, Drop, Serde)]
struct Signature {
//     uint8 v; // The recovery ID.
//     bytes32 r; // The x-coordinate of the nonce R.
//     bytes32 s; // The signature data.
}

// /// @notice A struct representing a single attestation.
// struct Attestation {
//     bytes32 uid; // A unique identifier of the attestation.
//     bytes32 schema; // The unique identifier of the schema.
//     uint64 time; // The time when the attestation was created (Unix timestamp).
//     uint64 expirationTime; // The time when the attestation expires (Unix timestamp).
//     uint64 revocationTime; // The time when the attestation was revoked (Unix timestamp).
//     bytes32 refUID; // The UID of the related attestation.
//     address recipient; // The recipient of the attestation.
//     address attester; // The attester/sender of the attestation.
//     bool revocable; // Whether the attestation is revocable.
//     bytes data; // Custom attestation data.
// }
#[derive(Copy, Drop, Serde, starknet::Store)]
struct Attestation {
    uid: u256,
    schema: felt252, // string
    time: u64, // IResolver
    expirationTime: u64,
    refUID: felt252,
    recipient: ContractAddress,
    attester: ContractAddress,
    revocable: bool,
    data: felt252
}

// /// @notice A helper function to work with unchecked iterators in loops.
// function uncheckedInc(uint256 i) pure returns (uint256 j) {
//     unchecked {
//         j = i + 1;
//     }
// }