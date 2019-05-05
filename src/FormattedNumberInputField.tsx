import React, { useCallback, InputHTMLAttributes, useMemo } from "react";
import { connect } from "formik";
import {
  FormattedNumberInput,
  FormattedNumberInputProps,
  InputRequiredProps
} from "./FormattedNumberInput";

export type FormattedNumberInputFieldProps<
  P extends InputRequiredProps = InputHTMLAttributes<HTMLInputElement>
> = {
  name: string;
} & Pick<
  FormattedNumberInputProps<P>,
  Exclude<keyof FormattedNumberInputProps<P>, "onBlur" | "onValueChange">
>;

const FormattedNumberInputFieldConnected = connect<
  FormattedNumberInputFieldProps<any>
>(({ name, formik, ...props }) => {
  const handleValueChange = useCallback(
    (value: number | null | undefined) => formik.setFieldValue(name, value),
    [name, formik.setFieldValue]
  );

  return (
    <FormattedNumberInput<any>
      name={name}
      {...props}
      onValueChange={handleValueChange}
      onBlur={formik.handleBlur}
    />
  );
});

export default function FormattedNumberInputField<P>(
  props: FormattedNumberInputFieldProps<P>
) {
  return <FormattedNumberInputFieldConnected {...props} />;
}
