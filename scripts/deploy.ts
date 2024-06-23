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
    const deployResponse = await account.deployContract({ classHash: classHash, constructorCalldata: ["0x14d17513b31edcce2ba7dbe18ca05ce4e3e0490abff2181cb1dca9e0b5816ae"] });
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

// const classHash = "0x24c8b3625cfb707892f90bbbe701c607b2c1934e7b396d41b9da3a5f75886f9"; // SchemaRegistry
const classHash = "0x4af413cc60c21ee2d55a09c21e338b5f20e34d059efe9d6fcfb64e48017a0f0"; // SAS
main(classHash)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });