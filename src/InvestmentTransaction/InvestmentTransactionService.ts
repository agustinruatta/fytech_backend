import { Injectable } from '@nestjs/common';
import { CreateInvestmentTransactionDTO } from './DTO/CreateInvestmentTransactionDTO';
import { UpdateInvestmentTransactionDTO } from './DTO/UpdateInvestmentTransactionDTO';

@Injectable()
export class InvestmentTransactionService {
  create(createTransactionDto: CreateInvestmentTransactionDTO) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateInvestmentTransactionDTO) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
