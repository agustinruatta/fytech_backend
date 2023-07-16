import Serializable from '../../Shared/serialization/Serializable';

export class GetCurrentMarketDataResponse implements Serializable {
  private readonly ask: number;
  private readonly bid: number;
  private readonly date: Date;

  constructor(ask: number, bid: number, date: Date) {
    this.ask = ask;
    this.bid = bid;
    this.date = date;
  }

  private getMidPrice() {
    return (this.ask + this.bid) / 2;
  }

  serialize(): object {
    return {
      ask: this.ask,
      bid: this.bid,
      mid_price: this.getMidPrice(),
      date: this.date,
    };
  }
}
