import Forecast from 'classes/Forecast';
import { BigNumber } from 'ethers';
import { blobToBase64 } from 'utils/converters';
import useForecastContract from './contracts/useForecastContract';
import useIpfs from './useIpfs';
import useLitProtocol from './useLitProtocol';
import useSubgraph from './useSugraph';

/**
 * Hook for work with forecasts.
 */
export default function useForecast() {
  const { findForecasts } = useSubgraph();
  const { uploadJsonToIPFS } = useIpfs();
  const { encrypt } = useLitProtocol();
  const { create, setUri } = useForecastContract();

  let postForecast = async function (params: any) {
    // Create forecast and get token id
    const createTransaction = await create();
    const createReceipt = await createTransaction.wait();
    const tokenId = BigNumber.from(
      createReceipt.events.find((event: any) => event.event === 'Transfer')
        .topics[3],
    ).toString();
    // Encrypt forecast params
    const paramsString = JSON.stringify(params);
    const { encryptedString, encryptedSymmetricKey } = await encrypt(
      tokenId,
      paramsString,
    );
    // Upload encrypted data to IPFS
    const encryptedStringBlob64 = await blobToBase64(encryptedString);
    const { url: tokenUri } = await uploadJsonToIPFS({
      encryptedStringBlob64: encryptedStringBlob64,
      encryptedSymmetricKey: encryptedSymmetricKey,
    });
    // Set token uri
    await setUri(tokenId, tokenUri);
  };

  let decryptForecast = async function (id: string) {};

  let getForecasts = async function (
    author?: string,
    owner?: string,
    first = 25,
    skip = 0,
  ): Promise<Array<Forecast>> {
    const subgraphForecasts = await findForecasts(author, owner, first, skip);
    return subgraphForecasts.map((subgraphForecast: any) =>
      convertSubgraphForecastToForecast(subgraphForecast),
    );
  };

  return {
    postForecast,
    decryptForecast,
    getForecasts,
  };
}

function convertSubgraphForecastToForecast(subgraphForecast: any) {
  return new Forecast(
    subgraphForecast.id,
    subgraphForecast.author,
    subgraphForecast.owner,
  );
}
