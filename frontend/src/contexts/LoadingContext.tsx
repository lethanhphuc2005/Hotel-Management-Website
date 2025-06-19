'use client';

import { createContext, useContext, useState } from 'react';

const LoadingContext = createContext({
  loading: false,
  setLoading: (loading: boolean) => { },
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
