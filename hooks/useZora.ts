import zoraAddresses from '@zoralabs/v3/dist/addresses/80001.json'; // Mainnet addresses, 4.json would be Rinkeby Testnet
import { AsksV1_1__factory } from '@zoralabs/v3/dist/typechain/factories/AsksV1_1__factory';
import { IERC721__factory } from '@zoralabs/v3/dist/typechain/factories/IERC721__factory';
import { ZoraModuleManager__factory } from '@zoralabs/v3/dist/typechain/factories/ZoraModuleManager__factory';
import { Web3Context } from 'context/web3';
import WrongNetworkError from 'errors/WrongNetworkError';
import { ethers } from 'ethers';
import { useContext } from 'react';

/**
 * Hook for work with Zora.
 */
export default function useZora() {
  const { account, provider, isNetworkChainIdCorrect } =
    useContext(Web3Context);

  let approveTokens = async function (contractAddress: string) {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    // Connect NFT contract
    const erc721Contract = IERC721__factory.connect(
      contractAddress,
      provider?.getSigner(),
    );
    // Connect Zora V3 Module Manager contract
    const moduleManagerContract = ZoraModuleManager__factory.connect(
      zoraAddresses.ZoraModuleManager,
      provider?.getSigner(),
    );
    // Approving a Transfer Helper
    const erc721TransferHelperAddress = zoraAddresses.ERC721TransferHelper;
    const isTransferHelperApproved = await erc721Contract.isApprovedForAll(
      account,
      erc721TransferHelperAddress, // V3 Module Transfer Helper to approve
    );
    if (isTransferHelperApproved === false) {
      await erc721Contract.setApprovalForAll(erc721TransferHelperAddress, true);
    }
    // Approving Modules in the Module Manager
    const isModuleApproved = await moduleManagerContract.isModuleApproved(
      account,
      zoraAddresses.AsksV1_1,
    );
    if (isModuleApproved === false) {
      await moduleManagerContract.setApprovalForModule(
        zoraAddresses.AsksV1_1,
        true,
      );
    }
  };

  let createAsk = async function (
    contractAddress: string,
    tokenId: string,
    price: string,
  ) {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    // Approve tokens if required
    await approveTokens(contractAddress);
    // Define params
    const currency = '0x0000000000000000000000000000000000000000'; // 0 address for ETH sale
    const findersFeeBps = '0';
    // Connect AsksV1_1 module
    const askModuleContract = AsksV1_1__factory.connect(
      zoraAddresses.AsksV1_1,
      provider?.getSigner(),
    );
    // Use module
    return askModuleContract.createAsk(
      contractAddress,
      tokenId,
      ethers.utils.parseEther(price),
      currency,
      account,
      findersFeeBps,
    );
  };

  let fillAsk = async function (
    contractAddress: string,
    tokenId: string,
    price: string,
  ) {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    // Define params
    const finder = '0x0000000000000000000000000000000000000000'; // Address that helped find the buyer
    const currency = '0x0000000000000000000000000000000000000000'; // 0 address for ETH sale
    // Connect AsksV1_1 module
    const askModuleContract = AsksV1_1__factory.connect(
      zoraAddresses.AsksV1_1,
      provider?.getSigner(),
    );
    // Use module
    await askModuleContract.fillAsk(
      contractAddress,
      tokenId,
      currency,
      ethers.utils.parseEther(price),
      finder,
      { value: ethers.utils.parseEther(price) },
    );
  };

  let getAsk = async function (contractAddress: string, tokenId: string) {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    // Connect AsksV1_1 module
    const askModuleContract = AsksV1_1__factory.connect(
      zoraAddresses.AsksV1_1,
      provider?.getSigner(),
    );
    // Use module
    return askModuleContract.askForNFT(contractAddress, tokenId);
  };

  return {
    approveTokens,
    createAsk,
    fillAsk,
    getAsk,
  };
}
