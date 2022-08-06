/**
 * Class for forecast.
 */
export default class Forecast {
  id: string;
  author: string;
  owner: string;
  uri: string | null;

  constructor(id: string, author: string, owner: string, uri: string) {
    this.id = id;
    this.author = author;
    this.owner = owner;
    this.uri = uri;
  }
}
