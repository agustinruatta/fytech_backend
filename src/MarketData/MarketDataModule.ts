import { Module } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { MarketDataController } from './MarketDataController';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService],
})
export class MarketDataModule {}
