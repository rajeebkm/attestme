import { SchemaRegistry} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import 'dotenv/config'

const schemaRegistryContractAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);

async function registerSchema() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        schemaRegistry.connect(signer);

        const schema = "string studentName, int256 age, string gender, string course, string registrationNumber, string issueDate"; 
        const revocable = true; 

        const transaction = await schemaRegistry.register({
            schema,
            revocable,
           
          });

        await transaction.wait();
        console.log("New Schema Created", transaction);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

registerSchema();