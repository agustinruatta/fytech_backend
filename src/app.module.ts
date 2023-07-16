import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketDataModule } from './MarketData/MarketDataModule';
import { SharedModule } from './Shared/SharedModule';

@Module({
  imports: [MarketDataModule, SharedModule],
  controllers: [AppController],
})
export class AppModule {}
