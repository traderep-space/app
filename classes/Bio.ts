/**
 * Class for bio.
 */
export default class Bio {
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
