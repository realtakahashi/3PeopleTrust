'use client';

import { createXxx } from '@/services/colorTheInternetService';
import { useState } from 'react';
import { usePolkadot } from "@/contexts/PolkadotContext";
import { useApi } from "@/contexts/ApiContext";

export default function CreateXXXDataPage() {
    const { selectedAccount } = usePolkadot();
    const { api, isReady } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    tags: '',
  });

  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let res = false;
    if (selectedAccount == null){
        setResponseMessage('❌ Account is not selected');
        return;
    }
    try {
        res = await createXxx(api, selectedAccount, formData.name, formData.tags);
      if (res == true) {
        setResponseMessage('✅ Creating XXX is completed.');
      } else {
        setResponseMessage('❌ Creating XXX failed.');
      }
    } catch (err) {
      setResponseMessage('⚠️ Error occurred while creating XXX.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">XXXData Create Form</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: 'Name', name: 'name' },
          { label: 'Tags', name: 'tags' },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
              type="text"
              name={name}
              value={(formData as any)[name]}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>

      {responseMessage && (
        <div className="mt-4 text-center text-green-600 font-medium">
          {responseMessage}
        </div>
      )}
    </div>
  );
}
