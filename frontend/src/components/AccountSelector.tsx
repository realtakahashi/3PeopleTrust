'use client';

import { usePolkadot } from '@/contexts/PolkadotContext';

export const AccountSelector = () => {
  const { accounts, selectedAccount, setSelectedAccount } = usePolkadot();

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">Select your wallet address:</h2>
      <select
        className="mt-2 p-2 border rounded"
        value={selectedAccount?.address || ''}
        onChange={(e) => {
          const acc = accounts.find((a) => a.address === e.target.value);
          if (acc) setSelectedAccount(acc);
        }}
      >
        <option value="">-- Select Account --</option>
        {accounts.map((acc) => (
          <option key={acc.address} value={acc.address}>
            {acc.meta.name || 'No Name'} — {acc.address}
          </option>
        ))}
      </select>
    </div>
  );
};
