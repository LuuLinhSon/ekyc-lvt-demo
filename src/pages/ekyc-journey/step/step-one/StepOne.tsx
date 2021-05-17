import { Button, TextField } from '@material-ui/core';
import { Form, withFormik, FormikBag } from 'formik';
import RoutesString from 'pages/routesString';
import React from 'react';
import { useHistory } from 'react-router-dom';
import useStepperStore from 'stores/StepperStore/stepper';
import './StepOne.scss';

const StepOne: React.FC<any> = (props) => {
  const { values, handleSubmit, setFieldValue } = props;
  const history = useHistory();
  const [, actionStepper] = useStepperStore();
  const nextToStep = () => {
    history.push(RoutesString.StepTwo);
    actionStepper.nextStep();
  };

  const onHandleChange = (name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue(name, event.currentTarget.value);
  };

  const disabled: () => boolean = () => {
    return values?.password === '' || values?.phone === '';
  };

  const next = () => {
    handleSubmit();
    nextToStep();
  };

  return (
    <Form>
      <div className="container">
        <div className="d-flex justify-content-center mb-5">
          <span className="font-weight-bold">Bước 1</span>: Nhập thông tin cơ bản
        </div>
        <div className="form-container">
          <span className="field-name">Nhập số điện thoại</span>
          <TextField
            value={values?.phone}
            required={true}
            className="text-field"
            id="phone"
            variant="outlined"
            name="phone"
            onChange={(e) => onHandleChange('phone', e)}
          />

          <span className="field-name mt-5">Nhập password</span>
          <TextField
            value={values?.password}
            required={true}
            className="text-field"
            id="password"
            variant="outlined"
            name="password"
            onChange={(e) => onHandleChange('password', e)}
          />
        </div>
        <Button disabled={disabled()} className="next-button" variant="contained" color="primary" onClick={next}>
          Tiếp tục
        </Button>
      </div>
    </Form>
  );
};

export const onSubmit = (values: any, { setErrors, props, setSubmitting }: FormikBag<any, any>) => {
  try {
    setSubmitting(true);
    props.handleSubmit(values);
  } catch (e) {
    setSubmitting(false);
    setErrors(e);
  }
};

const StepOneForm = withFormik<any, any>({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    phone: '',
    password: '',
  }),
  handleSubmit: onSubmit,
})(StepOne);

export default StepOneForm;
