import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { User } from '../../Users/Entities/User';
import { Account } from '../../Account/Entities/Account';
import { InvestmentTransaction } from '../../InvestmentTransaction/Entities/InvestmentTransaction';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get('DB_URL'),
    entities: [User, Account, InvestmentTransaction],
    entitySkipConstructor: true,
    synchronize: false,
  }),
};
