import GetCurrentMarketDataRequest from '../../../../src/MarketData/dto/GetCurrentMarketDataRequest';

describe('GetCurrentMarketDataRequest', () => {
  it('should be defined', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    expect(getCurrentMarketDataRequest).toBeDefined();
  });

  it('should set code in constructor', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    expect(getCurrentMarketDataRequest.code).toBe('UVA_AR');
  });

  it('should modify code to uppercase in constructor', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('uva_ar');

    expect(getCurrentMarketDataRequest.code).toBe('UVA_AR');
  });

  it('should return currency', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    getCurrentMarketDataRequest.currency = 'ARS';
    expect(getCurrentMarketDataRequest.currency).toBe('ARS');
  });

  it('should modify currency to uppercase when set', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    getCurrentMarketDataRequest.currency = 'ars';
    expect(getCurrentMarketDataRequest.currency).toBe('ARS');
  });

  it('should not fail if currency is undefined when set', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    getCurrentMarketDataRequest.currency = undefined;
    expect(getCurrentMarketDataRequest.currency).toBe(undefined);
  });

  it('allows to set undefined again', () => {
    const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
      new GetCurrentMarketDataRequest('UVA_AR');

    getCurrentMarketDataRequest.currency = 'ars';
    getCurrentMarketDataRequest.currency = undefined;

    expect(getCurrentMarketDataRequest.currency).toBe(undefined);
  });
});
