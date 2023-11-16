import { PartialType } from '@nestjs/swagger';
import { CreateInvestmentTransactionDTO } from './CreateInvestmentTransactionDTO';

export class UpdateInvestmentTransactionDTO extends PartialType(CreateInvestmentTransactionDTO) {}
