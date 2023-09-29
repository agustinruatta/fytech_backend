import BuyInvestmentTransaction from '../../../../src/InvestmentTransaction/Entities/BuyInvestmentTransaction';
import { Account } from '../../../../src/Account/Entities/Account';
import Money from '../../../../src/Money/Money';
import { InvalidArgumentException } from '../../../../src/Shared/Exceptions/InvalidArgumentException';

describe('BuyInvestmentTransaction', () => {
  const account = new Account('Some name');
  const now = new Date();
  const money = Money.newFromString('100', 'USD');

  describe('constructor', () => {
    it('throws an exception if code is empty', () => {
      expect(
        () => new BuyInvestmentTransaction(account, ' ', 1, money, now),
      ).toThrow(
        new InvalidArgumentException(
          'Code must not be empty',
          'Code must not be empty',
        ),
      );
    });

    it('throws an exception if amount is negative', () => {
      expect(
        () => new BuyInvestmentTransaction(account, 'META', -1, money, now),
      ).toThrow(
        new InvalidArgumentException(
          'Amount must be greater or equal than 0',
          'Amount must be greater or equal than 0',
        ),
      );
    });
  });

  describe('serialize', () => {
    const buyInvestmentTransaction = new BuyInvestmentTransaction(
      account,
      'META',
      1,
      money,
      now,
    );

    it('serializes correctly', () => {
      expect(buyInvestmentTransaction.serialize()).toStrictEqual({
        code: 'META',
        amount: 1,
        money: money.serialize(),
        datetime: now,
        action: 'buy',
      });
    });
  });
});
