// Declare a contract.
// launch with npx ts-node src/scripts/9.declareContract.ts
// Coded with Starknet.js v5.16.0, Starknet-devnet-rs v0.1.0

import { Account, json, RpcProvider, Contract } from "starknet";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();


async function main(contract_name: string) {
    // const provider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" }); // only for starknet-devnet-rs
    const provider = new RpcProvider({ nodeUrl: `https://starknet-sepolia.infura.io/v3/${process.env.STARKNET_API_KEY}` }); // only for starknet-devnet-rs
    console.log("Provider connected");

    // initialize existing predeployed account 0 of Devnet
    const privateKey = process.env.PRIVATE_KEY ?? "";
    const accountAddress: string = process.env.ACCOUNT_ADDRESS ?? "";
    const account = new Account(provider, accountAddress, privateKey, '1');
    console.log("Account connected\n");

    // Declare Test contract in specified network (Sepolia)
    const testSierra = json.parse(fs.readFileSync(`./target/dev/attestme_${contract_name}.contract_class.json`).toString("ascii"));
    const testCasm = json.parse(fs.readFileSync(`./target/dev/attestme_${contract_name}.compiled_contract_class.json`).toString("ascii"));
    const { suggestedMaxFee: fee1 } = await account.estimateDeclareFee({ contract: testSierra, casm: testCasm });
    console.log("suggestedMaxFee =", fee1.toString(), "wei");
    const declareResponse = await account.declare({ contract: testSierra, casm: testCasm }, { maxFee: fee1 * 11n / 10n });

    console.log('Contract Class Hash =', declareResponse.class_hash);
    await provider.waitForTransaction(declareResponse.transaction_hash);
    console.log('✅ Contract Class Hash completed.');
}

const contract_name = "SchemaRegistry";
main(contract_name);