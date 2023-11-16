import { Controller, Post, Body } from '@nestjs/common';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import BuyInvestmentTransaction from './Entities/BuyInvestmentTransaction';
import SellInvestmentTransaction from './Entities/SellInvestmentTransaction';

@Controller('investment-transaction')
export class InvestmentTransactionController {
  constructor(
    private readonly transactionService: InvestmentTransactionService,
  ) {}

  @Post('/buy')
  buy(
    @Body() createTransactionDto: CreateInvestmentTransactionDTO,
  ): Promise<BuyInvestmentTransaction> {
    return this.transactionService.buy(createTransactionDto);
  }

  @Post('/sell')
  sell(
    @Body() createTransactionDto: CreateInvestmentTransactionDTO,
  ): Promise<SellInvestmentTransaction> {
    return this.transactionService.sell(createTransactionDto);
  }
}
