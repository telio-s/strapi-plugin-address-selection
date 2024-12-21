export type TAddress = {
  address: string;
  country: string;
  zipcode: string;
  province: string;
  district: string;
  subdistrict: string;
};

export type TZipCode = {
  ZIPCODE_ID: number;
  SUB_DISTRICT_CODE: string;
  PROVINCE_ID: string;
  DISTRICT_ID: string;
  SUB_DISTRICT_ID: string;
  ZIPCODE: string;
};

export type TProvince = {
  PROVINCE_ID: number;
  PROVINCE_CODE: string;
  PROVINCE_NAME: string;
  GEO_ID: number;
};

export type TDistrict = {
  DISTRICT_ID: number;
  DISTRICT_CODE: string;
  DISTRICT_NAME: string;
  GEO_ID: number;
  PROVINCE_ID: number;
};

export type TSubdistrict = {
  SUB_DISTRICT_ID: number;
  SUB_DISTRICT_CODE: string;
  SUB_DISTRICT_NAME: string;
  DISTRICT_ID: number;
  PROVINCE_ID: number;
  GEO_ID: number;
};

export interface ICountryConfig {
  ZipCodes: TZipCode[];
  Provinces: TProvince[];
  Districts: TDistrict[];
  Subdistricts: TSubdistrict[];
}
