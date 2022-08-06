import { Web3Context } from 'context/web3';
import contractAbi from 'contracts/abi/Forecast.json';
import WrongNetworkError from 'errors/WrongNetworkError';
import { Contract } from 'ethers';
import { useContext } from 'react';

/**
 * Hook for work with forecast contract.
 */
export default function useForecastContract() {
  const { provider, isNetworkChainIdCorrect } = useContext(Web3Context);

  function getContract(signerOrProvider: any) {
    return new Contract(
      process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS || '',
      contractAbi,
      signerOrProvider,
    );
  }

  async function create() {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).create();
  }

  async function setUri(tokenId: string, tokenUri: string) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).setURI(tokenId, tokenUri);
  }

  return {
    create,
    setUri,
  };
}
