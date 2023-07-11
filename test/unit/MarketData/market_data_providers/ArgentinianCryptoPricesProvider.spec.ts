import { Test } from '@nestjs/testing';
import ArgentinianCryptoPricesProvider from '../../../../src/MarketData/market_data_providers/ArgentinianCryptoPricesProvider';
import GetCurrentMarketDataRequest from '../../../../src/MarketData/dto/GetCurrentMarketDataRequest';

describe('ArgentinianCryptoPricesProvider', () => {
  let argentinianCryptoPricesProvider: ArgentinianCryptoPricesProvider;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ArgentinianCryptoPricesProvider],
    }).compile();

    argentinianCryptoPricesProvider =
      moduleRef.get<ArgentinianCryptoPricesProvider>(
        ArgentinianCryptoPricesProvider,
      );
  });

  it('should be defined', () => {
    expect(argentinianCryptoPricesProvider).toBeDefined();
  });

  it('should not support if currency is not ARS', () => {
    expect(
      argentinianCryptoPricesProvider.doesSupportCode(
        GetCurrentMarketDataRequest.new('USDC').withCurrency('BRL'),
      ),
    ).toBe(false);
  });

  it('should not support if code is not a crypto', () => {
    expect(
      argentinianCryptoPricesProvider.doesSupportCode(
        GetCurrentMarketDataRequest.new('AMZN').withCurrency('USD'),
      ),
    ).toBe(false);
  });

  it('should support if code is crypto and currency is ARS', () => {
    expect(
      argentinianCryptoPricesProvider.doesSupportCode(
        GetCurrentMarketDataRequest.new('USDC').withCurrency('ARS'),
      ),
    ).toBe(true);
  });
});
