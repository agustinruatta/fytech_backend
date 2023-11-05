export default interface AssetBalance {
  type: 'stock' | 'crypto';
  code: string;
  amount: number;
  balance: {
    currency: string;
    floatValue: number;
  };
}
