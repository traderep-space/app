import axios from 'axios';
import { create } from 'ipfs-http-client';
import { Web3Storage } from 'web3.storage';

/**
 * Hook for work with IPFS.
 */
export default function useIpfs() {
  const ipfsUrlPrefix = 'ipfs://';
  const web3Storage = new Web3Storage({
    token: process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY || '',
    endpoint: new URL('https://api.web3.storage'),
  });
  const theGraphClient = create({
    url: process.env.NEXT_PUBLIC_THE_GRAPH_IPFS_API,
  });

  let uploadFileToIPFS = async function (file: any) {
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const ipfsUrl = `${ipfsUrlPrefix}${cid}`;
    return { cid, ipfsUrl };
  };

  let uploadJsonToIPFS = async function (json: object) {
    // Upload to the graph for usage in graph queries
    await theGraphClient.add(JSON.stringify(json));
    // Upload to the web3 storage
    const file = new File([JSON.stringify(json)], '', {
      type: 'text/plain',
    });
    const cid = await web3Storage.put([file], { wrapWithDirectory: false });
    const ipfsUrl = `${ipfsUrlPrefix}${cid}`;
    return { cid, ipfsUrl };
  };

  let loadJsonFromIPFS = async function (ipfsUrl: string) {
    const response = await axios.get(ipfsUrlToHttpUrl(ipfsUrl));
    if (response.data.errors) {
      throw new Error(
        `Fail to loading json from IPFS: ${response.data.errors}`,
      );
    }
    return response.data;
  };

  let ipfsUrlToHttpUrl = function (ipfsUrl: string): string {
    if (!ipfsUrl || !ipfsUrl.startsWith(ipfsUrlPrefix)) {
      throw new Error(`Fail to converting IPFS URL to HTTP URL: ${ipfsUrl}`);
    }
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  };

  return {
    uploadFileToIPFS,
    uploadJsonToIPFS,
    loadJsonFromIPFS,
    ipfsUrlToHttpUrl,
  };
}
