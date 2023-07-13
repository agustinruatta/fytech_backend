import { Module } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { MarketDataController } from './MarketDataController';
import { ConfigModule } from '@nestjs/config';
import { EstadisticasBCRAProvider } from './market_data_providers/EstadisticasBCRAProvider';
import { HttpModule } from '@nestjs/axios';
import { MarketDataProvider } from './market_data_providers/MarketDataProvider';
import ArgentinianCryptoPricesProvider from './market_data_providers/ArgentinianCryptoPricesProvider';

@Module({
  controllers: [MarketDataController],
  providers: [
    ArgentinianCryptoPricesProvider,
    EstadisticasBCRAProvider,
    {
      provide: MarketDataService,
      useFactory: (...params: MarketDataProvider[]) => {
        return new MarketDataService(params);
      },
      inject: [ArgentinianCryptoPricesProvider, EstadisticasBCRAProvider],
    },
  ],
  imports: [ConfigModule.forRoot(), HttpModule],
})
export class MarketDataModule {}
