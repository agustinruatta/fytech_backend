export default class GetCurrentMarketDataRequest {
  private readonly _code: string;

  private _currency: string | undefined;

  private constructor(code: string, currency: string) {
    this._code = code.toLocaleUpperCase();
    this.setCurrency(currency);
  }

  public static new(
    code: string,
    currency: string,
  ): GetCurrentMarketDataRequest {
    return new GetCurrentMarketDataRequest(code, currency);
  }

  get code(): string {
    return this._code;
  }

  get currency(): string | undefined {
    return this._currency;
  }

  private setCurrency(value: string | undefined) {
    if (typeof value === 'string') {
      value = value.toLocaleUpperCase();
    }

    this._currency = value;
  }
}
