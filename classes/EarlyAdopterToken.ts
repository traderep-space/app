/**
 * Class for early adopter token.
 */
export default class EarlyAdopterToken {
  id: string;
  owner: string;

  constructor(id: string, owner: string) {
    this.id = id;
    this.owner = owner;
  }
}
