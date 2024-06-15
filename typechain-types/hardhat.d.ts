/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  DeployContractOptions,
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "Math",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Math__factory>;
    getContractFactory(
      name: "Strings",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Strings__factory>;
    getContractFactory(
      name: "ISchemaRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISchemaRegistry__factory>;
    getContractFactory(
      name: "ISemver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISemver__factory>;
    getContractFactory(
      name: "Lock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lock__factory>;
    getContractFactory(
      name: "ISchemaResolver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.ISchemaResolver__factory>;
    getContractFactory(
      name: "SchemaRegistry",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.SchemaRegistry__factory>;
    getContractFactory(
      name: "Semver",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Semver__factory>;

    getContractAt(
      name: "Math",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Math>;
    getContractAt(
      name: "Strings",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Strings>;
    getContractAt(
      name: "ISchemaRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISchemaRegistry>;
    getContractAt(
      name: "ISemver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISemver>;
    getContractAt(
      name: "Lock",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Lock>;
    getContractAt(
      name: "ISchemaResolver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.ISchemaResolver>;
    getContractAt(
      name: "SchemaRegistry",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.SchemaRegistry>;
    getContractAt(
      name: "Semver",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.Semver>;

    deployContract(
      name: "Math",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "Strings",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "ISchemaRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISchemaRegistry>;
    deployContract(
      name: "ISemver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISemver>;
    deployContract(
      name: "Lock",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lock>;
    deployContract(
      name: "ISchemaResolver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISchemaResolver>;
    deployContract(
      name: "SchemaRegistry",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SchemaRegistry>;
    deployContract(
      name: "Semver",
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Semver>;

    deployContract(
      name: "Math",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Math>;
    deployContract(
      name: "Strings",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Strings>;
    deployContract(
      name: "ISchemaRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISchemaRegistry>;
    deployContract(
      name: "ISemver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISemver>;
    deployContract(
      name: "Lock",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Lock>;
    deployContract(
      name: "ISchemaResolver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.ISchemaResolver>;
    deployContract(
      name: "SchemaRegistry",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.SchemaRegistry>;
    deployContract(
      name: "Semver",
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<Contracts.Semver>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | DeployContractOptions
    ): Promise<ethers.Contract>;
  }
}