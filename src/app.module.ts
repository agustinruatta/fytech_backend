import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarketDataModule } from './MarketData/MarketDataModule';
import { SharedModule } from './Shared/SharedModule';
import { AuthModule } from './Auth/AuthModule';
import { UsersModule } from './Users/UsersModule';
import { typeOrmAsyncConfig } from './Shared/Database/TypeORMConfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MarketDataModule,
    SharedModule,
    AuthModule,
    UsersModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
  ],
  controllers: [AppController],
})
export class AppModule {}
