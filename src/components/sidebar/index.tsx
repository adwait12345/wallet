import Image from "next/image";
import React from "react";
import Logo from "../../assets/logo.jpeg";
import { CgArrowsExchangeV } from "react-icons/cg";
import { GoHistory } from "react-icons/go";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {  useDisconnect } from "wagmi";

function Sidebar() {
  const router = usePathname();

  const { disconnect } = useDisconnect();

  return (
    <div className="flex flex-col justify-between items-center h-full py-5">
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-10/12 flex items-center gap-1">
          <Image
            className="w-12 h-12 object-contain rounded-md"
            src={Logo}
            alt=""
          />
          <h1 className=" font-poppins font-extrabold tracking-tighter text-[32px]">
            rep3
          </h1>
        </div>
        <div className="w-full text-black font-poppins flex flex-col items-center gap-3 font-medium  text-[14px]">
          <Link href="/" className="w-full flex justify-center">
            <button
              className={`w-10/12  h-[50px] rounded-lg flex items-center gap-2  ${
                router == "/" ? "bg-[#f0f0f0] border" : "bg-white  "
              } `}
            >
              <CgArrowsExchangeV className="w-6 h-6 ml-3" />
              Stream
            </button>
          </Link>

          <Link href="/history" className="w-full flex justify-center">
            <button
              className={`w-10/12  h-[50px] rounded-lg flex items-center gap-2  ${
                router == "/history" ? "bg-[#f0f0f0] border" : "bg-white  "
              } `}
            >
              <GoHistory className="w-5 h-5 ml-3" />
              Activity History
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full flex items-center justify-center">
        <button
          className="px-2 py-1 border font-poppins text-red-600 bg-red-50 border-red-600 rounded-lg"
          onClick={() => {
            disconnect();
          }}
        >
          {" "}
          Disconnect
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
