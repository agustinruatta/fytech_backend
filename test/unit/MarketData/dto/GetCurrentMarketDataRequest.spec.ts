import GetCurrentMarketDataRequest from '../../../../src/MarketData/dto/GetCurrentMarketDataRequest';

describe('GetCurrentMarketDataRequest', () => {
  it('should be defined', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest();

    expect(getCurrentMarketDataRequest).toBeDefined();
  });

  it('should return currency', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest();

    getCurrentMarketDataRequest.currency = 'ARS';
    expect(getCurrentMarketDataRequest.currency).toBe('ARS');
  });

  it('should modify currency to uppercase when set', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest();

    getCurrentMarketDataRequest.currency = 'ars';
    expect(getCurrentMarketDataRequest.currency).toBe('ARS');
  });

  it('should not fail if currency is undefined when set', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest();

    getCurrentMarketDataRequest.currency = undefined;
    expect(getCurrentMarketDataRequest.currency).toBe(undefined);
  });

  it('allows to set undefined again', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest();

    getCurrentMarketDataRequest.currency = 'ars';
    getCurrentMarketDataRequest.currency = undefined;

    expect(getCurrentMarketDataRequest.currency).toBe(undefined);
  });
});
