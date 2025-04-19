'use client';

import { useState } from 'react';
import { ColoredData } from '@/types/ColorContractTypes';
import { useApi } from "@/contexts/ApiContext";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { approveColoredData, getColoredList, voteColoredData } from "@/services/colorTheInternetService";

export default function ColoredListPage() {
  const [xxxId, setXxxId] = useState('');
  const [data, setData] = useState<ColoredData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { selectedAccount } = usePolkadot();
  const { api, isReady } = useApi();

  const fetchData = async () => {
    if (!xxxId) {
      setError('Please enter the XXX ID.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getColoredList(api, String(selectedAccount.address) ?? "", xxxId);
      setData(data);
    } catch (err) {
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (coloredId: string) => {
    if (selectedAccount == null){
      setError('Account is not selected.');
      return;
    }
    console.log("##### handleApprove coloredId:", coloredId);
    console.log("##### handleApprove xxxId:", xxxId);
    const res = await approveColoredData(api, selectedAccount, xxxId, coloredId);
  };

  const handleVote = async (coloredId: string) => {
    if (selectedAccount == null){
      setError('Account is not selected.');
      return;
    }
    const res = await voteColoredData(api, selectedAccount, xxxId, coloredId);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white  mt-10">
      <h1 className="text-2xl font-bold mb-4">Colored Data List</h1>

      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter the XXX ID."
          value={xxxId}
          onChange={(e) => setXxxId(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-64"
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Fetch Colored Data
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <table className="w-full table-auto border border-gray-300 mt-4 shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Colored ID</th>
              <th className="px-4 py-2 border">URL</th>
              <th className="px-4 py-2 border">Owner Approved</th>
              <th className="px-4 py-2 border">Second Member</th>
              <th className="px-4 py-2 border">Third Member</th>
              <th className="px-4 py-2 border">Votes</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.coloredId} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{item.coloredId}</td>
                <td className="px-4 py-2 border text-blue-600 underline">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url}
                  </a>
                </td>
                <td className="px-4 py-2 border text-center">
                  {item.owner_approval ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 border text-center">
                  {item.second_member_approval ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 border text-center">
                  {item.third_member_approval ? '✅' : '❌'}
                </td>
                <td className="px-4 py-2 border text-center">
                  {item.vote_count}
                </td>
                <td className="px-4 py-2 border flex flex-col gap-2">
                  <button
                    onClick={() => handleApprove(item.coloredId)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleVote(item.coloredId)}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                  >
                    Vote
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
