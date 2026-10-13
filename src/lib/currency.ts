export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

export interface CountryConfig {
  name: string;
  code: string;
  phonePrefix: string;
  defaultCurrency: string;
  defaultTaxName: string;
  defaultTaxPercentage: number;
  taxIdLabel: string; // e.g. RUC, RFC, RUT, NIT, NIF
}

export const SUPPORTED_COUNTRIES: CountryConfig[] = [
  {
    name: 'Ecuador',
    code: 'EC',
    phonePrefix: '+593',
    defaultCurrency: 'USD',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 15,
    taxIdLabel: 'RUC / C.I.',
  },
  {
    name: 'Colombia',
    code: 'CO',
    phonePrefix: '+57',
    defaultCurrency: 'COP',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 19,
    taxIdLabel: 'NIT / CC',
  },
  {
    name: 'México',
    code: 'MX',
    phonePrefix: '+52',
    defaultCurrency: 'MXN',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 16,
    taxIdLabel: 'RFC',
  },
  {
    name: 'Perú',
    code: 'PE',
    phonePrefix: '+51',
    defaultCurrency: 'PEN',
    defaultTaxName: 'IGV',
    defaultTaxPercentage: 18,
    taxIdLabel: 'RUC / DNI',
  },
  {
    name: 'Chile',
    code: 'CL',
    phonePrefix: '+56',
    defaultCurrency: 'CLP',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 19,
    taxIdLabel: 'RUT',
  },
  {
    name: 'Argentina',
    code: 'AR',
    phonePrefix: '+54',
    defaultCurrency: 'ARS',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 21,
    taxIdLabel: 'CUIT',
  },
  {
    name: 'Estados Unidos',
    code: 'US',
    phonePrefix: '+1',
    defaultCurrency: 'USD',
    defaultTaxName: 'Sales Tax',
    defaultTaxPercentage: 8,
    taxIdLabel: 'EIN / Tax ID',
  },
  {
    name: 'España',
    code: 'ES',
    phonePrefix: '+34',
    defaultCurrency: 'EUR',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 21,
    taxIdLabel: 'NIF / CIF',
  },
  {
    name: 'Panamá',
    code: 'PA',
    phonePrefix: '+507',
    defaultCurrency: 'USD',
    defaultTaxName: 'ITBMS',
    defaultTaxPercentage: 7,
    taxIdLabel: 'RUC',
  },
  {
    name: 'Guatemala',
    code: 'GT',
    phonePrefix: '+502',
    defaultCurrency: 'GTQ',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 12,
    taxIdLabel: 'NIT',
  },
  {
    name: 'Bolivia',
    code: 'BO',
    phonePrefix: '+591',
    defaultCurrency: 'BOB',
    defaultTaxName: 'IVA',
    defaultTaxPercentage: 13,
    taxIdLabel: 'NIT',
  },
];

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'Dólar Estadounidense (USD)', locale: 'en-US' },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano (COP)', locale: 'es-CO' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano (MXN)', locale: 'es-MX' },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano (PEN)', locale: 'es-PE' },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno (CLP)', locale: 'es-CL' },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino (ARS)', locale: 'es-AR' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)', locale: 'es-ES' },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal Guatemalteco (GTQ)', locale: 'es-GT' },
  { code: 'BOB', symbol: 'Bs', name: 'Boliviano (BOB)', locale: 'es-BO' },
];

export const getCurrencySymbol = (currencyCode?: string | null): string => {
  if (!currencyCode) return '$';
  const found = SUPPORTED_CURRENCIES.find(
    (c) => c.code.toUpperCase() === currencyCode.toUpperCase()
  );
  return found ? found.symbol : '$';
};

export const formatCurrency = (amount: number | string | undefined | null, currencyCode?: string | null): string => {
  const num = Number(amount || 0);
  const symbol = getCurrencySymbol(currencyCode);
  const isNoDecimal = currencyCode === 'CLP' || currencyCode === 'COP';
  const formattedNumber = num.toLocaleString('en-US', {
    minimumFractionDigits: isNoDecimal ? 0 : 2,
    maximumFractionDigits: isNoDecimal ? 0 : 2,
  });
  return `${symbol}${formattedNumber}`;
};
