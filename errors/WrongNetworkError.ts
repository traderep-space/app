/**
 * Error for wrong network.
 */
export default class WrongNetworkError extends Error {
  constructor() {
    super(`App only supports "${process.env.NEXT_PUBLIC_NETWORK_NAME}"`);
    this.name = 'WrongNetworkError';
  }
}
