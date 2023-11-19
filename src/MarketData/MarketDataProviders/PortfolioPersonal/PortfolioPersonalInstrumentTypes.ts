import { InstrumentTypes } from '../../InstrumentTypes';

export enum PortfolioPersonalInstrumentTypes {
  BONOS = 'BONOS',
  ACCIONES = 'ACCIONES',
  ACCIONES_USA = 'ACCIONES-USA',
  CEDEARS = 'CEDEARS',
  OBLIGACIONES_NEGOCIABLES = 'OBLIGACIONES-NEGOCIABLES',
  OPCIONES = 'OPCIONES',
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PortfolioPersonalInstrumentTypes {
  export function mapToInstrumentTypes(ppiType: string): InstrumentTypes {
    const mapping = {
      BONOS: InstrumentTypes.BONDS,
      ACCIONES: InstrumentTypes.STOCK,
      'ACCIONES-USA': InstrumentTypes.STOCK,
      CEDEARS: InstrumentTypes.CEDEARS,
      'OBLIGACIONES-NEGOCIABLES': InstrumentTypes.CORPORATE_BONDS,
      OPCIONES: InstrumentTypes.OPTIONS,
    };

    if (mapping[ppiType] === undefined) {
      throw Error('PPI instrument type not found: ' + ppiType);
    }

    return mapping[ppiType];
  }
}
