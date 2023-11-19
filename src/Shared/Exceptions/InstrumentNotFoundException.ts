import HTTPSerializableException from './HTTPSerializableException';
import { AvailableCurrencies } from '../../Money/AvailableCurrencies';

export default class InstrumentNotFoundException
  extends Error
  implements HTTPSerializableException
{
  constructor(
    private readonly code: string,
    private readonly currency: AvailableCurrencies,
  ) {
    super(`Instrument with code ${code} and currency ${currency} not found`);
  }

  getErrorMessages(): string[] {
    return [`Instrument with code ${this.code} and currency ${this.currency} not found`];
  }

  getHttpCode(): number {
    return 404;
  }
}
