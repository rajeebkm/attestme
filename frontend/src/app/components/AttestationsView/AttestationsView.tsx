"use client";

import React, { useState } from "react";
import { useAccount, useContractRead } from "@starknet-react/core";
import toast from "react-hot-toast";
import RevokeModal from './RevokeModal';
import AttestationsAbi from "@/app/abi/attestation.abi.json";
import { SAS } from "@/app/utils/constant";

interface DecodedSchema {
    type: string;
    name: string;
    value: string;
}

interface AttestationData {
    id: string;
    from: string;
    to: string;
    schemaUID: string;
    created: string;
    expiration: string;
    revoked: string;
    revocable: string;
    attestedData: string
}

function AttestationsView() {
    const { account, isConnected } = useAccount();
    const [attestationUID, setAttestationUID] = useState('');
    const [attestationData, setAttestationData] = useState<AttestationData | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isRawDataExpanded, setIsRawDataExpanded] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAttestationUID(event.target.value);
    };
    const { data, isLoading, error, refetch } = useContractRead({
        address: SAS,
        abi: AttestationsAbi,
        functionName: "getAttestation",
        args: [attestationUID],
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
                console.log("ParsedData: ", parsedData);
                console.log("ParsedData: ", parsedData.uid);
                console.log("ADATA:", parsedData.data)

                if (parsedData.uid != "") {
                    const mockData: AttestationData = {
                        id: `0x${parsedData.uid.toString(16)}`,
                        schemaUID: `0x${parsedData.schema.toString(16)}`,
                        from: `0x${parsedData.attester.toString(16)}`,
                        to: `0x${parsedData.recipient.toString(16)}`,
                        created: parsedData.time.toString(),
                        expiration: parsedData.expirationTime.toString(),
                        revoked: "No",
                        revocable: parsedData.revocable.toString(),
                        attestedData: parsedData.data.toString(),
                    };
                    console.log("mockData: ", mockData.attestedData);
                    setTimeout(() => {
                        setAttestationData(mockData);
                        setLoading(false);
                    }, 1000);
                } else {
                    toast.error("Invalid Schema UID");
                    setAttestationData(null);
                }
            } else {
                toast.error("Failed to fetch schema details. Please try again.");
                console.error("Error fetching schema details:", error);
                setAttestationData(null);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch attestations details. Please try again.");
            console.error("Error fetching attestations details:", error);
        }
    };

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleRevoke = () => {
        toast.success("Attestation revoked successfully!");
        closeModal();
    };

    const toggleRawData = () => {
        setIsRawDataExpanded(!isRawDataExpanded);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b font-serif  from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-14 p-8">
                <h1 className="text-3xl text-center font-bold mb-6 text-gray-800 dark:text-gray-200">View Attestations</h1>

                <div className="mb-6">
                    <label className="block text-gray-800 dark:text-gray-200 text-xl font-medium mb-2" htmlFor="schemaUID">
                        Attestation UID:
                    </label>
                    <input
                        type="text"
                        id="attestationUID"
                        value={attestationUID}
                        onChange={handleInputChange}
                        className="p-3 rounded-md border border-gray-300 w-full text-black"
                        placeholder="Enter Attestation UID"
                    />
                    <button
                        onClick={fetchSchemaDetails}
                        disabled={loading || !attestationUID}
                        className="mt-4 bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        {loading ? 'Fetching...' : 'Get Attestation Details'}
                    </button>
                </div>

                {loading && <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>}

                {!loading && attestationData && isConnected && (
                    <>
                        <hr className="my-8 border-t-4 border-gray-500 dark:border-gray-700" />
                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Attestation UID:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.id}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Schema UID:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.schemaUID}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Created:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.created}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">FROM:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.from}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">TO:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.to}</p>
                        </div>

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Expiration:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.expiration}</p>
                        </div>
                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Revoked:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.revoked}</p>
                        </div>
                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Revocable:</h2>
                            <p className="text-gray-600 dark:text-gray-400">{attestationData.revocable}</p>
                        </div>
                        {/* <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Decoded Data:</h2>
                            <ul className="text-gray-600 dark:text-gray-400">
                                {attestationData.decodedData.map((field, index) => (
                                    <li key={index} className="py-1">{field.type} {field.name} : {field.value}</li>
                                ))}
                            </ul>
                        </div> */}

                        <div className="mb-4 p-4 border rounded-md bg-gray-100 dark:bg-gray-700 relative">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Attested Schema Data:</h2>
                            <div
                                className={`text-gray-600 dark:text-gray-400 overflow-auto max-h-80 ${isRawDataExpanded ? 'max-h-full' : ''}`}
                                style={{ whiteSpace: "pre-wrap", width: "100%", minWidth: "20rem" }}
                            >
                                {attestationData.attestedData}
                            </div>
                            {!isRawDataExpanded && (
                                <button
                                    onClick={toggleRawData}
                                    className="absolute bottom-0 right-0 mt-2 mr-2 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none"
                                >
                                    Show more
                                </button>
                            )}
                        </div>

                        <div className="flex flex-row gap-2 justify-center mt-4">
                            <button
                                onClick={openModal}
                                className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={!isConnected || !account || account.address !== attestationData?.from || attestationData?.revocable !== "true" || attestationData?.revoked !== "No"}
                            >
                                Revoke Attestation

                            </button>
                            <a href="/">
                                <button
                                    className="bg-blue-600 py-3 px-8 rounded text-white hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                >
                                    Home
                                </button>
                            </a>
                        </div>
                    </>
                )}
            </div>
            <RevokeModal isOpen={showModal} onClose={closeModal} onConfirm={handleRevoke} />
        </div>
    );
}

export default AttestationsView;
