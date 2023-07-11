import { Test } from '@nestjs/testing';
import ArgentinianCryptoPricesProvider from '../../../../src/MarketData/market_data_providers/ArgentinianCryptoPricesProvider';

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
});
