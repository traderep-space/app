import EarlyAdopterToken from 'classes/EarlyAdopterToken';
import useSubgraph from './useSubgraph';

/**
 * Hook for work with early adopter tokens.
 */
export default function useEarlyAdopterToken() {
  const { findEarlyAdopterTokens } = useSubgraph();

  let getEarlyAdopterToken = async function (
    owner: string,
  ): Promise<EarlyAdopterToken | null> {
    const tokens = await getEarlyAdopterTokens({ owner: owner });
    return tokens.length > 0 ? tokens[0] : null;
  };

  let getEarlyAdopterTokens = async function (args: {
    ids?: Array<string>;
    owner?: string;
    first?: number;
    skip?: number;
  }): Promise<Array<EarlyAdopterToken>> {
    const subgraphTokens = await findEarlyAdopterTokens(
      args.ids,
      args.owner,
      args.first || 25,
      args.skip || 0,
    );
    const tokens = [];
    for (const subgraphToken in subgraphTokens) {
      const token = await convertSubgraphTokenToToken(subgraphToken);
      tokens.push(token);
    }
    return tokens;
  };

  return {
    getEarlyAdopterToken,
    getEarlyAdopterTokens,
  };
}

async function convertSubgraphTokenToToken(subgraphToken: any) {
  // TODO: Load token uri using contract functions
  return new EarlyAdopterToken(subgraphToken.id, subgraphToken.owner, '', '');
}
