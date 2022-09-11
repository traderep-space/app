import axios from 'axios';

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  let findTraders = async function (
    ids?: Array<string>,
    first?: number,
    skip?: number,
  ) {
    const response = await makeSubgraphQuery(
      getFindTradersQuery(ids, first, skip),
    );
    return response.traders;
  };

  let findBios = async function (
    owner?: string,
    first?: number,
    skip?: number,
  ) {
    const response = await makeSubgraphQuery(
      getFindBiosQuery(owner, first, skip),
    );
    return response.bios;
  };

  let findForecasts = async function (
    ids?: Array<string>,
    author?: string,
    notAuthor?: string,
    owner?: string,
    type?: string,
    isVerified?: boolean,
    first?: number,
    skip?: number,
  ) {
    const response = await makeSubgraphQuery(
      getFindForecastsQuery(
        ids,
        author,
        notAuthor,
        owner,
        type,
        isVerified,
        first,
        skip,
      ),
    );
    return response.forecasts;
  };

  let findEarlyAdopterTokens = async function (
    ids?: Array<string>,
    owner?: string,
    first?: number,
    skip?: number,
  ) {
    const response = await makeSubgraphQuery(
      getFindEarlyAdopterTokensQuery(ids, owner, first, skip),
    );
    return response.earlyAdopterTokens;
  };

  return {
    findTraders,
    findBios,
    findForecasts,
    findEarlyAdopterTokens,
  };
}

async function makeSubgraphQuery(query: string) {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_SUBGRAPH_API || '',
      {
        query: query,
      },
    );
    if (response.data.errors) {
      throw new Error(
        `Error making subgraph query: ${JSON.stringify(response.data.errors)}`,
      );
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `Could not query the subgraph: ${JSON.stringify(error.message)}`,
    );
  }
}

function getFindTradersQuery(
  ids?: Array<string>,
  first?: number,
  skip?: number,
) {
  let idsFilter = ids
    ? `id_in: ["${ids.map((id) => id.toLowerCase()).join('","')}"]`
    : '';
  let filterParams = `where: {${idsFilter}}`;
  let sortParams = `orderBy: positiveReputation, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    traders(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      positiveReputation
      negativeReputation
    }
  }`;
}

function getFindBiosQuery(owner?: string, first?: number, skip?: number) {
  let ownerFilter = owner ? `owner: "${owner.toLowerCase()}"` : '';
  let filterParams = `where: {${ownerFilter}}`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    bios(${filterParams}, ${paginationParams}) {
      id
      owner
      uri
    }
  }`;
}

function getFindForecastsQuery(
  ids?: Array<string>,
  author?: string,
  notAuthor?: string,
  owner?: string,
  type?: string,
  isVerified?: boolean,
  first?: number,
  skip?: number,
) {
  let idsFilter = ids
    ? `id_in: ["${ids.map((id) => id.toLowerCase()).join('","')}"]`
    : '';
  let authorFilter = author ? `author: "${author.toLowerCase()}"` : '';
  let notAuthorFilter = notAuthor
    ? `author_not: "${notAuthor.toLowerCase()}"`
    : '';
  let ownerFilter = owner ? `owner: "${owner.toLowerCase()}"` : '';
  let typeFilter = type ? `type: "${type}"` : '';
  let isVerifiedFilter =
    isVerified !== undefined ? `isVerified: ${isVerified}` : '';
  let filterParams = `where: {${idsFilter}, ${authorFilter}, ${notAuthorFilter}, ${ownerFilter}, ${typeFilter}, ${isVerifiedFilter}}`;
  let sortParams = `orderBy: createdDate, orderDirection: desc`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    forecasts(${filterParams}, ${sortParams}, ${paginationParams}) {
      id
      createdDate
      author
      owner
      uri
      symbol
      type
      isVerified
      isTrue
    }
  }`;
}

function getFindEarlyAdopterTokensQuery(
  ids?: Array<string>,
  owner?: string,
  first?: number,
  skip?: number,
) {
  let idsFilter = ids
    ? `id_in: ["${ids.map((id) => id.toLowerCase()).join('","')}"]`
    : '';
  let ownerFilter = owner ? `owner: "${owner.toLowerCase()}"` : '';
  let filterParams = `where: {${idsFilter}, ${ownerFilter}}`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    earlyAdopterTokens(${filterParams},${paginationParams}) {
      id
      owner
    }
  }`;
}
