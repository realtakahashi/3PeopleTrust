'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiPromise, WsProvider } from '@polkadot/api';

interface ApiContextValue {
  api: ApiPromise | null;
  isReady: boolean;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initApi = async () => {
      try {
        const provider = new WsProvider(String(process.env.NEXT_PUBLIC_BLOCKCHAIN_URL) ?? "");
        const api = await ApiPromise.create({ provider });
        await api.isReady;
        setApi(api);
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize ApiPromise:', err);
      }
    };

    initApi();
  }, []);

  return (
    <ApiContext.Provider value={{ api, isReady }}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextValue => {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error('useApi must be used within ApiProvider');
  }
  return ctx;
};
