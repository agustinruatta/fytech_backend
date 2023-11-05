import { AvailableCurrencies } from './AvailableCurrencies';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const currency = require('currency.js');
import { Column } from 'typeorm';

export default class Money {
  private readonly PRECISION = 2;

  @Column({ name: 'money_cents' })
  private readonly cents: number;

  @Column({ name: 'money_currency' })
  private readonly currency: AvailableCurrencies;

  private constructor(cents: number, currency: AvailableCurrencies) {
    this.cents = cents;
    this.currency = currency;
  }

  public static newFromString(
    amount: string,
    currencySymbol: AvailableCurrencies,
  ): Money {
    if (!(currencySymbol.trim() in AvailableCurrencies)) {
      throw new Error('Currency must not be empty');
    }

    //TODO: If amount is "USD" it does not throw an error

    if (amount.trim() === '') {
      throw new Error('Amount must not be an empty string');
    }

    const money = currency(amount, { errorOnInvalid: true, precision: 2 });

    if (isNaN(money.value)) {
      throw new Error('Invalid amount');
    }

    if (money.value < 0) {
      throw new Error('Amount must not be negative');
    }

    return new Money(money.intValue, currencySymbol);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error(`Parameter's currency must be ${this.currency}`);
    }

    return new Money(this.cents + other.cents, this.currency);
  }

  divide(number: number): Money {
    //TODO: there's some problems when you divide 7/8, because it rounds
    const internalMoney = currency(this.cents, {
      precision: 2,
      fromCents: true,
    });

    return new Money(internalMoney.divide(number).intValue, this.currency);
  }

  serialize(): {
    cents: number;
    currency: AvailableCurrencies;
    floatValue: number;
  } {
    return {
      cents: this.cents,
      currency: this.currency,
      floatValue: this.cents / Math.pow(10, this.PRECISION),
    };
  }
}
