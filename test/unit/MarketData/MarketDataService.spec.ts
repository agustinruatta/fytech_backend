import { MarketDataService } from '../../../src/MarketData/MarketDataService';
import { Test } from '@nestjs/testing';
import { MarketDataProvider } from '../../../src/MarketData/market_data_providers/MarketDataProvider';
import { GetCurrentMarketDataResponse } from '../../../src/MarketData/dto/GetCurrentMarketDataResponse';
import GetCurrentMarketDataRequest from '../../../src/MarketData/dto/GetCurrentMarketDataRequest';

describe('MarketDataService', () => {
  let marketDataService: MarketDataService;
  const now = new Date();

  const marketDataProvider: MarketDataProvider = {
    getCurrentMarketData(): Promise<GetCurrentMarketDataResponse> {
      return Promise.resolve(new GetCurrentMarketDataResponse(100, 100, now));
    },

    doesSupportCode(request: GetCurrentMarketDataRequest): boolean {
      return request.code === 'UVA_AR';
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
      new GetCurrentMarketDataRequest('UVA_AR'),
    );

    expect(response).toStrictEqual(
      new GetCurrentMarketDataResponse(100, 100, now),
    );
  });

  it('should thrown an error if code is not found', async () => {
    await expect(
      marketDataService.getCurrentMarketData(
        new GetCurrentMarketDataRequest('invalid_code'),
      ),
    ).rejects.toThrow(new Error('Invalid code'));
  });
});
