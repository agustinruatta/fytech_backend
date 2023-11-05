import Serializable from '../../Shared/Serialization/Serializable';
import Money from '../../Money/Money';
import { InstrumentTypes } from '../InstrumentTypes';

export class GetCurrentMarketDataResponse implements Serializable {
  private readonly ask: Money | undefined;
  private readonly bid: Money | undefined;
  private readonly value: number | undefined;
  private readonly date: Date;
  private readonly instrumentType: InstrumentTypes;

  private constructor(
    ask: Money | undefined,
    bid: Money | undefined,
    value: number | undefined,
    instrumentType: InstrumentTypes,
    date: Date,
  ) {
    this.ask = ask;
    this.bid = bid;
    this.value = value;
    this.instrumentType = instrumentType;
    this.date = date;
  }

  static newWithMoney(
    ask: Money,
    bid: Money,
    instrumentType: InstrumentTypes,
    date: Date,
  ): GetCurrentMarketDataResponse {
    return new GetCurrentMarketDataResponse(
      ask,
      bid,
      undefined,
      instrumentType,
      date,
    );
  }

  static newWithValue(
    value: number,
    instrumentType: InstrumentTypes,
    date: Date,
  ): GetCurrentMarketDataResponse {
    return new GetCurrentMarketDataResponse(
      undefined,
      undefined,
      value,
      instrumentType,
      date,
    );
  }

  public getMidPrice(): Money {
    return this.ask.add(this.bid).divide(2);
  }

  public getInstrumentType(): InstrumentTypes {
    return this.instrumentType;
  }

  async serialize(): Promise<object> {
    if (this.ask) {
      return {
        ask: this.ask.serialize(),
        bid: this.bid.serialize(),
        mid_price: this.getMidPrice().serialize(),
        instrument_type: this.instrumentType,
        date: this.date,
      };
    } else {
      return {
        value: this.value,
        instrument_type: this.instrumentType,
        date: this.date,
      };
    }
  }
}
