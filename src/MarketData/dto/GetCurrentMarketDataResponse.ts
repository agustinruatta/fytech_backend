import { Expose } from 'class-transformer';

export class GetCurrentMarketDataResponse {
  private readonly ask: number;
  private readonly bid: number;
  private readonly date: Date;

  constructor(ask: number, bid: number, date: Date) {
    this.ask = ask;
    this.bid = bid;
    this.date = date;
  }

  @Expose({ name: 'mid_price' })
  get midPrice() {
    return (this.ask + this.bid) / 2;
  }
}
