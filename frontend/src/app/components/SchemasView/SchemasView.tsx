"use client";
import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "@starknet-react/core";
import toast from "react-hot-toast";
import React from 'react';
import { SCHEMA_REGISTRY } from "@/app/utils/constant";
import SchemRegistryAbi from "@/app/abi/schemaRegistry.abi.json"

interface AttestationCount {
    onchain: number;
}

interface SchemaData {
    schemaId: string;
    created: string;
    creator: string;
    resolverContract: string;
    revocable: string;
    attestationCount: AttestationCount;
    rawSchema: string;
}

function SchemasView() {
    const { account, isConnected } = useAccount();
    const [schemaUID, setSchemaUID] = useState('');
    const [schemaData, setSchemaData] = useState<SchemaData | null>(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSchemaUID(event.target.value);
    };

    const { data, isLoading, error, refetch } = useContractRead({
        address: SCHEMA_REGISTRY,
        abi: SchemRegistryAbi,
        functionName: "get_schema",
        args: [schemaUID],
        watch: false,
    });
    
    const fetchSchemaDetails = async () => {
        setLoading(true);
        try {
            if (!isConnected || !account) {
                toast.error("Connect wallet to continue");
                setLoading(false);
                return;
            }

            const result = await refetch();

            if (result && result.data) {
                const parsedData: any = result.data;
                if (parsedData[0].uid != "") {
                    const mockData: SchemaData = {
                        schemaId: `0x${parsedData[0].uid.toString(16)}`,
                        created: "06/17/2024 2:47:36 am (8 hours ago)",
                        creator: "0x46d2134b87a8e4C4A53E12e0E229c79126bDAfCd",
                        resolverContract: `0x${parsedData[0]?.resolver.toString(16)}`,
                        revocable: parsedData[0]?.revocable.toString(),
                        attestationCount: {
                            onchain: 0
                        },
                        rawSchema: parsedData[1].toString(),
                    };
                    setSchemaData(mockData);
                } else {
                    toast.error("Invalid Schema UID");
                    setSchemaData(null);
                }
            } else {
                toast.error("Failed to fetch schema details. Please try again.");
                console.error("Error fetching schema details:", error);
                setSchemaData(null);
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch schema details. Please try again.");
            console.error("Error fetching schema details:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b font-serif  from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-14 p-8">
                <h1 className="text-3xl text-center font-bold mb-6 text-gray-800 dark:text-gray-200">View Schemas</h1>

                <div className="mb-6">
                    <label className="block text-gray-800 dark:text-gray-200 text-xl font-medium mb-2" htmlFor="schemaUID">
                        Schema UID:
                    </label>
                    <input
                        type="text"
                        id="schemaUID"
                        value={schemaUID}
                        onChange={handleInputChange}
                        className="p-3 rounded-md border border-gray-300 w-full text-black"
                        placeholder="Enter Schema UID"
                    />
                    <button
                        onClick={fetchSchemaDetails}
                        disabled={loading || !schemaUID}
                        className="mt-4 bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? 'Fetching...' : 'Get Schema Details'}
                    </button>
                </div>

                {loading && <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>}

                {!loading && schemaData && isConnected && (
                    <>
                        <hr className="my-8 border-t-4 border-gray-500 dark:border-gray-700" />
                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Schema UID:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.schemaId}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Created:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.created}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Creator:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.creator}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Resolver Contract:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.resolverContract}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Revocable Attestations:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.revocable}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Attestation Count:</h2>
                            <p className="text-gray-600 dark:text-gray-400">Onchain: {schemaData.attestationCount.onchain}</p>  
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Raw Schema:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{schemaData.rawSchema}</p>
                        </div>

                        <div className="flex justify-center mt-4">
                            <a
                                href="/"
                                className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Home
                            </a>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default SchemasView;
