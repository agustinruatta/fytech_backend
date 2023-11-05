import { Test } from '@nestjs/testing';
import ArgentinianCryptoPricesProvider from '../../../../src/MarketData/MarketDataProviders/ArgentinianCryptoPricesProvider';
import GetCurrentMarketDataRequest from '../../../../src/MarketData/DTO/GetCurrentMarketDataRequest';
import { HttpService } from '@nestjs/axios';
import { GetCurrentMarketDataResponse } from '../../../../src/MarketData/DTO/GetCurrentMarketDataResponse';
import Money from '../../../../src/Money/Money';
import { AvailableCurrencies } from '../../../../src/Money/AvailableCurrencies';

describe('ArgentinianCryptoPricesProvider', () => {
  let argentinianCryptoPricesProvider: ArgentinianCryptoPricesProvider;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ArgentinianCryptoPricesProvider,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(() =>
                Promise.resolve({
                  data: {
                    ask: 534.02,
                    totalAsk: 539.3602,
                    bid: 511.43,
                    totalBid: 506.3157,
                    time: 1689195600,
                  },
                }),
              ),
            },
          },
        },
      ],
    }).compile();

    argentinianCryptoPricesProvider = new ArgentinianCryptoPricesProvider(
      moduleRef.get<HttpService>(HttpService),
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
        GetCurrentMarketDataRequest.new('USDC').withCurrency(
          AvailableCurrencies.ARS,
        ),
      ),
    ).toBe(true);
  });

  it('should return USDC price', async () => {
    expect(
      await argentinianCryptoPricesProvider.getCurrentMarketData(
        GetCurrentMarketDataRequest.new('USDC').withCurrency(
          AvailableCurrencies.ARS,
        ),
      ),
    ).toStrictEqual(
      GetCurrentMarketDataResponse.newWithMoney(
        Money.newFromString('539.3602', AvailableCurrencies.ARS),
        Money.newFromString('506.3157', AvailableCurrencies.ARS),
        new Date('2023-07-12 21:00:00Z'),
      ),
    );
  });
});
