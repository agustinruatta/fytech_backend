import { PortfolioPersonalCurrencies } from '../../../../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortofolioPersonalCurrencies';
import { AvailableCurrencies } from '../../../../../src/Money/AvailableCurrencies';

describe('PortfolioPersonalCurrencies', () => {
  describe('mapToAvailableCurrencies', () => {
    it('maps Pesos', () => {
      expect(
        PortfolioPersonalCurrencies.mapToAvailableCurrencies(
          PortfolioPersonalCurrencies.Pesos,
        ),
      ).toBe(AvailableCurrencies.ARS);
    });

    it('maps Dolares divisa | CCL', () => {
      expect(
        PortfolioPersonalCurrencies.mapToAvailableCurrencies(
          PortfolioPersonalCurrencies['Dolares divisa | CCL'],
        ),
      ).toBe(AvailableCurrencies.USD_CCL);
    });

    it('maps Dolares billete | MEP', () => {
      expect(
        PortfolioPersonalCurrencies.mapToAvailableCurrencies(
          PortfolioPersonalCurrencies['Dolares billete | MEP'],
        ),
      ).toBe(AvailableCurrencies.USD_MEP);
    });

    it('maps unknown currency', async () => {
      await expect(async () =>
        PortfolioPersonalCurrencies.mapToAvailableCurrencies('unknown'),
      ).rejects.toThrow(new Error('PPI currency not found: unknown'));
    });
  });
});
