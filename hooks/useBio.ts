import Bio from 'classes/Bio';
import useBioContract from './contracts/useBioContract';
import useIpfs from './useIpfs';
import useSubgraph from './useSubgraph';

/**
 * Hook for work with bios.
 */
export default function useBio() {
  const { uploadJsonToIPFS, loadJsonFromIPFS } = useIpfs();
  const { findBios } = useSubgraph();
  const { setURI } = useBioContract();

  let editBio = async function (params: object) {
    // Upload data
    const { ipfsUrl: tokenUri } = await uploadJsonToIPFS(params);
    // Use contract
    await setURI(tokenUri);
  };

  let getBio = async function (owner: string): Promise<Bio | null> {
    const bios = await getBios(owner);
    return bios.length > 0 ? bios[0] : null;
  };

  let getBios = async function (
    owner?: string,
    first = 25,
    skip = 0,
  ): Promise<Array<Bio>> {
    const subgraphBios = await findBios(owner, first, skip);
    const bios = [];
    for (const subgraphBio of subgraphBios) {
      bios.push(
        new Bio(
          subgraphBio.id,
          subgraphBio.owner,
          subgraphBio.uri,
          await loadJsonFromIPFS(subgraphBio.uri),
        ),
      );
    }
    return bios;
  };

  return {
    editBio,
    getBio,
  };
}
