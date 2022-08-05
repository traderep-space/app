/**
 * Class for forecast.
 */
export default class Forecast {
  id: string;
  author: string;
  owner: string;

  constructor(id: string, author: string, owner: string) {
    this.id = id;
    this.author = author;
    this.owner = owner;
  }
}
