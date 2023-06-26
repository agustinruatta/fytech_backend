import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketDataModule } from './MarketData/MarketDataModule';

@Module({
  imports: [MarketDataModule],
  controllers: [AppController],
})
export class AppModule {}
