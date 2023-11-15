import { Injectable } from '@nestjs/common';
import AssetBalance from './AssetBalance';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';
import { MarketDataService } from '../MarketData/MarketDataService';
import GetCurrentMarketDataRequest from '../MarketData/DTO/GetCurrentMarketDataRequest';
import CurrentUserService from '../Auth/CurrentUserService';
import BalanceRepository from './BalanceRepository';

@Injectable()
export class BalanceService {
  constructor(
    public readonly currentUserService: CurrentUserService,
    private readonly marketDataService: MarketDataService,
    private readonly balanceRepository: BalanceRepository,
  ) {}

  async getAllAssetsBalance(
    currency: AvailableCurrencies,
  ): Promise<AssetBalance[]> {
    const instrumentTypeBalance =
      await this.balanceRepository.getAccountBalance(
        await this.currentUserService.getCurrentAccountOrFail(),
      );

    const balance = instrumentTypeBalance.map(async (instrumentData) => {
      const currentMarketData =
        await this.marketDataService.getCurrentMarketData(
          GetCurrentMarketDataRequest.new(instrumentData.code, currency),
        );

      return {
        instrument_type: currentMarketData.getInstrumentType(),
        code: instrumentData.code,
        amount: instrumentData.amount,
        balance: currentMarketData
          .getMidPrice()
          .multiply(instrumentData.amount)
          .serialize(),
      };
    });

    return Promise.all(balance);
  }
}
