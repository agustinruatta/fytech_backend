import GetCurrentMarketDataRequest from '../../../../src/MarketData/DTO/GetCurrentMarketDataRequest';
import { AvailableCurrencies } from '../../../../src/Money/AvailableCurrencies';

describe('GetCurrentMarketDataRequest', () => {
  describe('new', () => {
    it('should be defined', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrencies.ARS);

      expect(getCurrentMarketDataRequest).toBeDefined();
    });

    it('should set code using new()', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrencies.ARS);

      expect(getCurrentMarketDataRequest.code).toBe('AMZN');
    });

    it('should set currency using new', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('AMZN', AvailableCurrencies.ARS);

      expect(getCurrentMarketDataRequest.currency).toBe('ARS');
    });

    it('should modify code to uppercase in new', () => {
      const getCurrentMarketDataRequest: GetCurrentMarketDataRequest =
        GetCurrentMarketDataRequest.new('amzn', AvailableCurrencies.ARS);

      expect(getCurrentMarketDataRequest.code).toBe('AMZN');
    });
  });
});
