import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataService } from './MarketDataService';

describe('MarketDataService', () => {
  let service: MarketDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MarketDataService],
    }).compile();

    service = module.get<MarketDataService>(MarketDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
