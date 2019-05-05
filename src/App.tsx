import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Input, InputProps } from "reactstrap";
import { FormattedNumberInput } from "./FormattedNumberInput";
import { Formik, Form, ErrorMessage } from "formik";
import FormattedNumberInputField from "./FormattedNumberInputField";

const App: React.FC = () => {
  const [val, setVal] = useState();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Value: <strong>{val}</strong>
        </p>
        <Formik
          initialValues={{
            x: 0.45
          }}
          onSubmit={values => console.log(values)}
          validate={values => {
            if (values.x == null) {
              return {
                x: "cannot be empty"
              };
            }
            if (values.x < 0.5) {
              return { x: "must be at least half" };
            }
            return {};
          }}
        >
          {props => (
            <Form>
              <FormattedNumberInputField<InputProps>
                name="x"
                locales="en-us"
                component={Input}
                numberStyle="percent"
                maximumFractionDigits={2}
                minimumFractionDigits={2}
                bsSize="xs"
              />
              <ErrorMessage name="x" />
            </Form>
          )}
        </Formik>
        <FormattedNumberInput<InputProps>
          name="Y"
          locales="en-us"
          component={Input}
          numberStyle="percent"
          maximumFractionDigits={2}
          minimumFractionDigits={2}
          onValueChange={v => setVal(v)}
          bsSize="sm"
        />
      </header>
    </div>
  );
};

export default App;
