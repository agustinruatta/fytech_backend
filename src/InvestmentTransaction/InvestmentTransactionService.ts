import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { CurrentUserService } from '../Auth/CurrentUserService';

@Injectable()
export class InvestmentTransactionService {
  constructor(
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
    private readonly currentUserService: CurrentUserService,
  ) {}

  buy(createTransactionDto: CreateInvestmentTransactionDTO) {
    return 'This action buys a new transaction';
  }

  sell(createTransactionDto: CreateInvestmentTransactionDTO) {
    return 'This action sells a new transaction';
  }
}
