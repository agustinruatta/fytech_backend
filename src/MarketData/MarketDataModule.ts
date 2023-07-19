import { Module } from '@nestjs/common';
import { MarketDataService } from './MarketDataService';
import { MarketDataController } from './MarketDataController';
import { ConfigModule } from '@nestjs/config';
import { EstadisticasBCRAProvider } from './MarketDataProviders/EstadisticasBCRAProvider';
import { HttpModule } from '@nestjs/axios';
import { MarketDataProvider } from './MarketDataProviders/MarketDataProvider';
import ArgentinianCryptoPricesProvider from './MarketDataProviders/ArgentinianCryptoPricesProvider';

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
