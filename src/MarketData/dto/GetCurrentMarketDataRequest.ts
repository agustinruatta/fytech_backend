export default class GetCurrentMarketDataRequest {
  private _currency: string | undefined;

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
