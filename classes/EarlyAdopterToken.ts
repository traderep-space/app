/**
 * Class for early adopter token.
 */
export default class EarlyAdopterToken {
  id: string;
  owner: string;
  uri: string | null;
  uriData: any;

  constructor(id: string, owner: string, uri: string | null, uriData: any) {
    this.id = id;
    this.owner = owner;
    this.uri = uri;
    this.uriData = uriData;
  }
}
