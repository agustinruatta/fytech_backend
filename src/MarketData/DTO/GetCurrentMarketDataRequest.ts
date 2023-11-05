import { AvailableCurrencies } from '../../Money/AvailableCurrencies';

export default class GetCurrentMarketDataRequest {
  private readonly _code: string;

  private _currency: AvailableCurrencies;

  private constructor(code: string, currency: AvailableCurrencies) {
    this._code = code.toLocaleUpperCase();
    this.setCurrency(currency);
  }

  public static new(
    code: string,
    currency: AvailableCurrencies,
  ): GetCurrentMarketDataRequest {
    return new GetCurrentMarketDataRequest(code, currency);
  }

  get code(): string {
    return this._code;
  }

  get currency(): AvailableCurrencies {
    return this._currency;
  }

  private setCurrency(value: AvailableCurrencies) {
    this._currency = value;
  }
}
