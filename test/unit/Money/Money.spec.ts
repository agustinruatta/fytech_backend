import Money from '../../../src/Money/Money';

describe('Money', () => {
  describe('newFromString', () => {
    it('should create it', () => {
      const money = Money.newFromString('$123', 'USD');

      expect(money).toBeDefined();
    });

    it('raises exception if invalid string because has two decimal points', () => {
      expect(() => Money.newFromString('255.365.6', 'USD')).toThrow(
        new Error('Invalid amount'),
      );
    });

    it('raises exception if empty string', () => {
      expect(() => Money.newFromString('', 'USD')).toThrow(
        new Error('Amount must not be an empty string'),
      );
    });

    it('raises exception if empty currency', () => {
      expect(() => Money.newFromString('100', '')).toThrow(
        new Error('Currency must not be empty'),
      );
    });
  });

  describe('add', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', 'ARS');
    });

    it('adds two money', () => {
      const result = initialMoney.add(Money.newFromString('200', 'ARS'));

      expect(result).toStrictEqual(Money.newFromString('300', 'ARS'));
    });

    it('raise an error if currencies are different', async () => {
      await expect(() =>
        initialMoney.add(Money.newFromString('200', 'USD')),
      ).toThrow(new Error("Parameter's currency must be ARS"));
    });
  });

  describe('divide', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', 'USD');
    });

    it('divide by two', () => {
      const result = initialMoney.divide(2);

      expect(result).toStrictEqual(Money.newFromString('50', 'USD'));
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
