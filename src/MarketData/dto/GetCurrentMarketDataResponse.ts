export class GetCurrentMarketDataResponse {
  private readonly ask: number;
  private readonly bid: number;
  private readonly date: Date;

  constructor(ask: number, bid: number, date: Date) {
    this.ask = ask;
    this.bid = bid;
    this.date = date;
  }
}
