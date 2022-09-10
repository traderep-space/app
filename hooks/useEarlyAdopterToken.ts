import EarlyAdopterToken from 'classes/EarlyAdopterToken';
import useEarlyAdopterTokenContract from './contracts/useEarlyAdopterTokenContract';
import useIpfs from './useIpfs';
import useSubgraph from './useSubgraph';

/**
 * Hook for work with early adopter tokens.
 */
export default function useEarlyAdopterToken() {
  const { getTokenUri } = useEarlyAdopterTokenContract();
  const { findEarlyAdopterTokens } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();

  let getEarlyAdopterToken = async function (
    owner: string,
  ): Promise<EarlyAdopterToken | null> {
    const tokens = await getEarlyAdopterTokens({ owner: owner });
    return tokens.length > 0 ? tokens[0] : null;
  };

  let getEarlyAdopterTokenUriData = async function (id: string): Promise<any> {
    return await loadJsonFromIPFS(await getTokenUri(id));
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
    for (const subgraphToken of subgraphTokens) {
      tokens.push(new EarlyAdopterToken(subgraphToken.id, subgraphToken.owner));
    }
    return tokens;
  };

  return {
    getEarlyAdopterToken,
    getEarlyAdopterTokenUriData,
    getEarlyAdopterTokens,
  };
}
