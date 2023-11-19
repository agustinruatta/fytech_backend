import { PortfolioPersonalInstrumentTypes } from '../../../../../src/MarketData/MarketDataProviders/PortfolioPersonal/PortfolioPersonalInstrumentTypes';
import { InstrumentTypes } from '../../../../../src/MarketData/InstrumentTypes';

describe('PortfolioPersonalInstrumentTypes', () => {
  describe('mapToInstrumentTypes', () => {
    it('maps ACCIONES', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes.ACCIONES,
        ),
      ).toBe(InstrumentTypes.STOCK);
    });

    it('maps ACCIONES-USA', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes['ACCIONES-USA'],
        ),
      ).toBe(InstrumentTypes.STOCK);
    });

    it('maps BONOS', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes.BONOS,
        ),
      ).toBe(InstrumentTypes.BONDS);
    });

    it('maps CEDEARS', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes.CEDEARS,
        ),
      ).toBe(InstrumentTypes.CEDEARS);
    });

    it('maps OBLIGACIONES-NEGOCIABLES', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes['OBLIGACIONES-NEGOCIABLES'],
        ),
      ).toBe(InstrumentTypes.CORPORATE_BONDS);
    });

    it('maps OPCIONES', () => {
      expect(
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes(
          PortfolioPersonalInstrumentTypes.OPCIONES,
        ),
      ).toBe(InstrumentTypes.OPTIONS);
    });

    it('maps unknown instrument type', async () => {
      await expect(async () =>
        PortfolioPersonalInstrumentTypes.mapToInstrumentTypes('unknown'),
      ).rejects.toThrow(new Error('PPI instrument type not found: unknown'));
    });
  });
});
