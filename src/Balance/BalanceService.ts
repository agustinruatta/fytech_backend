import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import BuyInvestmentTransaction from '../InvestmentTransaction/Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from '../InvestmentTransaction/Entities/SellInvestmentTransaction';
import { CurrentAccountService } from '../Auth/CurrentAccountService';
import AssetBalance from './AssetBalance';
import { AvailableCurrencies } from '../Money/AvailableCurrencies';
import { MarketDataService } from '../MarketData/MarketDataService';
import GetCurrentMarketDataRequest from '../MarketData/DTO/GetCurrentMarketDataRequest';

@Injectable()
export class BalanceService {
  constructor(
    @InjectRepository(BuyInvestmentTransaction)
    private readonly buyInvestmentTransactionRepository: Repository<BuyInvestmentTransaction>,
    @InjectRepository(SellInvestmentTransaction)
    private readonly sellInvestmentTransactionRepository: Repository<SellInvestmentTransaction>,
    public readonly currentAccountService: CurrentAccountService,
    private readonly marketDataService: MarketDataService,
  ) {}

  async getAllAssetsBalance(
    currency: AvailableCurrencies,
  ): Promise<AssetBalance[]> {
    const amountOfInstruments = {};

    await this.sumAllBuys(amountOfInstruments);
    await this.subtractAllSells(amountOfInstruments);

    return this.getAssetsBalance(amountOfInstruments, currency);
  }

  private async sumAllBuys(amountOfInstruments: object) {
    const buyTransactions =
      await this.buyInvestmentTransactionRepository.findBy({
        account: {
          id: this.currentAccountService.getCurrentAccountOrFail().getId(),
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

  private async subtractAllSells(amountOfInstruments: object) {
    const sellTransactions =
      await this.sellInvestmentTransactionRepository.findBy({
        account: {
          id: this.currentAccountService.getCurrentAccountOrFail().getId(),
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
        type: 'stock',
        code: instrumentCode,
        amount: amountOfInstruments[instrumentCode],
        balance: currentMarketData.getMidPrice().serialize(),
      });
    }

    return result;
  }
}
