import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from 'ethers';
import 'dotenv/config'

const EAS_CONTRACT_ADDRESS = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; 

async function attest() {
    try {
        const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);
        const eas = new EAS(EAS_CONTRACT_ADDRESS);
        eas.connect(signer);

        const schemaEncoder = new SchemaEncoder("string studentName, int256 age, string gender, string course, string registrationNumber, string issueDate"); // e.g., bytes32 contentHash, string urlOfContent
        const encodedData = schemaEncoder.encodeData([
            { name: "studentName", value: "Rajeeb", type: "string" }, 
            { name: "age", value: "26", type: "int256" },
            { name: "gender", value: "Male", type: "string" },
            { name: "course", value: "B.Tech-2023-CS", type: "string" },
            { name: "registrationNumber", value: "CS20230021", type: "string" },
            { name: "issueDate", value: "July 2,2023", type: "string" },
        ]);

        const schemaUID = "0xbc069f75313b5125aca7f686da99b28a3ed839d9b6505114417873287df6f115"; 

        const tx = await eas.attest({
            schema: schemaUID,
            data: {
                recipient: "0x78d9CE088F61C1bE4BB175371E174d813021900a", 
                expirationTime: 0,
                revocable: true, 
                data: encodedData,
            },
        });

        const newAttestationUID = await tx.wait();
        console.log("New attestation UID:", newAttestationUID);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

attest();