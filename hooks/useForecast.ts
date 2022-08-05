import Forecast from 'classes/Forecast';
import useSubgraph from './useSugraph';

/**
 * Hook for work with forecasts.
 */
export default function useForecast() {
  const { findForecasts } = useSubgraph();

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
