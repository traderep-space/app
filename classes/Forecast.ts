export enum FORECAST_TYPE {
  public = 'public',
  private = 'private',
}

/**
 * Class for forecast.
 */
export default class Forecast {
  id: string;
  createdDate: string;
  author: string;
  owner: string;
  uri: string | null;
  symbol: string | null;
  type: FORECAST_TYPE | null;
  isVerified: boolean | null;
  isTrue: boolean | null;

  constructor(
    id: string,
    createdDate: string,
    author: string,
    owner: string,
    uri: string | null,
    symbol: string | null,
    type: FORECAST_TYPE | null,
    isVerified: boolean | null,
    isTrue: boolean | null,
  ) {
    this.id = id;
    this.createdDate = createdDate;
    this.author = author;
    this.owner = owner;
    this.uri = uri;
    this.symbol = symbol;
    this.type = type;
    this.isVerified = isVerified;
    this.isTrue = isTrue;
  }
}
