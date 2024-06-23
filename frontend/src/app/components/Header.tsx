"use client";
import AddressBar, { UserModal } from "./AddressBar";
import { useEffect, useRef, useState } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import { LibraryBig } from "lucide-react";
import TransactionModal from "./TransactionList/TransactionModal";
import useTheme from "../hooks/useTheme";
import ThemeSwitch from "./Theme";
import NetworkSwitcher from "./NetworkSwitcher";
import ConnectModal from "./ConnectModal";
import Image from "next/image";

const Header = () => {
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const [openConnectModal, setOpenConnectModal] = useState(false);
  const [openConnectedModal, setOpenConnectedModal] = useState(false);
  const [isTransactionModalOpen, setIsModalTransactionOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleModal = () => {
    setOpenConnectModal((prev) => !prev);
  };

  const toggleMenu = () => {
    setOpenMenu((prev) => !prev);
  };

  const toggleUserModal = () => {
    setOpenConnectedModal((prev) => !prev);
  };

  const handleOpenTransactionListClick = () => {
    setIsModalTransactionOpen(true);
  };

  const handleCloseTransactionListClick = () => {
    setIsModalTransactionOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        toggleModal();
      }
    };
    document.body.addEventListener("keydown", closeOnEscapeKey);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, []);

  useEffect(() => {
    const lastUsedConnector = localStorage.getItem("lastUsedConnector");
    if (lastUsedConnector) {
      connect({
        connector: connectors.find(
          (connector) => connector.name === lastUsedConnector,
        ),
      });
    }
  }, [connectors]);

  useEffect(() => {
    if (openConnectModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openConnectModal]);

  const { theme, changeTheme } = useTheme();

  return (
    <>
      <header
        ref={dropdownRef}
        className="w-full fixed backdrop-blur-2xl dark:border-neutral-800 lg:bg-gray-200 lg:dark:bg-zinc-800/50 left-0 top-0  z-10 flex flex-wrap gap-4 py-2 px-4 md:py-4 md:px-10  justify-between items-center"
      >
        <span>
          <a href="/">
            <div className="p-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              <div className="bg-white p-1">
                <Image
                  className="border border-transparent"
                  src="/logo.png"
                  alt="Starknet logo"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          </a>
        </span>

        <div className="hidden md:flex gap-8">
          {address ? (
            <div className="flex justify-end">
              <AddressBar setOpenConnectedModal={setOpenConnectedModal} />
              <button
                className="mx-3 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                onClick={handleOpenTransactionListClick}
              >
                <LibraryBig className="h-full w-full" />
              </button>
            </div>
          ) : (
            <button
              onClick={toggleModal}
              className="hidden md:block bg-blue-600 hover:bg-blue-800 text-white text-bold py-2 px-4 rounded-full transition duration-300"
            >
              Connect Wallet
            </button>
          )}
          <NetworkSwitcher />

          <ThemeSwitch
            className="flex md:hidden lg:hidden sm:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />
        </div>

        <div className="flex items-center md:hidden gap-8">
          <ThemeSwitch
            className="flex md:hidden dark:transform-none transform dark:translate-none transition-all duration-500 ease-in-out"
            action={changeTheme}
            theme={theme}
            openMenu={openMenu}
          />

          <button
            title="toggle menu"
            onClick={toggleMenu}
            className="flex flex-col gap-2 md:hidden"
          >
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu
                  ? "rotate-45 translate-y-[0.625em]"
                  : "rotate-0 translate-y-0"
                }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu ? "opacity-0" : "opacity-100"
                }`}
            ></div>
            <div
              className={`w-[1.5em] h-[2px] ${theme === "dark" ? "bg-[#ffffff]" : "bg-[#000000]"
                } rounded-full transition-all duration-300 ease-in-out ${openMenu
                  ? "-rotate-45 translate-y-[-0.625em]"
                  : "rotate-0 translate-y-0"
                }`}
            ></div>
          </button>
        </div>

        <div
          className={`w-screen  transition-all duration-300 ease-in-out grid ${openMenu
            ? "min-h-[4rem] grid-rows-[1fr]  opacity-100"
            : "grid-rows-[0fr]  opacity-0"
            }  md:hidden`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-wrap gap-8">
              {address ? (
                <div className="flex justify-end">
                  <AddressBar setOpenConnectedModal={setOpenConnectedModal} />
                  <button
                    className="mx-3 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    onClick={handleOpenTransactionListClick}
                  >
                    <LibraryBig className="h-full w-full" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleModal}
                  className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded-full transition duration-300"
                >
                  Connect Wallet
                </button>
              )}
              <NetworkSwitcher />
            </div>
          </div>
        </div>
      </header>

      <ConnectModal isOpen={openConnectModal} onClose={toggleModal} />
      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={handleCloseTransactionListClick}
      />
      <UserModal
        openConnectedModal={openConnectedModal}
        closeConnectedModal={toggleUserModal}
        address={address ? address : ""}
      />
    </>
  );
};

export default Header;
