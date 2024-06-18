// import { EIP1271Verifier } from "./eip1271/EIP1271Verifier.sol";

use starknet::{
    ContractAddress, contract_address_const, get_caller_address, contract_address_to_felt252
};
use attestme::{
    semver,
    helpers::common::{
        EMPTY_UID, Errors::{AccessDenied, InvalidLength, NotFound}, NO_EXPIRATION_TIME
    },
    interfaces::{
        ISchemaResolver,
        ISAS::{
            Attestation, AttestationRequest, AttestationRequestData, DelegatedAttestationRequest,
            DelegatedRevocationRequest, MultiAttestationRequest, MultiDelegatedAttestationRequest,
            MultiDelegatedRevocationRequest, MultiRevocationRequest, RevocationRequest,
            RevocationRequestData
        },
        ISchemaRegistry::SchemaRecord
    },
};
// use core::panic_with_felt252;
// use core::keccak::keccak_u256s_be_inputs;
// use core::traits::{Into, TryInto};
// use core::array::{ArrayTrait, SpanTrait};
// use core::debug;

// /// @notice A struct representing a record for a submitted schema.
// #[derive(Copy, Drop, Serde, starknet::Store)]
// struct SchemaRecord {
//     uid: u128, // The unique identifier of the schema.
//     schema: felt252, // Custom specification of the schema (e.g., an ABI). // string
//     resolver: ContractAddress, // Optional schema resolver. // ISchemaResolver
//     revocable: bool // Whether the schema allows revocations explicitly.
// }

/// @title ISas
/// @notice The interface of global attestation schemas for the Attestation Service protocol.
#[starknet::interface]
trait ISAS<TContractState> {
    /// @notice Returns the address of the global schema registry.
    /// @return The address of the global schema registry.
    fn getSchemaRegistry(self: @TContractState) -> ContractAddress; // ISchemaRegistry
    /// @notice Attests to a specific schema.
    /// @param request The arguments of the attestation request.
    /// @return The UID of the new attestation.
    fn attest(ref self: TContractState, request: AttestationRequest) -> u128; // bytes32

    /// @notice Attests to a specific schema via the provided ECDSA signature.
    /// @param delegatedRequest The arguments of the delegated attestation request.
    /// @return The UID of the new attestation.
    fn attestByDelegation(
        ref self: TContractState, delegatedRequest: DelegatedAttestationRequest
    ) -> u128; // bytes32
    /// @notice Attests to multiple schemas.
    /// @param multiRequests The arguments of the multi attestation requests. The requests should be grouped by distinct
    ///     schema ids to benefit from the best batching optimization.
    /// @return The UIDs of the new attestations.
    // fn multiAttest(
    //     ref self: TContractState, multiRequests: Array<MultiAttestationRequest>
    // ) -> Array<u128>;
    /// @notice Attests to multiple schemas using via provided ECDSA signatures.
    /// @param multiDelegatedRequests The arguments of the delegated multi attestation requests. The requests should be
    ///     grouped by distinct schema ids to benefit from the best batching optimization.
    /// @return The UIDs of the new attestations.
    // fn multiAttestByDelegation(
    //     ref self: TContractState, multiDelegatedRequests: Array<MultiDelegatedAttestationRequest>
    // ) -> Array<u128>; // bytes32[]

    /// @notice Revokes an existing attestation to a specific schema.
    /// @param request The arguments of the revocation request.
    fn revoke(ref self: TContractState, request: RevocationRequest); // bytes32[]

    /// @notice Revokes an existing attestation to a specific schema via the provided ECDSA signature.
    /// @param delegatedRequest The arguments of the delegated revocation request.
    fn revokeByDelegation(ref self: TContractState, delegatedRequest: DelegatedRevocationRequest);

    /// @notice Revokes existing attestations to multiple schemas.
    /// @param multiRequests The arguments of the multi revocation requests. The requests should be grouped by distinct
    ///     schema ids to benefit from the best batching optimization.

    // fn multiRevoke(ref self: TContractState, multiRequests: Array<MultiRevocationRequest>);

    /// @notice Revokes existing attestations to multiple schemas via provided ECDSA signatures.
    /// @param multiDelegatedRequests The arguments of the delegated multi revocation attestation requests. The requests
    ///     should be grouped by distinct schema ids to benefit from the best batching optimization.
    // fn multiRevokeByDelegation(
    //     ref self: TContractState, multiDelegatedRequests: Array<MultiDelegatedRevocationRequest>
    // );

    /// @notice Timestamps the specified bytes32 data.
    /// @param data The data to timestamp. // bytes32
    /// @return The timestamp the data was timestamped with.
    fn timestamp(ref self: TContractState, data: felt252) -> u64;

    /// @notice Timestamps the specified multiple bytes32 data.
    /// @param data The data to timestamp.
    /// @return The timestamp the data was timestamped with.
    fn multiTimestamp(ref self: TContractState, data: Array<felt252>) -> u64;

    /// @notice Revokes the specified bytes32 data.
    /// @param data The data to timestamp.
    /// @return The timestamp the data was revoked with.
    fn revokeOffchain(ref self: TContractState, data: felt252) -> u64;

    /// @notice Revokes the specified multiple bytes32 data.
    /// @param data The data to timestamp.
    /// @return The timestamp the data was revoked with.
    fn multiRevokeOffchain(ref self: TContractState, data: Array<felt252>) -> u64;

    /// @notice Returns an existing attestation by UID.
    /// @param uid The UID of the attestation to retrieve.
    /// @return The attestation data members.
    // fn getAttestation(ref self: TContractState, uid: felt252) -> Attestation;

    /// @notice Checks whether an attestation exists.
    /// @param uid The UID of the attestation to retrieve.
    /// @return Whether an attestation exists.
    fn isAttestationValid(ref self: TContractState, uid: felt252) -> bool;

    /// @notice Returns the timestamp that the specified data was timestamped with.
    /// @param data The data to query.
    /// @return The timestamp the data was timestamped with.
    fn getTimestamp(ref self: TContractState, data: felt252) -> u64;

    /// @notice Returns the timestamp that the specified data was timestamped with.
    /// @param data The data to query.
    /// @return The timestamp the data was timestamped with.
    fn getRevokeOffchain(ref self: TContractState, revoker: ContractAddress, data: felt252) -> u64;
}

#[starknet::contract]
mod SAS {
    use core::array::SpanTrait;
    use core::serde::Serde;
    // use super::debug::PrintTrait;
    use core::traits::Into;
    use core::array::ArrayTrait;
    use super::{
        ContractAddress, contract_address_const, SchemaRecord, Attestation, AttestationRequest,
        AttestationRequestData, DelegatedAttestationRequest, DelegatedRevocationRequest,
        MultiAttestationRequest, MultiDelegatedAttestationRequest, MultiDelegatedRevocationRequest,
        MultiRevocationRequest, RevocationRequest, RevocationRequestData
    };
    #[storage]
    struct Storage {
        // The global mapping between schema records and their IDs.
        _registry: LegacyMap::<u128, SchemaRecord>, // bytes4 => SchemaRecord
        _schemaRegistry: ContractAddress, // The global schema registry, ISchemaRegistry
        _db: LegacyMap::<
            u128, Attestation
        >, // The global mapping between attestations and their UIDs.
        _timestamps: LegacyMap::<
            felt252, u64
        >, // The global mapping between data and their timestamps.
        _revocationsOffchain: LegacyMap::<
            (ContractAddress, felt252), u64
        >, // The global mapping between data and their revocation timestamps.
    }

    // ISchemaRegistry
    #[constructor]
    fn constructor(ref self: ContractState) {}
    // #[constructor]
    // fn constructor(ref self: ContractState, registry: ContractAddress) {
    //     //     /// @dev Creates a new EAS instance.
    //     //     /// @param registry The address of the global schema registry.
    //     //     constructor(ISchemaRegistry registry) Semver(1, 3, 0) EIP1271Verifier("EAS", "1.3.0") {
    //     //         if (address(registry) == address(0)) {
    //     //             revert InvalidRegistry();
    //     //         }

    //     self._schemaRegistry.write(registry);
    // //     }
    // }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Attested: Attested,
        Revoked: Revoked,
        Timestamped: Timestamped,
        RevokedOffchain: RevokedOffchain
    }

    /// @notice Emitted when an attestation has been made.
    /// @param recipient The recipient of the attestation.
    /// @param attester The attesting account.
    /// @param uid The UID of the new attestation.
    /// @param schemaUID The UID of the schema.
    #[derive(Drop, starknet::Event)]
    struct Attested {
        #[key]
        recipient: ContractAddress, // bytes32
        #[key]
        attester: ContractAddress,
        uid: u128,
        #[key]
        schemaUID: u128
    }

    /// @notice Emitted when an attestation has been revoked.
    /// @param recipient The recipient of the attestation.
    /// @param attester The attesting account.
    /// @param schemaUID The UID of the schema.
    /// @param uid The UID the revoked attestation.
    #[derive(Drop, starknet::Event)]
    struct Revoked {
        #[key]
        recipient: ContractAddress, // bytes32
        #[key]
        attester: ContractAddress,
        uid: u128,
        #[key]
        schemaUID: u128
    }

    /// @notice Emitted when a data has been timestamped.
    /// @param data The data.
    /// @param timestamp The timestamp.
    #[derive(Drop, starknet::Event)]
    struct Timestamped {
        #[key]
        data: felt252, // bytes32
        #[key]
        timestamp: u64
    }

    /// @notice Emitted when a data has been revoked.
    /// @param revoker The address of the revoker.
    /// @param data The data.
    /// @param timestamp The timestamp.
    #[derive(Drop, starknet::Event)]
    struct RevokedOffchain {
        #[key]
        revoker: ContractAddress, // bytes32
        #[key]
        data: felt252,
        #[key]
        timestamp: u64,
    }

    /// @notice A struct representing an internal attestation result.
    #[derive(Drop, starknet::Event)]
    struct AttestationsResult {
        usedValue: u256, // Total ETH amount that was sent to resolvers.
        uids: Array<felt252>, // UIDs of the new attestations.
    }

    #[external(v0)]
    impl SASImpl of super::ISAS<ContractState> {
        /// @notice Returns the address of the global schema registry.
        /// @return The address of the global schema registry.
        fn getSchemaRegistry(self: @ContractState) -> ContractAddress {
            let a: ContractAddress = contract_address_const::<1>();
            return a;
        }
        /// @notice Attests to a specific schema.
        /// @param request The arguments of the attestation request.
        /// @return The UID of the new attestation.
        fn attest(ref self: ContractState, request: AttestationRequest) -> u128 {
            return 0_u128;
        }
        /// @notice Attests to a specific schema via the provided ECDSA signature.
        /// @param delegatedRequest The arguments of the delegated attestation request.
        /// @return The UID of the new attestation.
        fn attestByDelegation(
            ref self: ContractState, delegatedRequest: DelegatedAttestationRequest
        ) -> u128 {
            return 0_u128;
        }
        /// @notice Attests to multiple schemas.
        /// @param multiRequests The arguments of the multi attestation requests. The requests should be grouped by distinct
        ///     schema ids to benefit from the best batching optimization.
        /// @return The UIDs of the new attestations.
        // fn multiAttest(
        //     ref self: ContractState, multiRequests: Array<MultiAttestationRequest>
        // ) -> Array<u128> {
        //     let array: Array<u128> = ArrayTrait::new();
        //     return array;
        // }
        /// @notice Attests to multiple schemas using via provided ECDSA signatures.
        /// @param multiDelegatedRequests The arguments of the delegated multi attestation requests. The requests should be
        ///     grouped by distinct schema ids to benefit from the best batching optimization.
        /// @return The UIDs of the new attestations.
        // fn multiAttestByDelegation(
        //     ref self: ContractState, multiDelegatedRequests: Array<MultiDelegatedAttestationRequest>
        // ) -> Array<u128> {
        //     let array: Array<u128> = ArrayTrait::new();
        //     return array;
        // }

        /// @notice Revokes an existing attestation to a specific schema.
        /// @param request The arguments of the revocation request.
        fn revoke(ref self: ContractState, request: RevocationRequest) {}

        /// @notice Revokes an existing attestation to a specific schema via the provided ECDSA signature.
        /// @param delegatedRequest The arguments of the delegated revocation request.
        fn revokeByDelegation(
            ref self: ContractState, delegatedRequest: DelegatedRevocationRequest
        ) {}

        /// @notice Revokes existing attestations to multiple schemas.
        /// @param multiRequests The arguments of the multi revocation requests. The requests should be grouped by distinct
        ///     schema ids to benefit from the best batching optimization.
        // fn multiRevoke(ref self: ContractState, multiRequests: Array<MultiRevocationRequest>) {}

        /// @notice Revokes existing attestations to multiple schemas via provided ECDSA signatures.
        /// @param multiDelegatedRequests The arguments of the delegated multi revocation attestation requests. The requests
        ///     should be grouped by distinct schema ids to benefit from the best batching optimization.
        // fn multiRevokeByDelegation(
        //     ref self: ContractState, multiDelegatedRequests: Array<MultiDelegatedRevocationRequest>
        // ) {}

        /// @notice Timestamps the specified bytes32 data.
        /// @param data The data to timestamp. // bytes32
        /// @return The timestamp the data was timestamped with.
        fn timestamp(ref self: ContractState, data: felt252) -> u64 {
            0_u64
        }
        /// @notice Timestamps the specified multiple bytes32 data.
        /// @param data The data to timestamp.
        /// @return The timestamp the data was timestamped with.
        fn multiTimestamp(ref self: ContractState, data: Array<felt252>) -> u64 {
            0_u64
        }

        /// @notice Revokes the specified bytes32 data.
        /// @param data The data to timestamp.
        /// @return The timestamp the data was revoked with.
        fn revokeOffchain(ref self: ContractState, data: felt252) -> u64 {
            0_u64
        }

        /// @notice Revokes the specified multiple bytes32 data.
        /// @param data The data to timestamp.
        /// @return The timestamp the data was revoked with.
        fn multiRevokeOffchain(ref self: ContractState, data: Array<felt252>) -> u64 {
            0_u64
        }

        /// @notice Returns an existing attestation by UID.
        /// @param uid The UID of the attestation to retrieve.
        /// @return The attestation data members.
        // fn getAttestation(ref self: ContractState, uid: felt252) -> Attestation {
        //     let mut _attestation: Attestation = Attestation {
        //         uid: 1_u256,
        //         schema: 0, // string
        //         time: 0_u64, // IResolver
        //         expirationTime: 0_u64,
        //         refUID: 1,
        //         recipient: contract_address_const::<1>(),
        //         attester: contract_address_const::<1>(),
        //         revocable: true,
        //         data: 1
        //     };
        //     _attestation
        // }

        /// @notice Checks whether an attestation exists.
        /// @param uid The UID of the attestation to retrieve.
        /// @return Whether an attestation exists.
        fn isAttestationValid(ref self: ContractState, uid: felt252) -> bool {
            true
        }

        /// @notice Returns the timestamp that the specified data was timestamped with.
        /// @param data The data to query.
        /// @return The timestamp the data was timestamped with.
        fn getTimestamp(ref self: ContractState, data: felt252) -> u64 {
            0_u64
        }

        /// @notice Returns the timestamp that the specified data was timestamped with.
        /// @param data The data to query.
        /// @return The timestamp the data was timestamped with.
        fn getRevokeOffchain(
            ref self: ContractState, revoker: ContractAddress, data: felt252
        ) -> u64 {
            0_u64
        }
    }
}

