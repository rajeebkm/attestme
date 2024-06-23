// Declare a contract.
// launch with npx ts-node src/scripts/9.declareContract.ts
// Coded with Starknet.js v5.16.0, Starknet-devnet-rs v0.1.0

import { Account, json, RpcProvider, Contract } from "starknet";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();


async function main(classHash: string) {
    // const provider = new RpcProvider({ nodeUrl: "http://127.0.0.1:5050/rpc" }); // only for starknet-devnet-rs
    // const provider = new RpcProvider({ nodeUrl: `https://starknet-sepolia.infura.io/v3/${process.env.STARKNET_API_KEY}` }); // only for starknet-devnet-rs
    const provider = new RpcProvider({ nodeUrl: `https://starknet-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_STARKNET_API_KEY}` });

    console.log("Provider connected");

    // initialize existing predeployed account 0 of Devnet
    const privateKey = process.env.PRIVATE_KEY ?? "";
    const accountAddress: string = process.env.ACCOUNT_ADDRESS ?? "";
    const account = new Account(provider, accountAddress, privateKey, '1');
    console.log("Account connected\n");

    // Deploy Test contract in specified network (Sepolia)
    // ClassHash of the already declared contract
    // const classHash = '0x2eaf260499a8d4d9237e83340a1c79c3f7b523b7238ef8ecf09fcd15c1ac697';
    // const classHash = declareResponse.class_hash;

    // const deployResponse = await account.deployContract({ classHash: classHash });
    const deployResponse = await account.deployContract({ classHash: classHash, constructorCalldata: ["0x79bf4b90f4447d4abc7a1b6d6f6482090ed3811b63bedb3efad3fe911cb9f5c"] });
    await provider.waitForTransaction(deployResponse.transaction_hash);

    // read abi of Test contract
    const { abi: testAbi } = await provider.getClassByHash(classHash);
    if (testAbi === undefined) {
        throw new Error('no abi.');
    }

    // Connect the new contract instance:
    const myTestContract = new Contract(testAbi, deployResponse.contract_address, provider);
    console.log('✅ Test Contract connected at =', myTestContract.address);
}

// const classHash = "0x483aa0f01262e60746de1c306fdc4d7440b70e52267e336772e2400713aee1"; // SchemaRegistry
const classHash = "0x69548837512a155baf55ff4054b6bda3aba20697fb951a30689afaed5e4f4c5"; // SAS
main(classHash)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });