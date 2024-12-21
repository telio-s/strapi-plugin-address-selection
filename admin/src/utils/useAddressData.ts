import type { TCountryCode } from 'countries-list';
import { getAddressDataConfig } from '../sources/address-config';
import { ICountryConfig } from './type';

const COUNTRYCODE_FALLBACK: TCountryCode = 'TH';
const useAddressData = (countryCode: TCountryCode): ICountryConfig => {
  const countriesData = getAddressDataConfig()[countryCode];

  if (!countriesData) {
    return getAddressDataConfig()[COUNTRYCODE_FALLBACK];
  }
  return countriesData;
};

export { useAddressData };
