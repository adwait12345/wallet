import React, { useState, useEffect, ChangeEvent } from "react";
import { useAccount, useNetwork, useWaitForTransaction } from "wagmi";
import Image, { StaticImageData } from "next/image";
import {
  prepareSendTransaction,
  sendTransaction,
  fetchBalance,
} from "@wagmi/core";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import { useConnectModal, useChainModal } from "@rainbow-me/rainbowkit";
import { parseEther } from "viem";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import logo from "../../assets/logo.jpeg";
import polygon from "../../assets/polygon-token.png";
import eth from "../../assets/ethereum.png";

function Card() {
  const [icon, setIcon] = useState<StaticImageData>();
  const [balance, setBalance] = useState<string>();
  const [loading, setloading] = useState<boolean>(false);
  const [form, setForm] = useState({ to: "", value: "" });

  const network = useNetwork();
  const { openChainModal } = useChainModal();
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const addRecentTransaction = useAddRecentTransaction();

  const getBalance = async () => {
    const Balance = await fetchBalance({
      address: `0x${address?.replace("0x", "")}`,
    });
    return Balance.formatted;
  };
  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (network.chain?.id == 1) {
      setIcon(eth);
    }
    if (network.chain?.id == 137 || network.chain?.id == 80001) {
      setIcon(polygon);
    }

    if (network.chain?.id == undefined || network.chain?.id == undefined) {
      setIcon(logo);
    }
    const fetcher = async () => {
      const bl: any = await getBalance();
      return setBalance(bl || "0");
    };
    if (isConnected) {
      fetcher();
    }
  }, [isConnected, network.chain?.id]);

  // ######################################################################
  // ######################### Send Transaction ###########################
  // ######################################################################

  const Send = async () => {
    try {
      if (form.to !== "" && form.value !== "") {
        if (form.to.startsWith("0x", 0) && form.to.length == 42) {
          setloading(true);

          const bal = await getBalance();

          if (form.value <= bal) {
            const request = await prepareSendTransaction({
              to: form.to,
              value: parseEther(form.value),
            });

            const { hash } = await sendTransaction(request);

            setloading(false);
            addRecentTransaction({
              hash: hash,
              description: "SENT",
            });
            console.log(hash);
          } else {
            toast.error("Insufficient balance");
            setloading(false);
          }
        } else {
          return toast.error("Invalid address");
        }
      } else {
        toast.error("Please fill all fields");
        setloading(false);
      }
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };


  return (
    <div className="w-[550px] h-[390px] border rounded-3xl bg-[#ffffff] flex flex-col items-center  shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] gap-8">
      <div className=" w-11/12 mt-5 flex items-center justify-between">
        <button className="px-5 py-2 rounded-lg flex items-center justify-center bg-[#10bb352c] text-[#10bb35]">
          {network.chain?.nativeCurrency.symbol && balance ? (
            parseFloat(balance).toFixed(2) +
            network.chain?.nativeCurrency.symbol
          ) : (
            <>Send</>
          )}
        </button>
        <Image
          className=" cursor-pointer"
          onClick={openChainModal}
          src={icon?.src || ""}
          alt=""
          width={30}
          height={30}
        />
      </div>
      <div className="w-11/12 flex flex-col  gap-4">
        <div className=" font-poppins flex flex-col gap-1">
          <h3 className=" text-sm font-semibold text-[#898989]">
            Reciver Wallet Address
          </h3>
          <input
            className="w-full border px-5 py-4 rounded-lg text-sm"
            type="text"
            name="to"
            placeholder="Public address"
            onChange={handleFormChange}
          />
        </div>
        <div className=" font-poppins flex flex-col gap-1">
          <h3 className=" text-sm font-semibold text-[#898989]">
            Tokens (ERC20)
          </h3>
          <input
            className="w-full border px-5 py-4 rounded-lg text-sm"
            type="number"
            placeholder={`0.0 ${network.chain?.nativeCurrency.symbol || ""}`}
            name="value"
            onChange={handleFormChange}
          />
        </div>
      </div>
      <div className="w-11/12">
        {useAccount().isConnected ? (
          <button
            onClick={Send}
            className="w-full h-16 rounded-lg flex items-center justify-center bg-[#10bb35] text-white font-semibold text-md"
          >
            {loading ? (
              <>
                <div className="flex space-x-2 animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </>
            ) : (
              <>Send Stream </>
            )}
          </button>
        ) : (
          <>
            {" "}
            {openConnectModal && (
              <button
                onClick={openConnectModal}
                className="w-full py-4 rounded-lg flex items-center justify-center bg-[#10bb35] text-white font-semibold text-md"
              >
                Connect Wallet
              </button>
            )}
          </>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Card;
