import { Controller, Post, Body } from '@nestjs/common';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';

@Controller('investment-transaction')
export class InvestmentTransactionController {
  constructor(
    private readonly transactionService: InvestmentTransactionService,
  ) {}

  @Post('/buy')
  buy(@Body() createTransactionDto: CreateInvestmentTransactionDTO) {
    return this.transactionService.create(createTransactionDto);
  }

  @Post('/sell')
  sell(@Body() createTransactionDto: CreateInvestmentTransactionDTO) {
    return this.transactionService.create(createTransactionDto);
  }
}
