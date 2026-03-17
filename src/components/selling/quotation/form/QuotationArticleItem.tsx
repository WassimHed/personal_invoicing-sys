import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { FieldBuilder } from '@/components/shared/form-builder/FieldBuilder';
import { FieldVariant } from '@/components/shared/form-builder/types';
import { ArticleQuotationEntry, Currency, QuotationTaxEntry, Tax } from '@/types';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

import { QuotationTaxEntries } from './QuotationTaxEntries';

interface QuotationArticleItemProps {
  className?: string;
  article: ArticleQuotationEntry;
  onChange: (item: ArticleQuotationEntry) => void;
  showDescription?: boolean;
  currency?: Currency;
  taxes: Tax[];
  edit?: boolean;
}

export const QuotationArticleItem: React.FC<QuotationArticleItemProps> = ({
  className,
  article,
  onChange,
  taxes,
  currency,
  showDescription = false,
  edit = true
}) => {
  const { t: tInvoicing } = useTranslation('invoicing');

  const digitAfterComma = currency?.digitAfterComma || 3;
  const currencySymbol = currency?.symbol || '$';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      article: {
        ...article.article,
        title: e.target.value
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...article,
      article: {
        ...article.article,
        description: e.target.value
      }
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = e.target.value;
    const regex = new RegExp(`^\\d*(\\.\\d{0,${3}})?$`);
    if (quantity.match(regex)) {
      onChange({
        ...article,
        quantity: parseFloat(quantity)
      });
    }
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const unitPrice = e.target.value;
    const regex = new RegExp(`^\\d*(\\.\\d{0,${3}})?$`);
    if (unitPrice.match(regex)) {
      onChange({
        ...article,
        unit_price: parseFloat(unitPrice)
      });
    }
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const discount = e.target.value;
    const { discount_type } = article;

    if (discount_type === DISCOUNT_TYPE.PERCENTAGE) {
      const percentage = parseFloat(discount);
      onChange({
        ...article,
        discount: percentage
      });
    } else if (discount_type === DISCOUNT_TYPE.AMOUNT) {
      const regex = new RegExp(`^\\d*(\\.\\d{0,${3}})?$`);
      if (regex.test(discount)) {
        onChange({
          ...article,
          discount: parseFloat(discount)
        });
      }
    }
  };

  const handleDiscountTypeChange = (value: string) => {
    onChange({
      ...article,
      discount_type: value === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      discount: 0 // Reset discount to 0 when changing the type
    });
  };

  const handleTaxChange = (value: string, index: number) => {
    const selectedTax = taxes.find((tax) => tax.id === parseInt(value));
    const updatedTaxes = [...(article.articleQuotationEntryTaxes || [])];
    if (selectedTax) {
      updatedTaxes[index] = { tax: selectedTax };
    } else {
      updatedTaxes.splice(index, 1);
    }
    onChange({ ...article, articleQuotationEntryTaxes: updatedTaxes });
  };

  const handleTaxDelete = (index: number) => {
    const updatedTaxes = article.articleQuotationEntryTaxes?.filter((_, i) => i !== index);
    onChange({ ...article, articleQuotationEntryTaxes: updatedTaxes });
  };

  const handleAddTax = () => {
    if ((article.articleQuotationEntryTaxes?.length || 0) >= taxes.length) {
      toast.info(tInvoicing('quotation.errors.surpassed_tax_limit'));
      return;
    }
    onChange({
      ...article,
      articleQuotationEntryTaxes: [
        ...(article.articleQuotationEntryTaxes || []),
        {} as QuotationTaxEntry
      ]
    });
  };

  const selectedTaxIds = article.articleQuotationEntryTaxes?.map((t) => t.tax?.id) || [];

  return (
    <div className={cn('flex flex-row items-center gap-6 h-full', className)}>
      <div className="w-9/12">
        <div className="flex flex-row gap-2 my-1">
          {/* Title */}
          <div className="w-3/5">
            <Label className="mx-1">{tInvoicing('article.attributes.title')}</Label>
            {edit ? (
              <FieldBuilder
                field={{
                  id: 'title',
                  variant: FieldVariant.TEXT,
                  placeholder: 'Title',
                  props: {
                    value: article.article?.title,
                    onChange: (v: string) => handleTitleChange({ target: { value: v } } as any)
                  }
                }}
              />
            ) : (
              <FieldBuilder
                field={{
                  id: 'title_ro',
                  variant: FieldVariant.TEXT,
                  props: { value: article.article?.title, disabled: true }
                }}
              />
            )}
          </div>
          {/* Quantity */}
          <div className="w-1/5">
            <Label className="mx-1">{tInvoicing('article.attributes.quantity')}</Label>
            {edit ? (
              <FieldBuilder
                field={{
                  id: 'quantity',
                  variant: FieldVariant.TEXT,
                  placeholder: '0',
                  props: {
                    value: String(article.quantity || ''),
                    onChange: (v: string) => handleQuantityChange({ target: { value: v } } as any)
                  }
                }}
              />
            ) : (
              <FieldBuilder
                field={{
                  id: 'quantity_ro',
                  variant: FieldVariant.TEXT,
                  props: { value: String(article.quantity || ''), disabled: true }
                }}
              />
            )}
          </div>
          {/* Price */}
          <div className="w-1/5">
            <Label className="mx-1">{tInvoicing('article.attributes.unit_price')}</Label>
            <div className="flex items-center gap-2">
              {edit ? (
                <FieldBuilder
                  field={{
                    id: 'unit_price',
                    variant: FieldVariant.TEXT,
                    placeholder: '0',
                    props: {
                      value: String(article.unit_price || ''),
                      onChange: (v: string) => handleUnitPriceChange({ target: { value: v } } as any)
                    }
                  }}
                />
              ) : (
                <FieldBuilder
                  field={{
                    id: 'unit_price_ro',
                    variant: FieldVariant.TEXT,
                    props: { value: String(article.unit_price || ''), disabled: true }
                  }}
                />
              )}
              <Label className="font-bold mx-1">{currency?.symbol}</Label>
            </div>
          </div>
        </div>
        <div>
          {showDescription && (
            <div>
              {edit ? (
                <>
                  <Label className="mx-1">{tInvoicing('article.attributes.description')}</Label>
                  <FieldBuilder
                    field={{
                      id: 'description',
                      variant: FieldVariant.TEXTAREA,
                      placeholder: 'Description',
                      props: {
                        value: article.article?.description,
                        onChange: (v: string) => handleDescriptionChange({ target: { value: v } } as any),
                        rows: 3,
                        className: 'resize-none'
                      }
                    }}
                  />
                </>
              ) : (
                article.article?.description && (
                  <>
                    <Label className="mx-1">{tInvoicing('article.attributes.description')}</Label>
                    <FieldBuilder
                      field={{
                        id: 'description_ro',
                        variant: FieldVariant.TEXTAREA,
                        props: {
                          value: article.article?.description,
                          disabled: true,
                          rows: 3 + (article?.articleQuotationEntryTaxes?.length || 0),
                          className: 'resize-none'
                        }
                      }}
                    />
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-3/12 flex flex-col h-full">
        {/* Taxes */}
        <div className="my-auto">
          <Label className="block my-3">{tInvoicing('article.attributes.taxes')}</Label>
          <QuotationTaxEntries
            article={article}
            taxes={taxes}
            selectedTaxIds={selectedTaxIds}
            currency={currency}
            handleTaxAdd={handleAddTax}
            handleTaxChange={handleTaxChange}
            handleTaxDelete={handleTaxDelete}
            edit={edit}
          />
        </div>

        {/* Discount */}
        <div className="my-auto py-5">
          <Label className="mx-1">{tInvoicing('quotation.attributes.discount')}</Label>
          <div className="flex items-center gap-2">
            {edit ? (
              <FieldBuilder
                field={{
                  id: 'discount',
                  className: 'w-1/2',
                  variant: FieldVariant.TEXT,
                  placeholder: '0',
                  props: {
                    value: String(article.discount || ''),
                    onChange: (v: string) => handleDiscountChange({ target: { value: v } } as any)
                  }
                }}
              />
            ) : (
              <FieldBuilder
                field={{
                  id: 'discount_ro',
                  className: 'w-1/2',
                  variant: FieldVariant.TEXT,
                  props: { value: String(article.discount || '0'), disabled: true }
                }}
              />
            )}
            {edit ? (
              <FieldBuilder
                field={{
                  id: 'discount_type',
                  className: 'w-1/2',
                  variant: FieldVariant.SELECT,
                  props: {
                    value: article.discount_type === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT',
                    onValueChange: handleDiscountTypeChange,
                    options: [
                      { value: 'PERCENTAGE', label: '%' },
                      { value: 'AMOUNT', label: currency?.symbol || '$' }
                    ]
                  }
                }}
              />
            ) : (
              <FieldBuilder
                field={{
                  id: 'discount_type_ro',
                  className: 'w-1/2 font-bold mx-1',
                  variant: FieldVariant.TEXT,
                  props: {
                    value: article.discount_type === DISCOUNT_TYPE.PERCENTAGE ? '%' : currency?.symbol || '$',
                    disabled: true
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="w-2/12 text-center flex flex-col justify-between h-full gap-12 mx-4">
        <div className="flex flex-col gap-2 my-auto">
          <Label className="font-bold mx-1">{tInvoicing('article.attributes.tax_excluded')}</Label>
          <Label>
            {article?.subTotal?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
        <div className="flex flex-col gap-2 my-auto">
          <Label className="font-bold mx-1">{tInvoicing('article.attributes.tax_included')}</Label>
          <Label>
            {article?.total?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};