import GetCurrentMarketDataRequest from '../../../../src/MarketData/DTO/GetCurrentMarketDataRequest';
import { AvailableCurrenciesList } from '../../../../src/Money/AvailableCurrenciesList';

describe('GetCurrentMarketDataRequest', () => {
  describe('new', () => {
    it('should be defined', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrenciesList.ARS);

      expect(getCurrentMarketDataRequest).toBeDefined();
    });

    it('should set code using new()', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrenciesList.ARS);

      expect(getCurrentMarketDataRequest.code).toBe('AMZN');
    });

    it('should set currency using new', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrenciesList.ARS);

      expect(getCurrentMarketDataRequest.currency).toBe('ARS');
    });

    it('should modify code to uppercase in new', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('amzn', AvailableCurrenciesList.ARS);

      expect(getCurrentMarketDataRequest.code).toBe('AMZN');
    });

    it('should modify currency to uppercase when set', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', 'ars');
      expect(getCurrentMarketDataRequest.currency).toBe('ARS');
    });
  });
});
