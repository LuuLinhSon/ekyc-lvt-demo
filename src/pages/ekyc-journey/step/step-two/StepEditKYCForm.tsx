import { Button, FormControl, FormHelperText, MenuItem, Select, TextField } from '@material-ui/core';
import { Form, withFormik, FormikBag } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import './StepEditKycForm.scss';

const EditKYCForm: React.FC<any> = (props) => {
  const { values, handleSubmit, setFieldValue, setValues, errors } = props;
  const [stateAuthentication] = useAuthentication();

  const userInformation = stateAuthentication?.ocrInformation;
  const [validation, setValidation] = useState({
    uniqueValue: {
      error: userInformation.idConfidence,
      textError: userInformation.idConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
    dateOfIssue: {
      error: userInformation.issueDateConfidence,
      textError: userInformation.issueDateConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
    placeOfIssue: {
      error: userInformation.signConfidence,
      textError: userInformation.signConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
    gender: {
      error: userInformation.sexConfidence,
      textError: userInformation.sexConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
    birthDate: {
      error: userInformation.brithDayConfidence,
      textError: userInformation.brithDayConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
    city: {
      error: userInformation.provinceConfidence,
      textError: userInformation.provinceConfidence ? 'Vui lòng kiểm tra lại' : '',
    },
  });

  const onHandleChange = (name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue(name, event.currentTarget.value);
  };

  const onHandleChangeDropdown = (name: string, event: any) => {
    console.log('event', event);
    setFieldValue(name, event.target.value);
  };

  const onBlur = (name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValidation({
      ...validation,
      [name]: {
        error: false,
        textError: '',
      },
    });
  };

  useEffect(() => {
    setValues({
      fullName: get(userInformation, 'name', ''),
      uniqueValue: get(userInformation, 'id', ''),
      dateOfIssue: get(userInformation, 'issueDate', ''),
      placeOfIssue: get(userInformation, 'sign', ''),
      birthDate: get(userInformation, 'brithDay', ''),
      gender: get(userInformation, 'sex', ''),
      email: '',
      addressLine: get(userInformation, 'provinceDetail.street', ''),
      city: get(userInformation, 'provinceDetail.city', ''),
      district:get(userInformation, 'provinceDetail.district', ''),
      precinct: get(userInformation, 'provinceDetail.precinct', ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('errors', errors);
  

  return (
    <Form>
      <div className="container">
        <div className="d-flex justify-content-center mb-5">
          <span className="font-weight-bold">Bước 2-4</span>: Vui lòng kiểm tra và xác nhận thông tin cơ bản
        </div>
        <div className="form-container">
          <div className="header-container">
            <span className="header-container-header-text font-weight-bold">Thông tin cơ bản</span>
          </div>
          <span className="field-name mt-3">Số chứng minh/Thẻ căn cước</span>
          <TextField
            value={values?.uniqueValue}
            required={true}
            className="text-field"
            id="uniqueValue"
            variant="outlined"
            name="uniqueValue"
            onFocus={(e) => onBlur('uniqueValue', e)}
            onChange={(e) => onHandleChange('uniqueValue', e)}
            error={validation?.uniqueValue?.error || errors.uniqueValue === 'Required'}
            helperText={validation?.uniqueValue?.textError || errors.uniqueValue}
          />
          <div className="block-row">
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Ngày cấp</span>
              <TextField
                value={values?.dateOfIssue}
                required={true}
                className="text-field"
                id="dateOfIssue"
                variant="outlined"
                name="dateOfIssue"
                onChange={(e) => onHandleChange('dateOfIssue', e)}
                onFocus={(e) => onBlur('dateOfIssue', e)}
                error={validation?.dateOfIssue?.error || errors.dateOfIssue === 'Required'}
                helperText={validation?.dateOfIssue?.textError || errors.dateOfIssue}
              />
            </div>
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Nơi cấp</span>
              <TextField
                value={values?.placeOfIssue}
                required={true}
                className="text-field"
                id="placeOfIssue"
                variant="outlined"
                name="placeOfIssue"
                onChange={(e) => onHandleChange('placeOfIssue', e)}
                onFocus={(e) => onBlur('placeOfIssue', e)}
                error={validation?.placeOfIssue?.error || errors.placeOfIssue === 'Required'}
                helperText={validation?.placeOfIssue?.textError || errors.placeOfIssue}
              />
            </div>
          </div>
          <div className="block-row">
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Giới tính</span>
              <FormControl variant="outlined" fullWidth={true} error={validation?.gender?.error || errors.gender === 'Required'}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={values?.gender}
                  onChange={(e) => onHandleChangeDropdown('gender', e)}
                  label="Age"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={'Nam'}>Nam</MenuItem>
                  <MenuItem value={'Nữ'}>Nữ</MenuItem>
                </Select>
                <FormHelperText>{validation?.gender?.textError || errors.gender}</FormHelperText>
              </FormControl>
            </div>
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Ngày sinh</span>
              <TextField
                value={values?.birthDate}
                required={true}
                className="text-field"
                id="birthDate"
                variant="outlined"
                name="birthDate"
                onChange={(e) => onHandleChange('birthDate', e)}
                onFocus={(e) => onBlur('birthDate', e)}
                error={validation?.birthDate?.error || errors.birthDate === 'Required'}
                helperText={validation?.birthDate?.textError || errors.birthDate}
              />
            </div>
          </div>
          <span className="field-name mt-3">Email</span>
          <TextField
            value={values?.email}
            required={true}
            className="text-field"
            id="email"
            variant="outlined"
            name="email"
            onChange={(e) => onHandleChange('email', e)}
          />
          <div className="header-container mt-3">
            <span className="header-container-header-text font-weight-bold">Địa chỉ thường trú</span>
          </div>
          <span className="field-name mt-3">Tỉnh/Thành phố</span>
          <TextField
            value={values?.city}
            required={true}
            className="text-field"
            id="city"
            variant="outlined"
            name="city"
            onChange={(e) => onHandleChange('city', e)}
            onFocus={(e) => onBlur('city', e)}
            error={validation?.city?.error || errors.city === 'Required'}
            helperText={validation?.city?.textError || errors.city}
          />
          <div className="block-row">
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Quận/Huyện</span>
              <TextField
                value={values?.district}
                required={true}
                className="text-field"
                id="district"
                variant="outlined"
                name="district"
                onChange={(e) => onHandleChange('district', e)}
                error={errors.district === 'Required'}
                helperText={errors.district}
              />
            </div>
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Phường/Xã</span>
              <TextField
                value={values?.precinct}
                required={true}
                className="text-field"
                id="precinct"
                variant="outlined"
                name="precinct"
                onChange={(e) => onHandleChange('precinct', e)}
                error={errors.precinct === 'Required'}
                helperText={errors.precinct}
              />
            </div>
          </div>
          <span className="field-name mt-3">Nhập địa chỉ cụ thể</span>
          <TextField
            value={values?.addressLine}
            required={true}
            className="text-field"
            id="addressLine"
            variant="outlined"
            name="addressLine"
            onChange={(e) => onHandleChange('addressLine', e)}
          />

          <span className="field-name mt-3">{`Địa chỉ đầy đủ: ${values?.addressLine || ''}, ${values?.precinct} - ${
            values?.district
          } - ${values?.city}
          `}</span>
        </div>
        <Button
          disabled={!isEmpty(errors)}
          className="next-button"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
        >
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

const StepEditKYCForm = withFormik<any, any>({
  enableReinitialize: true,
  mapPropsToValues: () => ({
    uniqueValue: '',
    dateOfIssue: '',
    placeOfIssue: '',
    birthDate: '',
    gender: '',
    email: '',
    addressLine: '',
    city: '',
    district: '',
    precinct: '',
  }),
  validate: values => {
    const errors: any = {};

    if (values.uniqueValue === '') {
      errors.uniqueValue = 'Required';
    }
    if (values.dateOfIssue === '') {
      errors.dateOfIssue = 'Required';
    }
    if (values.placeOfIssue === '') {
      errors.placeOfIssue = 'Required';
    }
    if (values.birthDate === '') {
      errors.birthDate = 'Required';
    }
    if (values.gender === '') {
      errors.gender = 'Required';
    }
    if (values.city === '') {
      errors.city = 'Required';
    }
    if (values.district === '') {
      errors.district = 'Required';
    }
    if (values.precinct === '') {
      errors.precinct = 'Required';
    }

    return errors;
  },
  handleSubmit: onSubmit,
})(EditKYCForm);

export default StepEditKYCForm;
