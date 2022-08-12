import Forecast, { FORECAST_TYPE } from 'classes/Forecast';
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
  const { createWithUri, create, setUri, saveVerificationResults } =
    useForecastContract();

  let postPublicForecast = async function (symbol: string, params: object) {
    // Define uri data
    const uriData = {
      type: FORECAST_TYPE.public,
      symbol: symbol,
      params: params,
    };
    // Upload data
    const { ipfsUrl: tokenUri } = await uploadJsonToIPFS(uriData);
    // Use contract
    await createWithUri(tokenUri);
  };

  let postPrivateForecast = async function (symbol: string, params: object) {
    // Create forecast and get token id
    const createTransaction = await create();
    const createReceipt = await createTransaction.wait();
    const tokenId = BigNumber.from(
      createReceipt.events.find((event: any) => event.event === 'Transfer')
        .topics[3],
    ).toString();
    // Encrypt forecast params
    const paramsString = JSON.stringify(params);
    const { encryptedString: encryptedParamsString, encryptedSymmetricKey } =
      await encrypt(tokenId, paramsString);
    const encryptedParamsStringBase64 = await blobToBase64(
      encryptedParamsString,
    );
    // Define uri data
    const uriData = {
      type: FORECAST_TYPE.private,
      symbol: symbol,
      encryptedParamsStringBase64: encryptedParamsStringBase64,
      encryptedSymmetricKey: encryptedSymmetricKey,
    };
    // Upload data to
    const { ipfsUrl: tokenUri } = await uploadJsonToIPFS(uriData);
    // Use contract
    await setUri(tokenId, tokenUri);
  };

  let getForecastParams = async function (id: string) {
    // Load forecast
    const forecast = await getForecast(id);
    if (!forecast || !forecast.uri) {
      return null;
    }
    // Load uri data
    const forecastUriData = await loadJsonFromIPFS(forecast.uri);
    // Define forecast params
    let forecastParams = {};
    if (forecast.type === FORECAST_TYPE.public) {
      forecastParams = forecastUriData.params;
    }
    if (forecast.type === FORECAST_TYPE.private) {
      // Decrypt data for private forecast
      const encryptedString = await base64ToBlob(
        forecastUriData.encryptedParamsStringBase64,
      );
      const { decryptedString } = await decrypt(
        id,
        encryptedString,
        forecastUriData.encryptedSymmetricKey,
      );
      return JSON.parse(decryptedString);
    }
    return forecastParams;
  };

  let saveForecastVerificationResults = async function (
    ids: Array<string>,
    verificationResults: Array<boolean>,
  ) {
    return saveVerificationResults(ids, verificationResults);
  };

  let getForecast = async function (id: string) {
    const forecasts = await getForecasts({ ids: [id] });
    return forecasts.length > 0 ? forecasts[0] : null;
  };

  let getForecasts = async function (args: {
    ids?: Array<string>;
    author?: string;
    notAuthor?: string;
    owner?: string;
    type?: FORECAST_TYPE;
    isVerified?: boolean;
    first?: number;
    skip?: number;
  }): Promise<Array<Forecast>> {
    const subgraphForecasts = await findForecasts(
      args.ids,
      args.author,
      args.notAuthor,
      args.owner,
      args.type,
      args.isVerified,
      args.first || 25,
      args.skip || 0,
    );
    return subgraphForecasts.map((subgraphForecast: any) =>
      convertSubgraphForecastToForecast(subgraphForecast),
    );
  };

  return {
    postPublicForecast,
    postPrivateForecast,
    getForecastParams,
    saveForecastVerificationResults,
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
    subgraphForecast.symbol,
    subgraphForecast.type,
    subgraphForecast.isVerified,
    subgraphForecast.isTrue,
  );
}
