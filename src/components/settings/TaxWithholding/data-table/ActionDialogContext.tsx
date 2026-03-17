import { TaxWithholding } from '@/types';
import React from 'react';
import { DataTableConfig } from '@/components/shared/data-table/types';

export const TaxWithholdingActionsContext = React.createContext<DataTableConfig<TaxWithholding>>(
  {} as DataTableConfig<TaxWithholding>
);