import THZipCodes from './th-zipcodes.json';
import THProvinces from './th-provinces.json';
import THDistricts from './th-districts.json';
import THSubdistricts from './th-subdistricts.json';
import { TCountryCode } from 'countries-list';
import { ICountryConfig } from 'src/utils/type';

export type DEFAULT_COUNTRY_CODE = 'TH';

export const getAddressDataConfig = (): Partial<Record<TCountryCode, ICountryConfig>> &
  Record<DEFAULT_COUNTRY_CODE, ICountryConfig> => {
  return {
    TH: {
      ZipCodes: THZipCodes,
      Provinces: THProvinces,
      Districts: THDistricts,
      Subdistricts: THSubdistricts,
    },
    // Place your country config here
    // Example
    // CN: {
    //   ZipCodes: CNZipCodes,
    //   Provinces: CNProvinces,
    //   Districts: CNDistricts,
    //   Subdistricts: CNSubdistricts,
    // },
  };
};
