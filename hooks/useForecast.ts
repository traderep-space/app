import Forecast from 'classes/Forecast';
import useForecastContract from './contracts/useForecastContract';
import useSubgraph from './useSugraph';

/**
 * Hook for work with forecasts.
 */
export default function useForecast() {
  const { findForecasts } = useSubgraph();
  const { post } = useForecastContract();

  let postForecast = async function (tokenUri: string) {
    return post(tokenUri);
  };

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
