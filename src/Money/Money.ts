// eslint-disable-next-line @typescript-eslint/no-var-requires
const currency = require('currency.js');
import currencyNamespace from 'currency.js';

interface currencyLibObject {
  add(number: currencyNamespace.Any): currencyLibObject;
  subtract(number: currencyNamespace.Any): currencyLibObject;
  multiply(number: currencyNamespace.Any): currencyLibObject;
  divide(number: currencyNamespace.Any): currencyLibObject;
  distribute(count: number): Array<currencyLibObject>;
  dollars(): number;
  cents(): number;
  format(opts?: currencyNamespace.Options | currencyNamespace.Format): string;
  toString(): string;
  toJSON(): number;
  readonly intValue: number;
  readonly value: number;
}

export default class Money {
  private readonly internalMoney: currencyLibObject;
  private readonly currency: string;

  constructor(internalMoney: currencyLibObject, currency: string) {
    this.internalMoney = internalMoney;
    this.currency = currency;
  }

  public static newFromString(amount: string, currencySymbol: string): Money {
    const money = currency(amount, { errorOnInvalid: true, precision: 2 });
    if (isNaN(money.value)) {
      throw new Error('Invalid amount');
    }
    return new Money(money, currencySymbol);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Parameter's currency must be USD");
    }

    return new Money(this.internalMoney.add(other.internalMoney), 'USD');
  }

  divide(number: number): Money {
    return new Money(this.internalMoney.divide(number), this.currency);
  }

  serialize(): {
    cents: number;
    currency: string;
    floatValue: number;
  } {
    return {
      cents: this.internalMoney.intValue,
      currency: this.currency,
      floatValue: this.internalMoney.value,
    };
  }
}
