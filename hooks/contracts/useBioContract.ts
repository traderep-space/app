import { Web3Context } from 'context/web3';
import { useContext } from 'react';
import { Contract } from 'ethers';
import WrongNetworkError from 'errors/WrongNetworkError';
import contractAbi from 'contracts/abi/Bio.json';

/**
 * Hook for work with bio contract.
 */
export default function useBioContract() {
  const { provider, isNetworkChainIdCorrect } = useContext(Web3Context);

  function getContract(signerOrProvider: any) {
    return new Contract(
      process.env.NEXT_PUBLIC_BIO_CONTRACT_ADDRESS || '',
      contractAbi,
      signerOrProvider,
    );
  }

  async function setURI(tokenURI: string) {
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    return await getContract(provider?.getSigner()).setURI(tokenURI);
  }

  return {
    setURI,
  };
}
