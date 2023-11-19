import { AvailableCurrencies } from '../../../Money/AvailableCurrencies';

export enum PortfolioPersonalCurrencies {
  Pesos = 'Pesos',
  CCL = 'Dolares divisa | CCL',
  MEP = 'Dolares billete | MEP',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PortfolioPersonalCurrencies {
  export function mapToAvailableCurrencies(
    ppiCurrency: string,
  ): AvailableCurrencies {
    const mapping = {
      Pesos: AvailableCurrencies.ARS,
      'Dolares divisa | CCL': AvailableCurrencies.USD_CCL,
      'Dolares billete | MEP': AvailableCurrencies.USD_MEP,
    };

    if (mapping[ppiCurrency] === undefined) {
      throw Error('PPI currency not found: ' + ppiCurrency);
    }

    return mapping[ppiCurrency];
  }
}
