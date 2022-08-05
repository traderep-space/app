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
  const { provider, isNetworkChainIdCorrect } = useContext(Web3Context);

  /**
   * TODO: Move hardcoded values to function params
   */
  let approveTokens = async function () {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }
    // Define addresses
    const ownerAddress = '0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1';
    const nftContractAddress = '0x5A544F35Dd360B67B59027D6b0F539231BF0F0B0';

    // Connect NFT contract
    const erc721Contract = IERC721__factory.connect(
      nftContractAddress,
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
      ownerAddress, // NFT owner address
      erc721TransferHelperAddress, // V3 Module Transfer Helper to approve
    );
    if (isTransferHelperApproved === false) {
      console.log('[Dev] Start approving a Transfer Helper');
      await erc721Contract.setApprovalForAll(erc721TransferHelperAddress, true);
    }

    // Approving Modules in the Module Manager
    const isModuleApproved = await moduleManagerContract.isModuleApproved(
      ownerAddress,
      zoraAddresses.AsksV1_1,
    );
    if (isModuleApproved === false) {
      console.log('[Dev] Start approving Modules in the Module Manager');
      await moduleManagerContract.setApprovalForModule(
        zoraAddresses.AsksV1_1,
        true,
      );
    }
  };

  /**
   * TODO: Move hardcoded values to function params
   */
  let createAsk = async function () {
    // Check network
    if (!isNetworkChainIdCorrect) {
      throw new WrongNetworkError();
    }

    // Connect Asks v1.1 Module Contract
    const askModuleContract = AsksV1_1__factory.connect(
      zoraAddresses.AsksV1_1,
      provider?.getSigner(),
    );

    // Define params
    const nftContractAddress = '0x5A544F35Dd360B67B59027D6b0F539231BF0F0B0';
    const askPrice = ethers.utils.parseEther('0.01');
    const ownerAddress = '0x4306D7a79265D2cb85Db0c5a55ea5F4f6F73C4B1';
    const findersFeeBps = '0';
    const tokenId = '0';

    // Calling Create Ask
    await askModuleContract.createAsk(
      nftContractAddress,
      tokenId,
      askPrice,
      '0x0000000000000000000000000000000000000000', // 0 address for ETH sale
      ownerAddress,
      findersFeeBps,
    );
  };

  return {
    approveTokens,
    createAsk,
  };
}
