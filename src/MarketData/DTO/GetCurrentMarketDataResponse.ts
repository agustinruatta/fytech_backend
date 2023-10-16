import Serializable from '../../Shared/Serialization/Serializable';
import Money from '../../Money/Money';

export class GetCurrentMarketDataResponse implements Serializable {
  private readonly ask: Money | undefined;
  private readonly bid: Money | undefined;
  private readonly value: number | undefined;
  private readonly date: Date;

  private constructor(
    ask: Money | undefined,
    bid: Money | undefined,
    value: number | undefined,
    date: Date,
  ) {
    this.ask = ask;
    this.bid = bid;
    this.value = value;
    this.date = date;
  }

  static newWithMoney(
    ask: Money,
    bid: Money,
    date: Date,
  ): GetCurrentMarketDataResponse {
    return new GetCurrentMarketDataResponse(ask, bid, undefined, date);
  }

  static newWithValue(value: number, date: Date): GetCurrentMarketDataResponse {
    return new GetCurrentMarketDataResponse(undefined, undefined, value, date);
  }

  private getMidPrice(): Money {
    return this.ask.add(this.bid).divide(2);
  }

  async serialize(): Promise<object> {
    if (this.ask) {
      return {
        ask: this.ask.serialize(),
        bid: this.bid.serialize(),
        mid_price: this.getMidPrice().serialize(),
        date: this.date,
      };
    } else {
      return {
        value: this.value,
        date: this.date,
      };
    }
  }
}
