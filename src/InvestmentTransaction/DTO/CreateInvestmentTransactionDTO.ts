import { IsNotEmpty, ValidateNested, IsDate, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AvailableCurrencies } from '../../Money/AvailableCurrencies';

class Money {
  @IsNotEmpty()
  @ApiProperty()
  amount: string;

  @IsNotEmpty()
  @IsEnum(AvailableCurrencies)
  @ApiProperty()
  currency: AvailableCurrencies;
}

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
  public readonly money: Money;

  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  @ApiProperty()
  readonly datetime: Date;
}
