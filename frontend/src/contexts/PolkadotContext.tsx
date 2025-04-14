'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
// import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';

type PolkadotContextType = {
  accounts: InjectedAccountWithMeta[];
  selectedAccount: InjectedAccountWithMeta | null;
  setSelectedAccount: (account: InjectedAccountWithMeta) => void;
};

const PolkadotContext = createContext<PolkadotContextType | undefined>(undefined);

export const PolkadotProvider = ({ children }: { children: React.ReactNode }) => {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);

  useEffect(() => {
    const { web3Enable, web3Accounts } = require('@polkadot/extension-dapp');
    const initAccounts = async () => {
      await web3Enable('My Next.js Dapp');
      const allAccounts = await web3Accounts();
      setAccounts(allAccounts);
    };

    initAccounts();
  }, []);

  return (
    <PolkadotContext.Provider value={{ accounts, selectedAccount, setSelectedAccount }}>
      {children}
    </PolkadotContext.Provider>
  );
};

export const usePolkadot = () => {
  const context = useContext(PolkadotContext);
  if (!context) throw new Error('usePolkadot must be used inside PolkadotProvider');
  return context;
};
