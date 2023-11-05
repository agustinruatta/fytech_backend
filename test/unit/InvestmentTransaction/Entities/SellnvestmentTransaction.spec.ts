import SellInvestmentTransaction from '../../../../src/InvestmentTransaction/Entities/SellInvestmentTransaction';
import { Account } from '../../../../src/Account/Entities/Account';
import Money from '../../../../src/Money/Money';
import { InvalidArgumentException } from '../../../../src/Shared/Exceptions/InvalidArgumentException';
import { AvailableCurrenciesList } from '../../../../src/Money/AvailableCurrenciesList';

describe('BuyInvestmentTransaction', () => {
  const now = new Date();
  const money = Money.newFromString('100', AvailableCurrenciesList.USD);
  const account = new Account('Some name');

  describe('constructor', () => {
    it('throws an exception if code is empty', () => {
      expect(
        () => new SellInvestmentTransaction(account, ' ', 1, money, now),
      ).toThrow(
        new InvalidArgumentException(
          'Code must not be empty',
          'Code must not be empty',
        ),
      );
    });

    it('throws an exception if amount is negative', () => {
      expect(
        () => new SellInvestmentTransaction(account, 'META', -1, money, now),
      ).toThrow(
        new InvalidArgumentException(
          'Amount must be greater or equal than 0',
          'Amount must be greater or equal than 0',
        ),
      );
    });
  });

  describe('serialize', () => {
    const sellInvestmentTransaction = new SellInvestmentTransaction(
      account,
      'META',
      1,
      money,
      now,
    );

    it('serializes correctly', async () => {
      expect(await sellInvestmentTransaction.serialize()).toStrictEqual({
        accountId: undefined,
        code: 'META',
        amount: 1,
        money: money.serialize(),
        datetime: now,
        action: 'sell',
      });
    });
  });
});
