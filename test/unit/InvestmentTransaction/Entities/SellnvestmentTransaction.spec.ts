import SellInvestmentTransaction from '../../../../src/InvestmentTransaction/Entities/SellInvestmentTransaction';
import { Account } from '../../../../src/Account/Entities/Account';
import Money from '../../../../src/Money/Money';

describe('BuyInvestmentTransaction', () => {
  describe('serialize', () => {
    const now = new Date();
    const money = Money.newFromString('100', 'USD');

    const sellInvestmentTransaction = new SellInvestmentTransaction(
      new Account('Some name'),
      'META',
      1,
      money,
      now,
    );

    it('serializes correctly', () => {
      expect(sellInvestmentTransaction.serialize()).toStrictEqual({
        code: 'META',
        amount: 1,
        money: money.serialize(),
        datetime: now,
        action: 'sell',
      });
    });
  });
});
