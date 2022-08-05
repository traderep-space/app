/**
 * Hook for work with Lit Protocol.
 */
export default function useLitProtocol() {
  const LitJsSdk = require('lit-js-sdk');

  /**
   * TODO: Move hardcoded values to function params
   */
  let encrypt = async function () {
    // Define auth sig
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: 'mumbai',
    });

    // Define control conditions
    const accessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'mumbai',
        method: 'eth_getBalance',
        parameters: [':userAddress', 'latest'],
        returnValueTest: {
          comparator: '>=',
          value: '1000000000000', // 0.000001 ETH
        },
      },
    ];

    // Encrypt content
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      'this is a secret message',
    );

    // Saving the encrypted content to the Lit nodes
    const encryptedSymmetricKey = await (
      window as any
    ).litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: 'mumbai',
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16',
      ),
    };
  };

  return {
    encrypt,
  };
}
