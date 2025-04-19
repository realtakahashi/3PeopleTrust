// app/xxx/submit/page.tsx
'use client';

import { useState } from 'react';
import { useApi } from "@/contexts/ApiContext";
import { usePolkadot } from "@/contexts/PolkadotContext";
import { proposeColorTheSite } from "@/services/colorTheInternetService";

export default function SubmitXxxPage() {
  const [xxxId, setXxxId] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { selectedAccount } = usePolkadot();
  const { api, isReady } = useApi();

  const handleSubmit = async () => {
    if (!xxxId || !targetUrl) {
      setMessage('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
        if (selectedAccount == null){
            setMessage('Account is not selected.');
            return;
        }
        const res =  await proposeColorTheSite(api, selectedAccount, xxxId, targetUrl);
        if (!res){
            setMessage('Transaction failed.');
            return;
        }
        setMessage('✅ Transaction sent successfully.');
    } catch (err) {
      setMessage('❌ Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-center">Propose to color the site</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">XXX ID</label>
          <input
            type="text"
            value={xxxId}
            onChange={(e) => setXxxId(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target URL</label>
          <input
            type="url"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
}
