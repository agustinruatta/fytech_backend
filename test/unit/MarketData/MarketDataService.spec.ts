import { MarketDataService } from '../../../src/MarketData/MarketDataService';
import { Test } from '@nestjs/testing';
import { MarketDataProvider } from '../../../src/MarketData/MarketDataProviders/MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../../../src/MarketData/DTO/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../../../src/MarketData/DTO/GetCurrentMarketDataRequest';
import { AvailableCurrencies } from '../../../src/Money/AvailableCurrencies';
import { InstrumentTypes } from '../../../src/MarketData/InstrumentTypes';
import InstrumentNotFoundException from '../../../src/Shared/Exceptions/InstrumentNotFoundException';

describe('MarketDataService', () => {
  let marketDataService: MarketDataService;
  const now = new Date();

  const marketDataProvider: MarketDataProvider = {
    getCurrentMarketData(): Promise<GetCurrentMarketDataResponse> {
      return Promise.resolve(
        GetCurrentMarketDataResponse.newWithValue(
          100,
          InstrumentTypes.CRYPTO,
          now,
        ),
      );
    },

    doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
      return request.code === 'USDC';
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: MarketDataService,
          useFactory: () => {
            return new MarketDataService([marketDataProvider]);
          },
        },
      ],
    }).compile();

    marketDataService = moduleRef.get<MarketDataService>(MarketDataService);
  });

  it('should be defined', () => {
    expect(marketDataService).toBeDefined();
  });

  it('should return correct value if code exists', async () => {
    const response = await marketDataService.getCurrentMarketData(
      GetCurrentMarketDataRequest.new('USDC', AvailableCurrencies.ARS),
    );

    expect(response).toStrictEqual(
      GetCurrentMarketDataResponse.newWithValue(
        100,
        InstrumentTypes.CRYPTO,
        now,
      ),
    );
  });

  it('should thrown an error if code is not found', async () => {
    await expect(
      marketDataService.getCurrentMarketData(
        GetCurrentMarketDataRequest.new(
          'invalid_code',
          AvailableCurrencies.ARS,
        ),
      ),
    ).rejects.toThrow(
      new InstrumentNotFoundException('INVALID_CODE', AvailableCurrencies.ARS),
    );
  });
});
