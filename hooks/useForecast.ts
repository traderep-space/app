import Forecast from 'classes/Forecast';
import { BigNumber } from 'ethers';
import { base64ToBlob, blobToBase64 } from 'utils/converters';
import useForecastContract from './contracts/useForecastContract';
import useIpfs from './useIpfs';
import useLitProtocol from './useLitProtocol';
import useSubgraph from './useSubgraph';

/**
 * Hook for work with forecasts.
 */
export default function useForecast() {
  const { findForecasts } = useSubgraph();
  const { uploadJsonToIPFS, loadJsonFromIPFS } = useIpfs();
  const { encrypt, decrypt } = useLitProtocol();
  const { create, setUri, verify } = useForecastContract();

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
    const encryptedStringBase64 = await blobToBase64(encryptedString);
    const { ipfsUrl: tokenUri } = await uploadJsonToIPFS({
      encryptedStringBase64: encryptedStringBase64,
      encryptedSymmetricKey: encryptedSymmetricKey,
    });
    // Set token uri
    await setUri(tokenId, tokenUri);
  };

  let getForecastDetails = async function (id: string) {
    // Load forecast
    const forecast = await getForecast(id);
    if (!forecast || !forecast.uri) {
      return null;
    }
    // Load uri data
    const forecastUriData = await loadJsonFromIPFS(forecast.uri);
    // Decrypt data
    const encryptedString = await base64ToBlob(
      forecastUriData.encryptedStringBase64,
    );
    const { decryptedString } = await decrypt(
      id,
      encryptedString,
      forecastUriData.encryptedSymmetricKey,
    );
    return JSON.parse(decryptedString);
  };

  let verifyForecast = async function (id: string) {
    return verify(id);
  };

  let getForecast = async function (id: string) {
    const forecasts = await getForecasts([id]);
    return forecasts.length > 0 ? forecasts[0] : null;
  };

  let getForecasts = async function (
    ids?: Array<string>,
    author?: string,
    owner?: string,
    first = 25,
    skip = 0,
  ): Promise<Array<Forecast>> {
    const subgraphForecasts = await findForecasts(
      ids,
      author,
      owner,
      first,
      skip,
    );
    return subgraphForecasts.map((subgraphForecast: any) =>
      convertSubgraphForecastToForecast(subgraphForecast),
    );
  };

  return {
    postForecast,
    getForecastDetails,
    verifyForecast,
    getForecast,
    getForecasts,
  };
}

function convertSubgraphForecastToForecast(subgraphForecast: any) {
  return new Forecast(
    subgraphForecast.id,
    subgraphForecast.createdDate,
    subgraphForecast.author,
    subgraphForecast.owner,
    subgraphForecast.uri,
    subgraphForecast.isVerified,
    subgraphForecast.isTrue,
  );
}
