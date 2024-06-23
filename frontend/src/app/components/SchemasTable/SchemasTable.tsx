"use client";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "@starknet-react/core";
import { SCHEMA_REGISTRY } from "@/app/utils/constant";
import SchemRegistryAbi from "@/app/abi/schemaRegistry.abi.json";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCopy } from "react-icons/fi";
import { toast } from 'react-hot-toast';


interface Schema {
    uid: string;
    txhash: string;
    schema: string;
    resolver: string;
    attestations: number;
}



function SchemasTable() {
    const { account, isConnected } = useAccount();
    const [schemaUID,setSchemaUID] = useState('');
    const [schemas, setSchemas] = useState<Schema[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const router = useRouter();

    const {
        data: allSchemasData,
        isLoading: allSchemasLoading,
        error: allSchemasError,
        refetch: refetchAllSchemas
    } = useContractRead({
        address: SCHEMA_REGISTRY,
        abi: SchemRegistryAbi,
        functionName: "get_all_schemas_records",
        watch: false,
    });

    const {
        data: schemaData,
        isLoading: schemaLoading,
        error: schemaError,
        refetch: refetchSchema
    } = useContractRead({
        address: SCHEMA_REGISTRY,
        abi: SchemRegistryAbi,
        functionName: "get_schema",
        args: [schemaUID],
        watch: false,
    });
   
    const fetchSchemas = async () => {
        try {
            setLoading(true);
            // if (!isConnected || !account) {
            //     toast.error("Connect wallet to continue");
            //     return;
            // }
            const result = await refetchAllSchemas();
            // const result1 =await refetchSchema();


            if (result && result.data ) {
                const parsedData: any = result.data;
                console.log("parsedData: ",parsedData);
                const sampleSchemas: Schema[] = parsedData.map((item: any, index: number) => ({
                    uid: `0x${item.uid.toString(16)}`,
                    txhash: item.txhash || `0x${(Math.random() * 1e64).toString(16).padStart(64, '0')}`,
                    schema: item.schema || `Schema ${index + 1}`,
                    resolver: `0x${item.resolver.toString(16)}`,
                    attestations: item.attestations || Math.floor(Math.random() * 10) + 1,
                })
                );
                
                setSchemaUID(sampleSchemas[0].uid);
                console.log("state",schemaUID);
                const result1 =await refetchSchema();
                console.log("Result1: ",result1);
                const sampleSchemas1: Schema[] = parsedData.map((item: any, index: number) => ({
                    uid: `0x${item.uid.toString(16)}`,
                    txhash: item.txhash || `0x${(Math.random() * 1e64).toString(16).padStart(64, '0')}`,
                    schema: result1 || `Schema ${index + 1}`,
                    resolver: `0x${item.resolver.toString(16)}`,
                    attestations: item.attestations || Math.floor(Math.random() * 10) + 1,
                })
                );
                
                setSchemas(sampleSchemas);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch schema details. Please try again.");
            console.error("Error fetching schema details:", error);
        }
    }

    useEffect(() => {
        fetchSchemas();
    }, [isConnected, account]);

    const truncateTxHash = (txhash: string) => {
        return `${txhash.slice(0, 6)}...${txhash.slice(-5)}`;
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
        <div className="flex flex-col items-center font-serif justify-center w-full min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="flex flex-col w-full max-w-6xl bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-6 p-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-col justify-between items-left mb-1">
                        <h1 className="text-4xl font-bold  text-gray-800 dark:text-gray-200">Schemas</h1>
                        <p className="text-lg text-gray-800  dark:text-gray-200 mb-3">Showing the most recent schemas</p>
                    </div>
                    <button
                        type="button"
                        className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        onClick={() => router.push("/schemas-flow")}
                    >
                        Create Schema
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
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Schema</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Resolver</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Attestations</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentSchemas.map((schema) => (
                                    <tr key={schema.uid}>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200 flex items-center">
                                            {truncateTxHash(schema.uid)}
                                            <FiCopy
                                                className="ml-2 cursor-pointer text-blue-600 hover:text-blue-800"
                                                onClick={() => handleCopy(schema.uid)}
                                            />
                                        </td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{truncateTxHash(schema.txhash)}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{schema.schema}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{truncateTxHash(schema.resolver)}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{schema.attestations}</td>
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

export default SchemasTable;
