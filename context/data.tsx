import EarlyAdopterToken from 'classes/EarlyAdopterToken';
import LoadingBackdrop from 'components/backdrop/LoadingBackdrop';
import useEarlyAdopterToken from 'hooks/useEarlyAdopterToken';
import useError from 'hooks/useError';
import { createContext, useContext, useEffect, useState } from 'react';
import { Web3Context } from './web3';

interface IDataContext {
  accountEarlyAdopterToken: EarlyAdopterToken | null;
}

export const DataContext = createContext<Partial<IDataContext>>({});

export function DataProvider({ children }: any) {
  const { isReady: isWebContextReady, account } = useContext(Web3Context);
  const { handleError } = useError();
  const { getEarlyAdopterToken } = useEarlyAdopterToken();
  const [isReady, setIsReady] = useState(false);
  const [accountEarlyAdopterToken, setAccountEarlyAdopterToken] =
    useState<EarlyAdopterToken | null>(null);

  async function updateContext() {
    if (!account) {
      clearContext();
    } else {
      try {
        // Define data
        const accountEarlyAdopterToken = await getEarlyAdopterToken(account);
        // Save early adopter token or clear context if account doesn't have it
        if (accountEarlyAdopterToken) {
          setAccountEarlyAdopterToken(accountEarlyAdopterToken);
        } else {
          clearContext();
        }
      } catch (error: any) {
        handleError(error, false);
      }
    }
  }

  async function clearContext() {
    setAccountEarlyAdopterToken(null);
  }

  /**
   * Update context if web3 context is ready.
   */
  useEffect(() => {
    setIsReady(false);
    if (isWebContextReady) {
      updateContext().then(() => setIsReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWebContextReady]);

  /**
   * Update context if data context is ready and account is changed.
   */
  useEffect(() => {
    if (isReady) {
      updateContext();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <DataContext.Provider
      value={{ accountEarlyAdopterToken: accountEarlyAdopterToken }}
    >
      {isReady ? <>{children}</> : <LoadingBackdrop />}
    </DataContext.Provider>
  );
}
