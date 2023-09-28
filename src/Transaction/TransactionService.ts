import { Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './DTO/CreateTransactionDTO';
import { UpdateTransactionDTO } from './DTO/UpdateTransactionDTO';

@Injectable()
export class TransactionService {
  create(createTransactionDto: CreateTransactionDTO) {
    return 'This action adds a new transaction';
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDTO) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
