import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';
import AssetBalance from './AssetBalance';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';
import { MarketDataService } from '../MarketData/MarketDataService';
import GetCurrentMarketDataRequest from '../MarketData/DTO/GetCurrentMarketDataRequest';
import CurrentUserService from '../Auth/CurrentUserService';
import { Account } from '../Account/Entities/Account';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BuyInvestmentTransaction)
    private readonly buyInvestmentTransactionRepository: Repository<BuyInvestmentTransaction>,
    @InjectRepository(SellInvestmentTransaction)
    private readonly sellInvestmentTransactionRepository: Repository<SellInvestmentTransaction>,
    public readonly currentUserService: CurrentUserService,
    private readonly marketDataService: MarketDataService,
  ) {}

  async getAllAssetsBalance(
    currency: AvailableCurrencies,
  ): Promise<AssetBalance[]> {
    const amountOfInstruments = {};
    const currentAccount =
      await this.currentUserService.getCurrentAccountOrFail();

    await this.sumAllBuys(amountOfInstruments, currentAccount);
    await this.subtractAllSells(amountOfInstruments, currentAccount);

    return this.getAssetsBalance(amountOfInstruments, currency);
  }

  private async sumAllBuys(
    amountOfInstruments: object,
    currentAccount: Account,
  ) {
    const buyTransactions =
      await this.buyInvestmentTransactionRepository.findBy({
        account: {
          id: currentAccount.getId(),
        },
      });

    buyTransactions.forEach((buyTransaction) => {
      if (!amountOfInstruments[buyTransaction.getCode()]) {
        amountOfInstruments[buyTransaction.getCode()] = 0;
      }

      amountOfInstruments[buyTransaction.getCode()] +=
        buyTransaction.getAmount();
    });
  }

  private async subtractAllSells(
    amountOfInstruments: object,
    currentAccount: Account,
  ) {
    const sellTransactions =
      await this.sellInvestmentTransactionRepository.findBy({
        account: {
          id: currentAccount.getId(),
        },
      });

    sellTransactions.forEach(
      (buyTransaction) =>
        (amountOfInstruments[buyTransaction.getCode()] -=
          buyTransaction.getAmount()),
    );
  }

  private async getAssetsBalance(
    amountOfInstruments: object,
    currency: AvailableCurrencies,
  ) {
    const result: AssetBalance[] = [];

    for (const instrumentCode in amountOfInstruments) {
      const currentMarketData =
        await this.marketDataService.getCurrentMarketData(
          GetCurrentMarketDataRequest.new(instrumentCode, currency),
        );

      result.push({
        instrument_type: currentMarketData.getInstrumentType(),
        code: instrumentCode,
        amount: amountOfInstruments[instrumentCode],
        balance: currentMarketData
          .getMidPrice()
          .multiply(amountOfInstruments[instrumentCode])
          .serialize(),
      });
    }

    return result;
  }
}
