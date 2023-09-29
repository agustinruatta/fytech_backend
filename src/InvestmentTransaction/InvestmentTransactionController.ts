import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InvestmentTransactionService } from './InvestmentTransactionService';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { UpdateInvestmentTransactionDTO } from './DTO/UpdateInvestmentTransactionDTO';

@Controller('transaction')
export class InvestmentTransactionController {
  constructor(private readonly transactionService: InvestmentTransactionService) {}

  @Post()
  create(@Body() createTransactionDto: CreateInvestmentTransactionDTO) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateInvestmentTransactionDTO,
  ) {
    return this.transactionService.update(+id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
