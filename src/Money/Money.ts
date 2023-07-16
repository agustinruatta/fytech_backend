// eslint-disable-next-line @typescript-eslint/no-var-requires
const currency = require('currency.js');

export default class Money {
  private readonly internalMoney: object;
  private readonly currency: string;

  constructor(internalMoney: object, currency: string) {
    this.internalMoney = internalMoney;
    this.currency = currency;
  }

  public static newFromString(amount: string, currencySymbol: string): Money {
    const money = currency(amount, { errorOnInvalid: true, precision: 4 });
    if (isNaN(money.value)) {
      throw new Error('Invalid amount');
    }
    return new Money(money, currencySymbol);
  }
}
