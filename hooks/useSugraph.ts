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

  let findForecasts = async function (
    author?: string,
    owner?: string,
    first?: number,
    skip?: number,
  ) {
    const response = await makeSubgraphQuery(
      getFindForecastQuery(author, owner, first, skip),
    );
    return response.forecasts;
  };

  return {
    findTraders,
    findForecasts,
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

function getFindForecastQuery(
  author?: string,
  owner?: string,
  first?: number,
  skip?: number,
) {
  let authorFilter = author ? `author: "${author.toLowerCase()}"` : '';
  let ownerFilter = owner ? `owner: "${owner.toLowerCase()}"` : '';
  let filterParams = `where: {${authorFilter}, ${ownerFilter}}`;
  let paginationParams = `first: ${first}, skip: ${skip}`;
  return `{
    forecasts(${filterParams}, ${paginationParams}) {
      id
      author
      owner
    }
  }`;
}
