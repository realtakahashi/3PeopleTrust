"use client";

import { useApi } from "@/contexts/ApiContext";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { getXxxList } from "@/services/colorTheInternetService";
import { XXXData } from "@/types/ColorContractTypes";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Xxx() {
  const [xxxList, setXxxList] = useState<Array<XXXData>>();
  const { selectedAccount } = usePolkadot();
  const { api, isReady } = useApi();

  useEffect(() => {
    if (!api || !isReady) return;
    const _getXxxList = async () => {
      console.log("###### _getSignUpData 1");
      if (selectedAccount != null) {
        const xxxList = await getXxxList(
          api,
          String(selectedAccount.address) ?? ""
        );
        setXxxList(xxxList);
      } else {
        return;
      }
    };

    _getXxxList();
  }, [api, isReady, selectedAccount]);

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white  mt-10">
        <h1 className="text-3xl font-bold mb-6">XXXData List</h1>
        <div className="grid grid-cols-1 gap-4">
          {typeof xxxList !== "undefined"
            ? xxxList.map((item) => (
                // <Link
                //   href={`/xxx/${item.xxxId}`}
                //   key={item.xxxId}
                //   className="block border p-6 rounded-2xl shadow hover:shadow-lg transition bg-white"
                // >
                <div key={item.xxxId} className="block border p-6 rounded-2xl shadow hover:shadow-lg transition bg-white">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Tags: {item.tags}</p>
                  <p className="text-gray-500 text-sm">
                    XXX Id: {String(item.xxxId)}
                  </p>
                  <p className="text-gray-500 text-sm">Owner: {item.owner}</p>
                  <p className="text-gray-500 text-sm">
                    Second Member: {item.secondMember}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Third Member: {item.thirdMember}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Colored Site ID: {String(item.coloredSiteId)}
                  </p>
                  </div>
                // </Link>
              ))
            : ""}
        </div>
      </div>
    </>
  );
}
