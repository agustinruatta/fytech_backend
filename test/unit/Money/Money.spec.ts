import Money from '../../../src/Money/Money';
import { AvailableCurrenciesList } from '../../../src/Money/AvailableCurrenciesList';

describe('Money', () => {
  describe('newFromString', () => {
    it('should create it', () => {
      const money = Money.newFromString('$123', AvailableCurrenciesList.USD);

      expect(money).toBeDefined();
    });

    it('raises exception if invalid string because has two decimal points', () => {
      expect(() =>
        Money.newFromString('255.365.6', AvailableCurrenciesList.USD),
      ).toThrow(new Error('Invalid amount'));
    });

    it('raises exception if empty string', () => {
      expect(() =>
        Money.newFromString('', AvailableCurrenciesList.USD),
      ).toThrow(new Error('Amount must not be an empty string'));
    });

    it('raises exception if empty currency', () => {
      expect(() => Money.newFromString('100', '')).toThrow(
        new Error('Currency must not be empty'),
      );
    });

    it('raises exception if amount is negative', () => {
      expect(() =>
        Money.newFromString('-100', AvailableCurrenciesList.USD),
      ).toThrow(new Error('Amount must not be negative'));
    });
  });

  describe('add', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', AvailableCurrenciesList.ARS);
    });

    it('adds two money', () => {
      const result = initialMoney.add(
        Money.newFromString('200', AvailableCurrenciesList.ARS),
      );

      expect(result).toStrictEqual(
        Money.newFromString('300', AvailableCurrenciesList.ARS),
      );
    });

    it('raise an error if currencies are different', () => {
      expect(() =>
        initialMoney.add(
          Money.newFromString('200', AvailableCurrenciesList.USD),
        ),
      ).toThrow(new Error("Parameter's currency must be ARS"));
    });
  });

  describe('divide', () => {
    let initialMoney: Money;

    beforeEach(() => {
      initialMoney = Money.newFromString('100', AvailableCurrenciesList.USD);
    });

    it('even number divide by two', () => {
      const result = initialMoney.divide(2);

      expect(result).toStrictEqual(
        Money.newFromString('50', AvailableCurrenciesList.USD),
      );
    });

    it('odd number divide by two', () => {
      const result = Money.newFromString(
        '25',
        AvailableCurrenciesList.USD,
      ).divide(2);

      expect(result).toStrictEqual(
        Money.newFromString('12.5', AvailableCurrenciesList.USD),
      );
    });

    it('number division is a rational number', () => {
      const result = Money.newFromString(
        '7',
        AvailableCurrenciesList.USD,
      ).divide(9);

      expect(result).toStrictEqual(
        Money.newFromString('0.78', AvailableCurrenciesList.USD),
      );
    });
  });

  describe('serialize', () => {
    it('serializes correctly', () => {
      expect(
        Money.newFromString('200', AvailableCurrenciesList.USD).serialize(),
      ).toStrictEqual({
        cents: 20000,
        currency: 'USD',
        floatValue: 200.0,
      });
    });
  });
});
