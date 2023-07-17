import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketDataModule } from './MarketData/MarketDataModule';
import { SharedModule } from './Shared/SharedModule';
import { AuthModule } from './Auth/AuthModule';
import { UsersModule } from './Users/UsersModule';

@Module({
  imports: [MarketDataModule, SharedModule, AuthModule, UsersModule],
  controllers: [AppController],
})
export class AppModule {}
