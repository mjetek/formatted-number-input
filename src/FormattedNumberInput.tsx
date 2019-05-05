import React, {
  useCallback,
  useState,
  useMemo,
  ChangeEvent,
  useEffect,
  FocusEvent,
  InputHTMLAttributes
} from "react";

export type InputRequiredProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur"
>;

export type FormattedNumberInputProps<P extends InputRequiredProps> = P & {
  locales?: string | string[];
  component?: React.ComponentType<any>;
  numberStyle?: "decimal" | "currency" | "percent";
  currency?: string;
  currencyDisplay?: "symbol" | "code" | "name";
  maximumFractionDigits?: number;
  maximumSignificantDigits?: number;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  minimumSignificantDigits?: number;
  value?: number | null;
  onValueChange: (value: number | null | undefined) => void;
};

export function FormattedNumberInput<
  P extends InputRequiredProps = InputHTMLAttributes<HTMLInputElement>
>({
  locales,
  component,
  numberStyle,
  currency,
  currencyDisplay,
  maximumFractionDigits,
  maximumSignificantDigits,
  minimumIntegerDigits,
  minimumFractionDigits,
  minimumSignificantDigits,
  value: propsValue,
  onValueChange,
  onBlur: inputOnBlur,
  onChange: inputOnChange,
  ...inputProps
}: FormattedNumberInputProps<P>) {
  const [formattedValue, setFormattedValue] = useState("");
  const [valueAsNumber, setValueAsNumber] = useState<number | null | undefined>(
    null
  );

  const numberFormat = useMemo(() => {
    return new Intl.NumberFormat(locales, {
      style: numberStyle,
      currency,
      currencyDisplay,
      maximumFractionDigits,
      maximumSignificantDigits,
      minimumIntegerDigits,
      minimumFractionDigits,
      minimumSignificantDigits
    });
  }, [
    locales,
    numberStyle,
    currency,
    currencyDisplay,
    maximumFractionDigits,
    maximumSignificantDigits,
    minimumIntegerDigits,
    minimumFractionDigits,
    minimumSignificantDigits
  ]);

  const thousandSeparator = useMemo(
    () => numberFormat.format(1111).replace(/1/g, ""),
    [numberFormat]
  );
  const decimalSeparator = useMemo(
    () => numberFormat.format(1.1).replace(/1/g, ""),
    [numberFormat]
  );

  const unformat = useCallback(
    (value: string) => {
      let parsedValue = Number.parseFloat(
        value
          .replace(new RegExp("\\" + thousandSeparator, "g"), "")
          .replace(new RegExp("\\" + decimalSeparator), ".")
      );
      if (numberStyle === "percent") {
        parsedValue /= 100;
      }
      return Number.isNaN(parsedValue) ? null : parsedValue;
    },
    [numberStyle, thousandSeparator, decimalSeparator]
  );

  const format = useCallback(
    valueAsNumber =>
      valueAsNumber == null ? "" : numberFormat.format(valueAsNumber),
    [numberFormat]
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormattedValue(value);
      setValueAsNumber(unformat(value));
      if (inputOnChange != null) {
        inputOnChange(event);
      }
    },
    [setFormattedValue, setValueAsNumber, unformat, inputOnChange]
  );

  const onBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setFormattedValue(format(valueAsNumber));
      if (inputOnBlur != null) {
        inputOnBlur(event);
      }
    },
    [setFormattedValue, format, valueAsNumber, inputOnBlur]
  );

  useEffect(() => {
    setFormattedValue(format(propsValue));
    setValueAsNumber(propsValue);
  }, [propsValue, format]);

  useEffect(() => {
    onValueChange(valueAsNumber);
  }, [valueAsNumber, onValueChange]);

  if (component != null) {
    const InputComponent = component;
    const x = {
      value: formattedValue,
      onChange,
      onBlur,
      ...inputProps
    };
    return <InputComponent {...x} />;
  }

  return (
    <input
      {...inputProps}
      value={formattedValue}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
}
