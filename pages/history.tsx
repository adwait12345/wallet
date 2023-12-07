import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import Link from "next/link";

interface Transaction {
  page: number;
  currentPage: Array<{
    hash: string;
    description: string;
    status: string;
  }>;
}

function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const { address } = useAccount();
  const { chain } = useNetwork();

  // Use state to handle local storage data
  const [storedData, setStoredData] = useState<Record<string, any> | null>(
    null
  );

  useEffect(() => {
    // Check if we are on the client side
    if (typeof window !== "undefined") {
      // Retrieve data from local storage
      const storedDataString = localStorage.getItem("rk-transactions") || "";

      if (storedDataString) {
        const parsedStoredData = JSON.parse(storedDataString);
        setStoredData(parsedStoredData);
      }
    }
  }, []);

  // Check if address and chain are defined before accessing storedData
  const dataForAddressAndChain =
    address && chain && storedData
      ? storedData?.[address]?.[chain.id]
      : undefined;

  useEffect(() => {
    if (dataForAddressAndChain) {
      const itemsPerPage = 10;
      const updatedTransactions = [];

      for (let i = 0; i < dataForAddressAndChain.length; i += itemsPerPage) {
        const currentPage = dataForAddressAndChain.slice(i, i + itemsPerPage);
        updatedTransactions.push({
          page: i / itemsPerPage + 1,
          currentPage,
        });
        console.log({ page: i / itemsPerPage + 1, currentPage }, currentPage);
      }

      setTransactions(updatedTransactions);
    }
  }, [address, chain, dataForAddressAndChain]);

  return (
    <div className="w-full h-full flex justify-center items-start">
      <div className="w-10/12 flex flex-col gap-5 mt-7 ">
        <div className="">
          <h1 className=" font-poppins text-3xl font-semibold">
            Activity History
          </h1>
        </div>
        <div className="w-full flex flex-col p-3 border rounded-2xl gap-3 shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px]">
          {!transactions.length ? (
            <div className="flex w-full justify-center">Not found</div>
          ) : (
            transactions[currentIndex]?.currentPage.map((e, idx: React.Key) => {
              return (
                <div
                  key={idx}
                  className="w-full px-4 py-3 border flex items-center justify-between font-poppins rounded-md bg-blue-50"
                >
                  <div className="">{e.description}</div>
                  <div className="flex items-center gap-3">
                    {e.status === "confirmed" ? (
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 mt-1 rounded-full bg-[#15da1c]"></span>
                        {e.status}
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 mt-1 rounded-full bg-[#ffe30f]"></span>
                        {e.status}
                      </div>
                    )}
                    <Link
                      target="_blank"
                      href={`https://mumbai.polygonscan.com/tx/` + e.hash}
                    >
                      <GoLinkExternal />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="w-full flex items-center justify-end gap-4">
          <button
            onClick={() => {
              currentIndex + 1 > 1 && setCurrentIndex(currentIndex - 1);
            }}
          >
            <MdKeyboardArrowLeft />
          </button>
          <button>{currentIndex + 1}</button>
          <button
            disabled={transactions[currentIndex]?.currentPage.length < 10}
            onClick={() => {
              setCurrentIndex(currentIndex + 1);
            }}
          >
            <MdKeyboardArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default History;
