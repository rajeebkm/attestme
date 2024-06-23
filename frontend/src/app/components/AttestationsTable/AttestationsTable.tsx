"use client"
import { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import { SCHEMA_REGISTRY } from "@/app/utils/constant";
import SchemRegistryAbi from "@/app/abi/schemaRegistry.abi.json";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCopy } from "react-icons/fi"; 
import toast from "react-hot-toast";

interface Schema {
    uid: string;
    txhash: string;
    from: string;
    to: string;
    type: string;
}

function AttestationsTable() {
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; 
    const router = useRouter();

    useEffect(() => {
        const fetchSchemas = async () => {
            const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.g.alchemy.com/v2/pZMHvd5KDFdzplptGEsyXYptNTM5Vzyr" });
            const contract = new Contract(SchemRegistryAbi, SCHEMA_REGISTRY, provider);

            const sampleSchemas: Schema[] = [
                {
                    uid: "1",
                    txhash: "0x0529a5a0b62574731f779542481172d87fd594d346785e1e6fc7f5a6e5ca4b6c",
                    from: "0x123456789788778abcdef",
                    to: "0x1234567890abcdef",
                    type: "onchain",
                },
                {
                    uid: "2",
                    txhash: "0x0529a5a0b62574731f779542481172d87fd594d346785e1e6fc7f5a6e5ca4b6c",
                    from: "0x1234567890abcdef",
                    to: "0x12345678907887877abcdef",
                    type: "onchain",
                },
                {
                    uid: "3",
                    txhash: "0x0529a5a0b62574731f779542481172d87fd594d346785e1e6fc7f5a6e5ca4b6c",
                    from: "0x1234567890abcdef",
                    to: "0x12345678908787abcdef",
                    type: "onchain",
                },
                {
                    uid: "4",
                    txhash: "0x0529a5a0b62574731f779542481172d87fd594d346785e1e6fc7f5a6e5ca4b6d",
                    from: "0x1234567767867890abcdef",
                    to: "0x1234567890abcdef",
                    type: "onchain",
                },
                {
                    uid: "5",
                    txhash: "0x0529a5a0b62574731f779542481172d87fd594d346785e1e6fc7f5a6e5ca4b6e",
                    from: "0x123456789786678670abcdef",
                    to: "0x123456789870abcdef",
                    type: "onchain",
                },
            ];
            setSchemas(sampleSchemas);
            setLoading(false);
        };

        fetchSchemas();
    }, []);

    const truncateTxHash = (txhash: string) => {
        return `${txhash.slice(0, 8)}...${txhash.slice(-5)}`;
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(schemas.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success("Copied to clipboard!");
        }).catch(() => {
            toast.error("Failed to copy!");
        });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSchemas = schemas.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="flex flex-col font-serif items-center justify-center w-full min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="flex flex-col w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-6 p-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-between items-left mb-1">
                        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Attestations</h1>
                        <p className="text-lg text-gray-800 dark:text-gray-200 mb-3">Showing the most recent attestations</p>
                    </div>
                    <button
                        type="button"
                        className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        onClick={() => router.push("/attestations-flow")}
                    >
                        Make Attestation
                    </button>
                </div>
            </div>
            <div className="flex flex-col w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-6 p-8">
                {loading ? (
                    <p className="text-gray-800 dark:text-gray-200">Loading...</p>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">UID</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">TxnHash</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">From</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">To</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Type</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSchemas.map((schema) => (
                                    <tr key={schema.uid}>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200 flex items-center">
                                            #{schema.uid} 
                                            <FiCopy 
                                                className="ml-2 text-blue-600 cursor-pointer"
                                                onClick={() => handleCopy(schema.uid)} 
                                            />
                                        </td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{truncateTxHash(schema.txhash)}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{schema.from}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{schema.to}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{schema.type}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                                            <Link href={`https://sepolia.starkscan.co/tx/${schema.txhash}`} legacyBehavior>
                                                <a className="text-blue-600 hover:underline">View Details</a>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-between mt-4">
                            <button
                                type="button"
                                className="bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                className="bg-blue-600 py-2 px-4 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                onClick={handleNextPage}
                                disabled={currentPage === Math.ceil(schemas.length / itemsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AttestationsTable;
