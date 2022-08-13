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
    const cid = ipfsUrlToCid(ipfsUrl);
    const httpUrl = cidToHttpUrl(cid);
    const response = await axios.get(httpUrl);
    if (response.data.errors) {
      throw new Error(
        `Fail to loading json from IPFS: ${response.data.errors}`,
      );
    }
    return response.data;
  };

  /**
   * Convert url like "ipfs://baf..." to cid "baf...".
   */
  let ipfsUrlToCid = function (ipfsUrl: string): string {
    if (!ipfsUrl.startsWith(ipfsUrlPrefix)) {
      throw new Error(`Fail to converting url to cid for url: ${ipfsUrl}`);
    }
    return ipfsUrl.replace(ipfsUrlPrefix, '');
  };

  /**
   * Convert cid like "baf..." to http url.
   */
  let cidToHttpUrl = function (cid: string): string {
    return `https://${cid}.ipfs.dweb.link`;
  };

  let ipfsUrlToHttpUrl = function (ipfsUrl: string): string {
    if (!ipfsUrl) {
      return '';
    }
    return cidToHttpUrl(ipfsUrlToCid(ipfsUrl));
  };

  return {
    uploadFileToIPFS,
    uploadJsonToIPFS,
    loadJsonFromIPFS,
    ipfsUrlToCid,
    cidToHttpUrl,
    ipfsUrlToHttpUrl,
  };
}
