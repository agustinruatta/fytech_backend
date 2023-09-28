import { PartialType } from '@nestjs/swagger';
import { CreateTransactionDTO } from './CreateTransactionDTO';

export class UpdateTransactionDTO extends PartialType(CreateTransactionDTO) {}
