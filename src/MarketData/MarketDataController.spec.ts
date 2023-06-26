import { Test, TestingModule } from '@nestjs/testing';
import { MarketDataController } from './MarketDataController';
import { MarketDataService } from './MarketDataService';

describe('MarketDataController', () => {
  let controller: MarketDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MarketDataController],
      providers: [MarketDataService],
    }).compile();

    controller = module.get<MarketDataController>(MarketDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
