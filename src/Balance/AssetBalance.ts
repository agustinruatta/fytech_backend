export default interface AssetBalance {
  type: 'stock' | 'crypto';
  code: string;
  amount: number;
  //TODO: set a better type
  balance: object;
}
