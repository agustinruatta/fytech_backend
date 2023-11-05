import { AvailableCurrencies } from '../Money/AvailableCurrencies';

export default interface AssetBalance {
  type: 'stock' | 'crypto';
  code: string;
  amount: number;
  balance: {
    cents: number;
    currency: AvailableCurrencies;
    floatValue: number;
  };
}
