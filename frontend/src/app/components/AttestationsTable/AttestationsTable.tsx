"use client"
import { useEffect, useState } from "react";
import { Contract, RpcProvider } from "starknet";
import { SAS } from "@/app/utils/constant";
import AttestationAbi from "@/app/abi/attestation.abi.json";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCopy } from "react-icons/fi"; 
import toast from "react-hot-toast";
import { useAccount,useContractRead } from "@starknet-react/core";

interface Attestation {
    uid: string;
    from: string;
    to: string;
    type: string;
    age:number;
}

function AttestationsTable() {
    const { account, isConnected } = useAccount();
    const [attestationUID,setAttestationUID] = useState('');
    const [attestation, setSAttestation] = useState<Attestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; 
    const router = useRouter();

    const {
        data: allAttestationData,
        isLoading: allAttestationLoading,
        error: allAttestationError,
        refetch: refetchAllAttestation
    } = useContractRead({
        address: SAS,
        abi: AttestationAbi,
        functionName: "getAllAttestations",
        watch: false,
    });

    const fetchAttestations = async () => {
        try {
            setLoading(true);
            const result = await refetchAllAttestation();
        
            if (result && result.data ) {
                const parsedData: any = result.data;
                console.log("parsedData: ",parsedData);

                const attestationData: Attestation[] = parsedData.map((item: any, index: number) => ({
                    uid: `0x${item.uid.toString(16)}`,
                    from: `0x${item.attester.toString(16)}`,
                    to: `0x${item.recipient.toString(16)}`,
                    type: "onchain",
                    age: item.time.toString()
                })
                );
                setSAttestation(attestationData);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            toast.error("Failed to fetch attestation details. Please try again.");
            console.error("Error fetching attestation details:", error);
        }
    }

    useEffect(() => {
        fetchAttestations();
    }, [isConnected, account]);

    const truncateTxHash = (txhash: string) => {
        return `${txhash.slice(0, 6)}...${txhash.slice(-5)}`;
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(attestation.length / itemsPerPage)) {
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
    const currentAttestation = attestation.slice(indexOfFirstItem, indexOfLastItem);

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
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">From</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">To</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Type</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Age</th>
                                    <th className="border-b p-4 text-gray-800 dark:text-gray-200">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentAttestation.map((attestations) => (
                                    <tr key={attestations.uid}>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200 flex items-center">
                                            {truncateTxHash(attestations.uid)} 
                                            <FiCopy 
                                                className="ml-2 text-blue-600 cursor-pointer"
                                                onClick={() => handleCopy(attestations.uid)} 
                                            />
                                        </td>
                                        
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{truncateTxHash(attestations.from)}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{truncateTxHash(attestations.to)}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{attestations.type}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">{attestations.age}</td>
                                        <td className="border-b p-4 text-gray-800 dark:text-gray-200">
                                            <Link href="/attestations-view" legacyBehavior>
                                                <a className="text-blue-600 hover:underline">View Attestation</a>
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
                                disabled={currentPage === Math.ceil(attestation.length / itemsPerPage)}
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
