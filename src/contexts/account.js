import { useState } from 'react';
import { useAleoWASM } from '../hooks/aleo-wasm-hook.js';
import constate from 'constate';

function useAccount() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [aleoInstance] = useAleoWASM();

  const generateAccount = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setAccount(new aleoInstance.Account());
      setIsLoading(false);
    }, 25);
  };

  /**
   * Load Account from the Private Key
   * @param {string} privateKey
   */
  const loadAccount = (privateKey) => {
    setAccount(null);
    try {
      setAccount(new aleoInstance.Account({ privateKey: privateKey }));
    } catch (error) {
      console.error(error);
    }
  };

  const clear = () => {
    setAccount(null);
  };

  return {
    account,
    isLoading,
    generateAccount,
    loadAccount,
    aleoInstance,
    clear,
  };
}

export const [AccountProvider, useAccountProvider] = constate(useAccount);
