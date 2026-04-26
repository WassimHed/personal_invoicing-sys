import React from 'react';
import { api } from '@/api';
import { CountryExtras, ResponseRefParamDto } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface useCountryProps {
  enabled?: boolean;
}

export const useCountries = ({ enabled = true }: useCountryProps = { enabled: true }) => {
  const {
    data: countriesResp,
    isPending: isFetchCountriesPending,
    refetch: refetchCountries
  } = useQuery({
    queryKey: ['countries'],
    queryFn: () =>
      api.admin.refParam.findAll({
        filter: 'refTypeId||$eq||country'
      }),
    enabled
  });

  const countries = React.useMemo(() => {
    if (!countriesResp) return [];
    return countriesResp as ResponseRefParamDto<CountryExtras>[];
  }, [countriesResp]);

  return {
    countries,
    isFetchCountriesPending,
    refetchCountries
  };
};
