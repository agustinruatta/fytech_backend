import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';

@Injectable()
export class InvestmentTransactionService {
  constructor(
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
  ) {}

  create(createTransactionDto: CreateInvestmentTransactionDTO) {
    return 'This action adds a new transaction';
  }
}
