use starknet::{
    ContractAddress, contract_address_const, get_caller_address, contract_address_to_felt252
};
use attestme::helpers::common::{Errors, EMPTY_UID};
use core::panic_with_felt252;
use core::keccak::keccak_u256s_be_inputs;
use core::traits::{Into, TryInto};
use core::array::{ArrayTrait, SpanTrait};
use core::debug;

/// @notice A struct representing a record for a submitted schema.
#[derive(Copy, Drop, Serde, starknet::Store)]
struct SchemaRecord {
    uid: u128, // The unique identifier of the schema.
    schema: felt252, // Custom specification of the schema (e.g., an ABI). // string
    resolver: ContractAddress, // Optional schema resolver. // ISchemaResolver
    revocable: bool // Whether the schema allows revocations explicitly.
}

#[starknet::interface]
trait ISchemaRegistry<TContractState> {
    fn register(
        ref self: TContractState, schema: felt252, resolver: ContractAddress, revocable: bool
    ) -> u128;
    fn get_schema(self: @TContractState, uid: u128) -> SchemaRecord;
}

#[starknet::contract]
mod SchemaRegistry {
    use core::array::SpanTrait;
    use core::serde::Serde;
    use super::debug::PrintTrait;
    use core::traits::Into;
    use core::array::ArrayTrait;
    use super::{
        ContractAddress, SchemaRecord, Errors, EMPTY_UID, get_caller_address,
        contract_address_const, panic_with_felt252, keccak_u256s_be_inputs,
        contract_address_to_felt252
    };
    #[storage]
    struct Storage {
        // The global mapping between schema records and their IDs.
        _registry: LegacyMap::<u128, SchemaRecord> // bytes4 => SchemaRecord
    }

    #[constructor]
    fn constructor(ref self: ContractState) {}

    /// @notice Emitted when a new schema has been registered
    /// @param uid The schema UID.
    /// @param registerer The address of the account used to register the schema.
    /// @param schema The schema data.
    // event Registered(bytes32 indexed uid, address indexed registerer, SchemaRecord schema);
    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        Registered: Registered,
    }

    #[derive(Drop, starknet::Event)]
    struct Registered {
        #[key]
        uid: u128, // bytes32
        #[key]
        registerer: ContractAddress,
        schema: SchemaRecord,
    }

    #[external(v0)]
    impl SchemaRegistryImpl of super::ISchemaRegistry<ContractState> {
        fn register(
            ref self: ContractState, schema: felt252, resolver: ContractAddress, revocable: bool
        ) -> u128 {
            let mut _schemaRecord: SchemaRecord = SchemaRecord {
                uid: EMPTY_UID, schema: schema, resolver: resolver, revocable: revocable
            };

            let uid: u128 = self._getUID(_schemaRecord);
            if (self._registry.read(uid).uid != EMPTY_UID) {
                panic_with_felt252(Errors::AlreadyExists);
            }

            _schemaRecord.uid = uid;
            self._registry.write(uid, _schemaRecord);

            self
                .emit(
                    Event::Registered(
                        Registered {
                            uid: uid, registerer: get_caller_address(), schema: _schemaRecord
                        }
                    )
                );

            return uid;
        }

        fn get_schema(self: @ContractState, uid: u128) -> SchemaRecord {
            return self._registry.read(uid);
        }
    }

    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        /// @dev Calculates a UID for a given schema.
        /// @param schemaRecord The input schema.
        /// @return schema UID.
        fn _getUID(self: @ContractState, _schemaRecord: SchemaRecord) -> u128 {
            let mut input_array: Array<u256> = ArrayTrait::new();
            let schema_u256: u256 = _schemaRecord.schema.into();
            input_array.append(schema_u256);
            input_array.append((contract_address_to_felt252(_schemaRecord.resolver)).into());
            if (_schemaRecord.revocable) {
                input_array.append(1_u256); // true
            } else {
                input_array.append(0_u256); // false
            }
            let inputs: Span<u256> = input_array.span();
            return keccak_u256s_be_inputs(inputs).low;
        // return keccak256(abi.encodePacked(schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable));
        }
    }
}
