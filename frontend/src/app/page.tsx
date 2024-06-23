"use client";
import Image from "next/image";
import Header from "~/Header";
import Footer from "~/Footer";
import Link from "next/link";
import GithubIcon from "./svg/GithubIcon";
import UpRightArrowIcon from "./svg/UpRightArrowIcon";
import { useAccount } from "@starknet-react/core";
import toast from "react-hot-toast";
import { useEffect } from "react";
import Features from "./components/Features/Features";

export default function Home() {
  const { account,isConnected } = useAccount();
  
  useEffect(() => {
      if (!isConnected || !account) {
        toast.error("Connect Your Wallet!");
        return;
      } 
      if(isConnected && account){
        toast.success("Wallet Connected!");
        return;
      }
   
  }, [isConnected]);

  return (
    <main className="">
      <Header />
      <div className="flex min-h-screen flex-col font-serif items-center justify-center py-12 px-4 bg-gradient-to-b from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900">
        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-16 text-center lg:text-left">
          <div className="flex flex-col gap-6 w-full lg:w-1/2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 animate-fadeIn transition duration-700 ease-in-out transform hover:scale-105">
              Welcome to
            </h1>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-blue-600 dark:text-blue-400 animate-bounce transition duration-700 ease-in-out transform hover:scale-105">
              Attest Me
            </h2>
            <p className="text-lg md:text-2xl lg:text-2xl text-gray-600 dark:text-gray-400 animate-fadeInDelay transition duration-700 ease-in-out transform hover:scale-105">
              A simple tool for seamlessly attesting documents to Starknet
              testnet and mainnet
            </p>
            <div className="flex gap-4">
              <Link href="https://github.com/rajeebkm/attestme" legacyBehavior>
                <a className="flex justify-center items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-md font-medium border-2 border-blue-600 shadow-md hover:bg-blue-600 hover:shadow-lg active:bg-blue-800 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-700 ease-in-out">
                  <span>Welcome to SAS </span>
                  <span>
                    <GithubIcon />
                  </span>
                </a>
              </Link>
              <Link href="/page2" legacyBehavior>
                <a className="flex justify-center items-center gap-2 px-4 py-2 text-sm bg-white text-black rounded-md font-medium border-2 border-blue-600 shadow-md hover:bg-blue-600 hover:shadow-lg active:bg-white active:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-700 ease-in-out">
                  <span>Start Exploring</span>
                  <span><UpRightArrowIcon /></span>
                </a>
              </Link>
            </div>
          </div>
          <div className="flex w-full lg:w-1/2 justify-center lg:justify-end">
            <Image
              className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] transition duration-700 ease-in-out transform hover:scale-105"
              src="/starknetlogo.png"
              alt="Starknet logo"
              width={600}
              height={150}
              priority
            />
          </div>
        </div>

        <div className="mb-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center lg:text-left lg:max-w-5xl">
          <a
            href="/schemas-table"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">Create Schemas{" "} <UpRightArrowIcon /> </h2>
            <p className="text-sm-2 opacity-75">
              Schemas are foundational to the EAS ecosystem. They ensure that
              attestations are consistent, verifiable, and meaningful.{" "}
            </p>
          </a>
          <a
            href="/schemas-view"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">View Schemas <UpRightArrowIcon /> </h2>
            <p className="text-sm-2 opacity-75">
            View Schemas feature allows you to easily access and manage all the schemas you have created.{" "}
            </p>
          </a>
          <a
            href="/attestations-table"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">Make Attestations{" "} <UpRightArrowIcon /></h2>
            <p className="text-sm-2 opacity-75">
              Attestations serve as a bridge between the digital and physical
              worlds, providing a mechanism to verify and validate claims in
              various scenarios.{" "}
            </p>
          </a>

          <a
            href="/attestations-view"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className=" flex justify-center items-center gap-2 mb-3 text-2xl font-semibold">View Attestations{" "} <UpRightArrowIcon /> </h2>
            <p className="text-sm-2 opacity-75">
            View Attestations feature enables you to easily access and manage all the attestations you have issued or received.{" "}
            </p>
          </a>
        </div>

      </div>
      <Features />
      <Footer />
    </main>
  );
}
