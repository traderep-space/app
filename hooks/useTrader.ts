import Trader from 'classes/Trader';
import useSubgraph from './useSubgraph';

/**
 * Hook for work with traders.
 */
export default function useTrader() {
  const { findTraders } = useSubgraph();

  let getTrader = async function (id: string): Promise<Trader | null> {
    const traders = await getTraders([id]);
    return traders.length > 0 ? traders[0] : null;
  };

  let getTraders = async function (
    ids?: Array<string>,
    first = 25,
    skip = 0,
  ): Promise<Array<Trader>> {
    const subgraphTraders = await findTraders(ids, first, skip);
    return subgraphTraders.map((subgraphTrader: any) =>
      convertSubgraphTraderToTrader(subgraphTrader),
    );
  };

  return {
    getTrader,
    getTraders,
  };
}

function convertSubgraphTraderToTrader(subgraphTrader: any) {
  return new Trader(
    subgraphTrader.id,
    subgraphTrader.positiveReputation,
    subgraphTrader.negativeReputation,
  );
}
