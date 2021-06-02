import { TextField } from '@material-ui/core';
import { Form, withFormik, FormikBag } from 'formik';
import { get } from 'lodash';
import React, { useEffect } from 'react';
import './UserInfoForm.scss';

const convertDateInput = (date: any) => {
  return new Date(date).toLocaleDateString('en-GB');
};

const UserInfoForm: React.FC<any> = (props) => {
  const { values, setFieldValue, setValues, dataFromServer } = props;

  const onHandleChange = (name: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFieldValue(name, event.currentTarget.value);
  };

  useEffect(() => {
    setValues({
      fullName: get(dataFromServer, 'fullName', ''),
      uniqueValue: get(dataFromServer, 'identifier', ''),
      dateOfIssue: convertDateInput(get(dataFromServer, 'issuedDate', '')),
      placeOfIssue: get(dataFromServer, 'issuedLocation', ''),
      birthDate: convertDateInput(get(dataFromServer, 'dob', '')),
      gender: get(dataFromServer, 'gender', ''),
      email: get(dataFromServer, 'email', ''),
      addressLine: get(dataFromServer, 'addressLine', ''),
      city: get(dataFromServer, 'addressLevel3', ''),
      district: get(dataFromServer, 'addressLevel2', ''),
      precinct: get(dataFromServer, 'addressLevel1', ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValues({
      fullName: get(dataFromServer, 'fullName', ''),
      uniqueValue: get(dataFromServer, 'identifier', ''),
      dateOfIssue: convertDateInput(get(dataFromServer, 'issuedDate', '')),
      placeOfIssue: get(dataFromServer, 'issuedLocation', ''),
      birthDate: convertDateInput(get(dataFromServer, 'dob', '')),
      gender: get(dataFromServer, 'gender', ''),
      email: get(dataFromServer, 'email', ''),
      addressLine: get(dataFromServer, 'addressLine', ''),
      city: get(dataFromServer, 'addressLevel3', ''),
      district: get(dataFromServer, 'addressLevel2', ''),
      precinct: get(dataFromServer, 'addressLevel1', ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFromServer]);

  return (
    <Form>
      <div className="container">
        <div className="form-container">
          <div className="header-container">
            <span className="header-container-header-text font-weight-bold">Thông tin cá nhân</span>
          </div>
          <span className="field-name mt-3">Số chứng minh/Thẻ căn cước</span>
          <TextField
            value={values?.uniqueValue}
            required={true}
            className="text-field"
            id="uniqueValue"
            variant="outlined"
            name="uniqueValue"
            onChange={(e) => onHandleChange('uniqueValue', e)}
            disabled={true}
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
                disabled={true}
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
                disabled={true}
              />
            </div>
          </div>
          <div className="block-row">
            <div className="w-50 pr-2">
              <span className="field-name mt-5">Giới tính</span>
              <TextField
                value={values?.gender}
                required={true}
                className="text-field"
                id="gender"
                variant="outlined"
                name="gender"
                onChange={(e) => onHandleChange('gender', e)}
                disabled={true}
              />
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
                disabled={true}
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
            disabled={true}
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
            disabled={true}
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
                disabled={true}
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
                disabled={true}
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
            disabled={true}
          />

          <span className="field-name mt-3">{`Địa chỉ đầy đủ: ${values?.addressLine || ''}, ${values?.precinct} - ${
            values?.district
          } - ${values?.city}
          `}</span>
        </div>
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

const UserInfoFormCall = withFormik<any, any>({
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
  validate: (values) => {
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
})(UserInfoForm);

export default UserInfoFormCall;
