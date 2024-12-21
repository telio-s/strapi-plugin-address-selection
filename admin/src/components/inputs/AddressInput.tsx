import * as React from 'react';
import { useIntl } from 'react-intl';
import {
  Box,
  Field,
  TextInput,
  Textarea,
  Flex,
  Typography,
  Combobox,
  ComboboxOption,
} from '@strapi/design-system';
import { countries } from 'countries-list';
import { type InputProps, type FieldValue } from '@strapi/strapi/admin';
import { getTranslation } from '../../utils/getTranslation';
import { TZipCode, TAddress, TProvince, TDistrict, TSubdistrict } from '../../utils/type';
import type { ICountry, TCountryCode } from 'countries-list';
import { useAddressData } from '../../utils/useAddressData';
import { getAddressDataConfig as getCountriesAvaliableConfig } from '../../sources/address-config';

type AddressInputProps = InputProps & FieldValue;

export const AddressInput = React.forwardRef<HTMLElement, AddressInputProps>((props, ref) => {
  const {
    hint,
    disabled = false,
    labelAction,
    name,
    required = false,
    onChange,
    value,
    error,
  } = props;
  const { formatMessage } = useIntl();
  const [country, setCountry] = React.useState<{ code: TCountryCode; item: ICountry }>();
  const [zipCode, setZipCode] = React.useState<{ zipcode: string; values: TZipCode[] }>();
  const [province, setProvince] = React.useState<TProvince>();
  const [district, setDistrict] = React.useState<TDistrict>();
  const [result, setResult] = React.useState<TAddress>({
    country: '',
    zipcode: '',
    province: '',
    district: '',
    subdistrict: '',
    address: '',
  });
  const { ZipCodes, Provinces, Districts, Subdistricts } = useAddressData(country?.code || 'US');
  const [paginationCountries, setPaginationCountry] = React.useState<number>(1);

  const getCountry = React.useMemo(() => {
    let mapCodeCountry: { code: TCountryCode; country: ICountry }[] = Object.keys(
      getCountriesAvaliableConfig()
    ).map((key: string) => {
      return {
        code: key as TCountryCode,
        country: countries[key as TCountryCode],
      };
    });

    let c: { code: TCountryCode; country: ICountry }[] = mapCodeCountry.splice(
      0,
      paginationCountries * 10
    );

    return c;
  }, [paginationCountries]);

  const [countriesList, setCountriesList] =
    React.useState<{ code: TCountryCode; country: ICountry }[]>(getCountry);

  const getZipCode = React.useCallback((z: string) => {
    return ZipCodes.filter((item) => item.ZIPCODE === z);
  }, []);

  const getProvince = React.useMemo(() => {
    const z = ZipCodes.findIndex((value, index) => value.ZIPCODE === zipCode?.zipcode);
    return Provinces.filter((item) => item.PROVINCE_ID.toString() === ZipCodes[z]?.PROVINCE_ID);
  }, [zipCode]);

  const getDistrict = React.useMemo(() => {
    let districts: TDistrict[] = [];
    const districtIds = zipCode?.values.filter(
      (value, index, self) => self.findIndex((v) => v.DISTRICT_ID === value.DISTRICT_ID) === index
    );
    if (!districtIds) return [];
    for (let zIndex = 0; zIndex < districtIds?.length; zIndex++) {
      const d = Districts.filter(
        (item) => item.DISTRICT_ID.toString() === districtIds[zIndex].DISTRICT_ID
      );
      districts = districts.concat(d);
    }
    return districts;
  }, [province]);

  const getSubdistrict = React.useMemo(() => {
    return Subdistricts.filter((item) => item.DISTRICT_ID === district?.DISTRICT_ID);
  }, [district]);

  const onClearResult = (field: keyof TAddress) => {
    let clearResult: Partial<TAddress> = {
      country: '',
      zipcode: '',
      province: '',
      district: '',
      subdistrict: '',
    };
    if (field === 'zipcode') {
      clearResult = { zipcode: '', province: '', district: '', subdistrict: '' };
    } else if (field === 'province') {
      clearResult = { province: '', district: '', subdistrict: '' };
    } else if (field === 'district') {
      clearResult = { district: '', subdistrict: '' };
    } else if (field === 'subdistrict') {
      clearResult = { subdistrict: '' };
    }

    setResult((prev) => ({ ...prev, ...clearResult }));
    onChange({
      target: {
        name,
        value: JSON.stringify({ ...result, ...clearResult }),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleOnChangeAddress = (item: string) => {
    setResult((prev) => ({ ...prev, address: item }));
    onChange({
      target: {
        name,
        value: JSON.stringify({ ...result, address: item }),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleOnChangeCountry = (props: { code: TCountryCode; item: ICountry }) => {
    const { code, item } = props;
    if (item && code) {
      onClearResult('country');
      setCountry({ code, item });
      setResult((prev) => ({ ...prev, country: item.name }));
      onChange({
        target: {
          name,
          value: JSON.stringify({ ...result, country: item.name }),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleOnChangeZipCode = (item: string) => {
    if (item || item === '') {
      onClearResult('zipcode');
      const zipCodes = getZipCode(item);
      setZipCode({ zipcode: item, values: zipCodes });
      setResult((prev) => ({ ...prev, zipcode: item }));
      onChange({
        target: {
          name,
          value: JSON.stringify({ ...result, zipcode: item }),
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleOnChangeProvince = (item: TProvince) => {
    if (!item) return;
    onClearResult('province');
    setProvince(item);
    setResult((prev) => ({ ...prev, province: item.PROVINCE_NAME }));
    onChange({
      target: {
        name,
        value: JSON.stringify({ ...result, province: item.PROVINCE_NAME }),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleOnChangeDistrict = (item: TDistrict) => {
    if (!item) return;
    setDistrict(item);
    onClearResult('district');
    setResult((prev) => ({ ...prev, district: item.DISTRICT_NAME }));
    onChange({
      target: {
        name,
        value: JSON.stringify({ ...result, district: item.DISTRICT_NAME }),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleOnChangeSubdistrict = (item: TSubdistrict) => {
    if (!item) return;
    onClearResult('subdistrict');
    setResult((prev) => ({ ...prev, subdistrict: item.SUB_DISTRICT_NAME }));
    onChange({
      target: {
        name,
        value: JSON.stringify({ ...result, subdistrict: item.SUB_DISTRICT_NAME }),
      },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Box>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.country'),
            defaultMessage: 'Country',
          })}
        </Field.Label>
        <Combobox
          disabled={disabled}
          value={value}
          textValue={result.country}
          filterValue={result.country}
          onInputChange={(e: React.FormEvent<HTMLInputElement>) =>
            setResult((prev) => ({ ...prev, country: e.currentTarget.value }))
          }
          onFilterValueChange={(value: string) => {
            const thisCountry = getCountry.filter(({ code, country }) =>
              country.name.toLowerCase().includes(value.toLowerCase())
            );
            setCountriesList(thisCountry);
          }}
          onChange={handleOnChangeCountry}
          onLoadMore={() => {
            setPaginationCountry((prev) => prev + 1);
            setCountriesList(getCountry);
          }}
          hasMoreItems
        >
          {countriesList.map(({ code, country }) => {
            return (
              <ComboboxOption
                key={code}
                value={{ code: code, item: country }}
                textValue={country.name}
              >
                <Flex alignItems="center" gap="4px">
                  <Typography>{country.name}</Typography>
                </Flex>
              </ComboboxOption>
            );
          })}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.zipCode'),
            defaultMessage: 'Zip Code',
          })}
        </Field.Label>
        <TextInput
          size="M"
          type="text"
          value={result.zipcode}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            handleOnChangeZipCode(e.currentTarget.value);
          }}
        />
        <Field.Hint />
        <Field.Error />
      </Field.Root>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.province'),
            defaultMessage: 'Province',
          })}
        </Field.Label>
        <Combobox
          disabled={disabled}
          value={value}
          textValue={result.province}
          filterValue={result.province}
          onInputChange={(e: React.FormEvent<HTMLInputElement>) =>
            setResult((prev) => ({ ...prev, province: e.currentTarget.value }))
          }
          onChange={handleOnChangeProvince}
        >
          {getProvince.map((c: TProvince) => {
            return (
              <ComboboxOption key={c.PROVINCE_NAME} value={c} textValue={c.PROVINCE_NAME}>
                <Flex alignItems="center" gap="4px">
                  <Typography>{c.PROVINCE_NAME}</Typography>
                </Flex>
              </ComboboxOption>
            );
          })}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.district'),
            defaultMessage: 'District',
          })}
        </Field.Label>
        <Combobox
          disabled={disabled}
          value={value}
          textValue={result.district}
          filterValue={result.district}
          onInputChange={(e: React.FormEvent<HTMLInputElement>) =>
            setResult((prev) => ({ ...prev, district: e.currentTarget.value }))
          }
          onChange={handleOnChangeDistrict}
        >
          {getDistrict.map((c: TDistrict) => {
            return (
              <ComboboxOption key={c.DISTRICT_NAME} value={c} textValue={c.DISTRICT_NAME}>
                <Flex alignItems="center" gap="4px">
                  <Typography>{c.DISTRICT_NAME}</Typography>
                </Flex>
              </ComboboxOption>
            );
          })}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.subdistrict'),
            defaultMessage: 'Subdistrict',
          })}
        </Field.Label>
        <Combobox
          disabled={disabled}
          value={value}
          textValue={result.subdistrict}
          filterValue={result.subdistrict}
          onInputChange={(e: React.FormEvent<HTMLInputElement>) =>
            setResult((prev) => ({ ...prev, subdistrict: e.currentTarget.value }))
          }
          onChange={handleOnChangeSubdistrict}
        >
          {getSubdistrict.map((c: TSubdistrict) => {
            return (
              <ComboboxOption key={c.SUB_DISTRICT_NAME} value={c} textValue={c.SUB_DISTRICT_NAME}>
                <Flex alignItems="center" gap="4px">
                  <Typography>{c.SUB_DISTRICT_NAME}</Typography>
                </Flex>
              </ComboboxOption>
            );
          })}
        </Combobox>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
      <Field.Root name={name} id={name} error={error} hint={hint} required={required}>
        <Field.Label action={labelAction}>
          {formatMessage({
            id: getTranslation('form.label.address'),
            defaultMessage: 'House Number',
          })}
        </Field.Label>
        <Textarea
          type="text"
          maxLength="50"
          value={result.address}
          rules={{
            maxLength: {
              value: 50,
              message: 'The length must be 50 characters',
            },
          }}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            handleOnChangeAddress(e.currentTarget.value);
          }}
        />
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    </Box>
  );
});
