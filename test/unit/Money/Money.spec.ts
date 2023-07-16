import Money from '../../../src/Money/Money';

describe('Money', () => {
  describe('newFromString', () => {
    it('should create it', () => {
      const money = Money.newFromString('$123', 'USD');

      expect(money).toBeDefined();
    });

    it('raises exception if invalid string because has two decimal points', async () => {
      await expect(() => Money.newFromString('255.365.6', 'USD')).toThrow(
        new Error('Invalid amount'),
      );
    });

    it('raises exception if invalid string because is not a number', async () => {
      await expect(() => Money.newFromString('USD', 'USD')).toThrow(
        new Error('Invalid amount'),
      );
    });

    it('raises exception if empty string', async () => {
      await expect(() => Money.newFromString('', 'USD')).toThrow(
        new Error('Invalid amount'),
      );
    });
  });

  describe('add', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', 'USD');
    });

    it('adds two money', () => {
      const result = initialMoney.add(Money.newFromString('200', 'USD'));

      expect(result).toStrictEqual(Money.newFromString('300', 'USD'));
    });

    it('raise an error if currencies are different', async () => {
      await expect(() =>
        initialMoney.add(Money.newFromString('200', 'ARS')),
      ).toThrow(new Error("Parameter's currency must be USD"));
    });
  });

  describe('serialize', () => {
    it('serializes correctly', () => {
      expect(Money.newFromString('200', 'USD').serialize()).toStrictEqual({
        cents: 20000,
        currency: 'USD',
        floatValue: 200.0,
      });
    });
  });
});
