export default class GetCurrentMarketDataRequest {
  private readonly _code: string;

  private _currency: string | undefined;

  constructor(code: string) {
    this._code = code.toLocaleUpperCase();
  }

  public static new(code: string): GetCurrentMarketDataRequest {
    return new GetCurrentMarketDataRequest(code);
  }

  public withCurrency(
    currency: string | undefined,
  ): GetCurrentMarketDataRequest {
    this.currency = currency;
    return this;
  }

  get code(): string {
    return this._code;
  }

  get currency(): string | undefined {
    return this._currency;
  }

  set currency(value: string | undefined) {
    if (typeof value === 'string') {
      value = value.toLocaleUpperCase();
    }
    this._currency = value;
  }
}
