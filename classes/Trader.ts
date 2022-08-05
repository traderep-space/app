/**
 * Class for trader.
 */
export default class Trader {
  id: string;
  positiveReputation: string;
  negativeReputation: string;

  constructor(
    id: string,
    positiveReputation: string,
    negativeReputation: string,
  ) {
    this.id = id;
    this.positiveReputation = positiveReputation;
    this.negativeReputation = negativeReputation;
  }
}
