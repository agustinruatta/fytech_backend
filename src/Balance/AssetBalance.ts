import { AvailableCurrencies } from '../Money/AvailableCurrencies';
import { InstrumentTypes } from '../MarketData/InstrumentTypes';

export default interface AssetBalance {
  instrumentType: InstrumentTypes;
  code: string;
  amount: number;
  balance: {
    cents: number;
    currency: AvailableCurrencies;
    floatValue: number;
  };
}
