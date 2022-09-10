import { Web3Context } from 'context/web3';
import { Contract } from 'ethers';
import { useContext } from 'react';
import contractAbi from 'contracts/abi/EarlyAdopterToken.json';
import WrongNetworkError from 'errors/WrongNetworkError';

/**
 * Hook for work with early adopter token contract.
 */
export default function useEarlyAdopterTokenContract() {
  const { provider, defaultProvider, isNetworkChainIdCorrect } =
    useContext(Web3Context);

  function getContract(signerOrProvider: any) {
    return new Contract(
      process.env.NEXT_PUBLIC_EARLY_ADOPTER_TOKEN_CONTRACT_ADDRESS || '',
      contractAbi,
      signerOrProvider,
    );
  }

  async function getTokenUri(tokenId: string) {
    if (!isNetworkChainIdCorrect) {
      return await getContract(defaultProvider).tokenURI(tokenId);
    }
    return await getContract(provider?.getSigner()).tokenURI(tokenId);
  }

  return {
    getTokenUri,
  };
}
