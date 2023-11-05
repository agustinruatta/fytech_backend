import { AvailableCurrencies } from '../Money/AvailableCurrencies';
import { InstrumentTypes } from '../MarketData/InstrumentTypes';

export default interface AssetBalance {
  instrument_type: InstrumentTypes;
  code: string;
  amount: number;
  balance: {
    cents: number;
    currency: AvailableCurrencies;
    floatValue: number;
  };
}
