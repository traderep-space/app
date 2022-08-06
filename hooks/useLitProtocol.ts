/**
 * Hook for work with Lit Protocol.
 */
export default function useLitProtocol() {
  const LitJsSdk = require('lit-js-sdk');

  let encrypt = async function (tokenId: string, rawString: string) {
    // Get auth sig
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
    });
    // Encrypt content
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      rawString,
    );
    // Saving the encrypted string to the Lit nodes
    const encryptedSymmetricKey = await (
      window as any
    ).litNodeClient.saveEncryptionKey({
      accessControlConditions: getAccessControlConditions(tokenId),
      symmetricKey,
      authSig,
      chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
    });
    // Return result
    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16',
      ),
    };
  };

  let decrypt = async function (
    tokenId: string,
    encryptedString: Blob,
    encryptedSymmetricKey: string,
  ) {
    // Get auth sig
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
    });
    // Get symmetric key
    const symmetricKey = await (window as any).litNodeClient.getEncryptionKey({
      accessControlConditions: getAccessControlConditions(tokenId),
      toDecrypt: encryptedSymmetricKey,
      chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
      authSig,
    });
    // Decrypt
    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey,
    );
    // Return
    return { decryptedString };
  };

  return {
    encrypt,
    decrypt,
  };
}

function getAccessControlConditions(tokenId: string) {
  return [
    {
      contractAddress: process.env.NEXT_PUBLIC_FORECAST_CONTRACT_ADDRESS,
      standardContractType: 'ERC721',
      chain: process.env.NEXT_PUBLIC_LIT_PROTOCOL_CHAIN,
      method: 'ownerOf',
      parameters: [tokenId],
      returnValueTest: {
        comparator: '=',
        value: ':userAddress',
      },
    },
  ];
}
