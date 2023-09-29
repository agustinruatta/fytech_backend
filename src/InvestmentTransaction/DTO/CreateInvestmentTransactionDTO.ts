import { IsNotEmpty, ValidateNested, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import Money from '../../Money/Money';
import { Type } from 'class-transformer';

export class CreateInvestmentTransactionDTO {
  @IsNotEmpty()
  @ApiProperty()
  readonly accountId: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly code: string;

  @IsNotEmpty()
  @ApiProperty()
  readonly amount: number;

  @IsNotEmpty()
  @ApiProperty()
  @ValidateNested()
  @Type(() => Money)
  private money: Money;

  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  private readonly datetime: Date;
}
