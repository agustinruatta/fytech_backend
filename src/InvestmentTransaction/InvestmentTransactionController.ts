import { Controller, Post, Body } from '@nestjs/common';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';

@Controller('investment-transaction')
export class InvestmentTransactionController {
  constructor(
    private readonly transactionService: InvestmentTransactionService,
  ) {}

  @Post()
  create(@Body() createTransactionDto: CreateInvestmentTransactionDTO) {
    return this.transactionService.create(createTransactionDto);
  }
}
