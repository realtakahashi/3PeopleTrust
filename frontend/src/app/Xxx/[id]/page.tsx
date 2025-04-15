"use client";

import { useApi } from "@/contexts/ApiContext";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { getXxxData, getXxxList } from "@/services/colorTheInternetService";
import { ColoredData, XXXData } from "@/types/ColorContractTypes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function XXXDetailPage() {
  const params = useParams();
  const { xxxId } = params;
  const [xxx, setXxx] = useState<XXXData>();
  const { selectedAccount } = usePolkadot();
  const { api, isReady } = useApi();

  useEffect(() => {
    if (!api || !isReady) return;
    const _getXxx = async () => {
      console.log("###### _getSignUpData 1");
      if (selectedAccount != null) {
        const xxxData = await getXxxData(
          api,
          String(selectedAccount.address) ?? "",
          Number(xxxId)
        );
        setXxx(xxxData);
      }
    };
    _getXxx();
  }, [api, isReady, selectedAccount]);

  const colorData = fakeColoredData;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {typeof xxx !== "undefined" && (
        <div>
          <h1 className="text-2xl font-bold mb-4">詳細: {xxx.name}</h1>
          <div className="bg-white p-6 rounded-2xl shadow border mb-6">
            <p>
              <strong>Tags:</strong> {xxx.tags}
            </p>
            <p>
              <strong>Owner:</strong> {xxx.owner}
            </p>
            <p>
              <strong>Second Member:</strong> {xxx.secondMember}
            </p>
            <p>
              <strong>Third Member:</strong> {xxx.thirdMember}
            </p>
            <p>
              <strong>Colored Site ID:</strong> {String(xxx.coloredSiteId)}
            </p>
          </div>
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Color Data</h2>
      <div className="grid grid-cols-1 gap-4">
        {colorData.map((cd: ColoredData) => (
          <div
            key={cd.coloredId}
            className="p-4 border rounded-xl bg-gray-50 shadow-sm"
          >
            <p>
              <strong>URL:</strong>{" "}
              <a href={cd.url} className="text-blue-600 hover:underline">
                {cd.url}
              </a>
            </p>
            <p>
              <strong>Owner Approval:</strong> {cd.owner_approval ? "✅" : "❌"}
            </p>
            <p>
              <strong>Second Member Approval:</strong>{" "}
              {cd.second_member_approval ? "✅" : "❌"}
            </p>
            <p>
              <strong>Third Member Approval:</strong>{" "}
              {cd.third_member_approval ? "✅" : "❌"}
            </p>
            <p>
              <strong>Vote Count:</strong> {cd.vote_count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
