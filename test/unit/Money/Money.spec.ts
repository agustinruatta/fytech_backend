import Money from '../../../src/Money/Money';
import { AvailableCurrencies } from '../../../src/Money/AvailableCurrencies';

describe('Money', () => {
  describe('newFromString', () => {
    it('should create it', () => {
      const money = Money.newFromString('$123', AvailableCurrencies.USD);

      expect(money).toBeDefined();
    });

    it('raises exception if invalid string because has two decimal points', () => {
      expect(() =>
        Money.newFromString('255.365.6', AvailableCurrencies.USD),
      ).toThrow(new Error('Invalid amount'));
    });

    it('raises exception if empty string', () => {
      expect(() => Money.newFromString('', AvailableCurrencies.USD)).toThrow(
        new Error('Amount must not be an empty string'),
      );
    });

    it('raises exception if currency is invalid', () => {
      // @ts-ignore
      expect(() => Money.newFromString('100', 'invalid')).toThrow(
        new Error('Currency must not be empty'),
      );
    });

    it('raises exception if currency is USD', () => {
      // @ts-ignore
      expect(() => Money.newFromString('100', 'USD')).toThrow(
        new Error('Currency must not be empty'),
      );
    });

    it('raises exception if amount is negative', () => {
      expect(() =>
        Money.newFromString('-100', AvailableCurrencies.USD),
      ).toThrow(new Error('Amount must not be negative'));
    });
  });

  describe('new from constructor', () => {
    it('should create it', () => {
      const money = new Money(12345, AvailableCurrencies.USD);

      expect(money).toBeDefined();
    });

    it('raises exception if currency is invalid', () => {
      // @ts-ignore
      expect(() => new Money(100, 'invalid')).toThrow(
        new Error('Currency must not be empty'),
      );
    });

    it('raises exception if currency is USD', () => {
      // @ts-ignore
      expect(() => new Money(100, 'USD')).toThrow(
        new Error('Currency must not be empty'),
      );
    });

    it('raises exception if amount is negative', () => {
      expect(() => new Money(-100, AvailableCurrencies.USD)).toThrow(
        new Error('Amount must not be negative'),
      );
    });
  });

  describe('add', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', AvailableCurrencies.ARS);
    });

    it('adds two money', () => {
      const result = initialMoney.add(
        Money.newFromString('200', AvailableCurrencies.ARS),
      );

      expect(result).toStrictEqual(
        Money.newFromString('300', AvailableCurrencies.ARS),
      );
    });

    it('raise an error if currencies are different', () => {
      expect(() =>
        initialMoney.add(Money.newFromString('200', AvailableCurrencies.USD)),
      ).toThrow(new Error("Parameter's currency must be ARS"));
    });
  });

  describe('multiply', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', AvailableCurrencies.USD);
    });

    it('multiplies by positive integer', () => {
      const result = initialMoney.multiply(2);

      expect(result).toStrictEqual(
        Money.newFromString('200', AvailableCurrencies.USD),
      );
    });

    it('multiplies by positive float', () => {
      const result = initialMoney.multiply(2.5);

      expect(result).toStrictEqual(
        Money.newFromString('250', AvailableCurrencies.USD),
      );
    });

    it('multiplies by negative number', () => {
      expect(() => initialMoney.multiply(-2)).toThrow(
        new Error('Amount must not be negative'),
      );
    });
  });

  describe('divide', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', AvailableCurrencies.USD);
    });

    it('even number divide by two', () => {
      const result = initialMoney.divide(2);

      expect(result).toStrictEqual(
        Money.newFromString('50', AvailableCurrencies.USD),
      );
    });

    it('odd number divide by two', () => {
      const result = Money.newFromString('25', AvailableCurrencies.USD).divide(
        2,
      );

      expect(result).toStrictEqual(
        Money.newFromString('12.5', AvailableCurrencies.USD),
      );
    });

    it('number division is a rational number', () => {
      const result = Money.newFromString('7', AvailableCurrencies.USD).divide(
        9,
      );

      expect(result).toStrictEqual(
        Money.newFromString('0.78', AvailableCurrencies.USD),
      );
    });

    it('raises an error if tries to divide by zero', () => {
      expect(() => initialMoney.divide(0)).toThrow(
        new Error('Cannot divide by zero'),
      );
    });
  });

  describe('serialize', () => {
    it('serializes correctly', () => {
      expect(
        Money.newFromString('200', AvailableCurrencies.USD).serialize(),
      ).toStrictEqual({
        cents: 20000,
        currency: AvailableCurrencies.USD,
        floatValue: 200.0,
      });
    });
  });
});
