use core::result::ResultTrait;
use core::debug::PrintTrait;
use core::serde::Serde;
use starknet::{ContractAddress, contract_address_const};
use attestme::schema_registry::SchemaRecord;

use snforge_std::{declare, ContractClassTrait};

use attestme::schema_registry::ISchemaRegistrySafeDispatcher;
use attestme::schema_registry::ISchemaRegistrySafeDispatcherTrait;

fn deploy_contract(name: felt252) -> ContractAddress {
    let contract = declare(name);
    contract.deploy(@ArrayTrait::new()).unwrap()
}

#[test]
// #[ignore()]
fn test_schema_registry() {
    let contract_address = deploy_contract('SchemaRegistry');

    let safe_dispatcher = ISchemaRegistrySafeDispatcher { contract_address };
    let _schemaRegistry: SchemaRecord = safe_dispatcher.get_schema(1_u128).unwrap();
    assert(_schemaRegistry.uid == 0, 'Invalid uid');

    let schema: felt252 = 'felt252 name, u256 age';
    let resolver: ContractAddress = contract_address_const::<1>();
    let revocable: bool = true;

    let uid = safe_dispatcher.register(schema, resolver, revocable);
    let _uid = uid.unwrap();

    let _schemaRegistry: SchemaRecord = safe_dispatcher.get_schema(_uid).unwrap();
    assert(_schemaRegistry.uid == _uid, 'Invalid uid');
    _schemaRegistry.uid.print();
    _schemaRegistry.schema.print();
    _schemaRegistry.resolver.print();
    _schemaRegistry.revocable.print();

    match safe_dispatcher.register(schema, resolver, revocable) {
        Result::Ok(_) => panic_with_felt252('Should have panicked'),
        Result::Err(panic_data) => {
            assert(*panic_data.at(0) == 'AlreadyExists', *panic_data.at(0));
        }
    };
}