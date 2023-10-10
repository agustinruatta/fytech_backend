import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestmentTransaction } from './Entities/InvestmentTransaction';
import { CurrentUserService } from '../Auth/CurrentUserService';
import { InvalidArgumentException } from '../Shared/Exceptions/InvalidArgumentException';

@Injectable()
export class InvestmentTransactionService {
  constructor(
    @InjectRepository(InvestmentTransaction)
    private readonly investmentTransactionRepository: Repository<InvestmentTransaction>,
    private readonly currentUserService: CurrentUserService,
  ) {}

  buy(createTransactionDto: CreateInvestmentTransactionDTO) {
    throw new InvalidArgumentException(
      'Account id ' + createTransactionDto.accountId + 'not found',
      "You don't have permissions to use sent account id",
    );
  }

  sell(createTransactionDto: CreateInvestmentTransactionDTO) {
    throw new InvalidArgumentException(
      'Account id ' + createTransactionDto.accountId + 'not found',
      "You don't have permissions to use sent account id",
    );
  }
}
