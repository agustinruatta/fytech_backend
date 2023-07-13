export class GetCurrentMarketDataResponse {
  private readonly _ask: number;
  private readonly _bid: number;
  private readonly _date: Date;

  constructor(ask: number, bid: number, date: Date) {
    this._ask = ask;
    this._bid = bid;
    this._date = date;
  }

  get ask(): number {
    return this._ask;
  }

  get bid(): number {
    return this._bid;
  }

  get date(): Date {
    return this._date;
  }
}
