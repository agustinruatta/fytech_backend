import { Module } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { MarketDataController } from './MarketDataController';
import { ConfigModule } from '@nestjs/config';
import { EstadisticasBCRAProvider } from './market_data_providers/EstadisticasBCRAProvider';
import { HttpModule } from '@nestjs/axios';
import { MarketDataProvider } from './market_data_providers/MarketDataProvider';

@Module({
  controllers: [MarketDataController],
  providers: [
    EstadisticasBCRAProvider,
    {
      provide: MarketDataService,
      useFactory: (...params: MarketDataProvider[]) => {
        console.log(params);
        return new MarketDataService(params);
      },
      inject: [EstadisticasBCRAProvider],
    },
  ],
  imports: [ConfigModule.forRoot(), HttpModule],
})
export class MarketDataModule {}
