"use client";

import React, { useState } from "react";
import { useApi } from "@/contexts/ApiContext";
import { usePolkadot } from "@/contexts/PolkadotContext";
import {
  addThirdMember,
  getXxxData,
} from "@/services/colorTheInternetService";
import { XXXData } from "@/types/ColorContractTypes";

export default function UpdateSecondMemberPage() {
  const [xxxId, setXxxId] = useState<number | null>(null);
  const [fetchedData, setFetchedData] = useState<XXXData | null>(null);
  const [thirdMember, setThirdMember] = useState("");
  const { selectedAccount } = usePolkadot();
  const { api } = useApi();
  const [message, setMessage] = useState(' ');

  const handleFetch = async () => {
    if (selectedAccount != null) {
      const xxxData = await getXxxData(
        api,
        String(selectedAccount.address) ?? "",
        Number(xxxId)
      );
      setFetchedData(xxxData);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (xxxId == null) {
      alert("Please enter xxxId");
      return;
    }
    if (thirdMember == null) {
      alert("Please enter Third Member");
      return;
    }
    if (fetchedData?.thirdMember != null) {
        alert("Third Member is already set");
        return;
    }
    if (selectedAccount != null) {
      let res = await addThirdMember(
        api,
        selectedAccount,
        String(xxxId),
        thirdMember
      );
      if (res == true){
        setMessage("Third Member is updated.");
      }
    }
  };

  return (
    <>
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow-xl p-6 rounded-2xl border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        Update Third Member
      </h2>

      <div className="mb-6">
        <label className="block font-medium mb-2">Enter xxxId</label>
        <input
          type="number"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setXxxId(Number(e.target.value))}
        />
        <button
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleFetch}
        >
          Fetch XXXData
        </button>
      </div>

      {fetchedData && (
        <div>
          <div className="mb-6">
            <p>
              <strong>Name:</strong> {fetchedData.name}
            </p>
            <p>
              <strong>Tags:</strong> {fetchedData.tags}
            </p>
            <p>
              <strong>Owner:</strong> {fetchedData.owner}
            </p>
            <p>
              <strong>Second Member:</strong> {fetchedData.secondMember}
            </p>
            <p>
              <strong>Third Member:</strong> {fetchedData.thirdMember}
            </p>
            <p>
              <strong>Colored Site ID:</strong> {String(fetchedData.coloredSiteId)}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="block mb-2 font-medium">New Third Member</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4"
              value={thirdMember}
              onChange={(e) => setThirdMember(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Submit Update
            </button>
            {message && <p className="text-center mt-2 text-sm text-orange-600">{message}</p>}
          </form>
        </div>
      )}
    </div>
    </>
  )
}
