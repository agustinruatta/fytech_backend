import Money from '../Money/Money';

export interface InstrumentBalance {
  code: string;
  amount: number;
  balance: Money;
}
