import { MarketDataService } from './MarketDataService';

describe('MarketDataService', () => {
  let service: MarketDataService;

  beforeEach(async () => {
    service = new MarketDataService([]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
