import { Module } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { MarketDataController } from './MarketDataController';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [MarketDataController],
  providers: [MarketDataService],
  imports: [ConfigModule.forRoot()],
})
export class MarketDataModule {}
