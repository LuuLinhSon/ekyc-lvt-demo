import { Button, FormControl, FormHelperText, MenuItem, Select, TextField } from '@material-ui/core';
import { Form, withFormik, FormikBag } from 'formik';
import { get, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import API from 'api';
import useAuthentication from 'stores/AuthenticationStore/authentication';
import { AuthenticationStates } from 'stores/AuthenticationStore/authenticationType';
import './StepEditKycForm.scss';
import { useStoreAPI } from 'api/storeAPI';
import { notify } from 'components/toast/Toast';

const convertDateInput = (date: string) => {
  const [day, month, year] = date.split('/');

  return `${year}-${month}-${day}`;
};

const YYYYMMDDHHMMSS = () => {
  const date = new Date();
  const yyyy = date.getFullYear().toString();
  const MM = pad(date.getMonth() + 1, 2);
  const dd = pad(date.getDate(), 2);
  const hh = pad(date.getHours(), 2);
  const mm = pad(date.getMinutes(), 2);
  const ss = pad(date.getSeconds(), 2);
  const ms = pad(date.getMilliseconds(), 3);

  return `${yyyy}${MM}${dd}${hh}${mm}${ss}.${ms}`;
};

const getDate = () => {
  return YYYYMMDDHHMMSS();
};

const pad = (num: any, length: any) => {
  let str = `${num}`;
  while (str.length < length) {
    str = `0${str}`;
  }
  return str;
};

export const getListArea = async (stateAuthentication: AuthenticationStates) => {
  const timestamp = new Date().getTime();
  const clientTime = getDate();
  const headers = {
    'Access-Control-Allow-Origin': '*',
  };
  const listAreaResponse = await API({
    url: 'https://ekycsandbox.lienviettech.vn/lv24/rest/web/request',
    method: 'POST',
    headers,
    data: {
      clientHeader: {
        language: 'VN',
        clientRequestId: `${timestamp}`,
        deviceId: 'TESTDEMO',
        clientAddress: '192.168.201.140',
        platform: 'LOCAL',
        function: 'getListArea',
      },
      body: {
        header: {
          platform: 'LOCAL',
          clientRequestId: `${timestamp}`,
          clientTime,
          zonedClientTime: `${timestamp}`,
          channelCode: 'WEBVIVIET',
          deviceId: 'TESTDEMO',
          sessionId: stateAuthentication.session.sessionId,
          userId: stateAuthentication.session.userId,
          authorizedMode: 0,
          checkerMode: 0,
          ip: '192.168.201.140',
          makerId: 'SONLL',
          language: 'VN',
        },
      },
    },
  });

  return listAreaResponse;
};

const getParentCode = (parentValue: string, listParent: any, forDistrict: boolean) => {
  const parent: any = listParent.find((item: any) =>
    forDistrict ? item.provinceName === parentValue : item.districtName === parentValue,
  );
  return parent?.areaCode;
};

const mapCardTypeToValue = (cardType: string) => {
  switch (cardType) {
    case 'OLD ID':
      return 'CMND 9 số';
    case 'NEW ID':
      return 'CCCD 12 số';
    case 'CHIP ID':
      return 'CCCD gắn chip';
    case 'PASSPORT':
      return 'Hộ Chiếu';
    default:
      return '';
  }
};

const EditKYCForm: React.FC<any> = (props) => {
  const { values, handleSubmit, setFieldValue, setValues, errors } = props;
  const [stateAuthentication] = useAuthentication();
  const [, actionStoreAPI] = useStoreAPI();
  const [listCity, setListCity] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listPrecinct, setListPrecinct] = useState([]);
  const [currentCityCode, setCurrentCityCode] = useState(null);
  const [currentDistrictCode, setCurrentDistrictCode] = useState(null);

  const userInformation = stateAuthentication?.ocrInformation;
  const cityCode = userInformation.provinceCode;
  const districtCode = userInformation.districtCode;
  const wardCode = userInformation.precinctCode;
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
    if (name === 'city') {
      setFieldValue('district', '');
      setFieldValue('precinct', '');
    }

    if (name === 'district') {
      setFieldValue('precinct', '');
    }

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
    const initForm = async function () {
      try {
        actionStoreAPI.setFetching(true);
        const response = await getListArea(stateAuthentication);
        const listArea = get(response, 'body.area', []);
        const listCity = listArea.filter((item) => item.areaType === 'P');
        const listDistrict = listArea
          .filter((item) => item.areaType === 'D')
          .map((item) => {
            return { ...item, districtName: item?.districtName?.replace('H.', '') };
          });
        const listPrecinct = listArea
          .filter((item) => item.areaType === 'C')
          .map((item) => {
            return { ...item, precinctName: item?.precinctName?.replace('Xã ', '') };
          });

        setListCity(listCity);
        setListDistrict(listDistrict);
        setListPrecinct(listPrecinct);
        setCurrentCityCode(getParentCode(get(userInformation, 'provinceDetail.city', ''), listCity, true));
        setCurrentDistrictCode(getParentCode(get(userInformation, 'provinceDetail.district', ''), listDistrict, false));
      } catch (e) {
        notify.error('Đã có lỗi xảy ra. Vui lòng tải lại trang');
      } finally {
        actionStoreAPI.setFetching(false);
      }
    };
    initForm();
    setValues({
      address: get(userInformation, 'address', ''),
      cardType: get(userInformation, 'cardType', ''),
      fullName: get(userInformation, 'name', ''),
      uniqueValue: get(userInformation, 'id', ''),
      dateOfIssue: convertDateInput(get(userInformation, 'issueDate', '')),
      placeOfIssue: get(userInformation, 'sign', ''),
      birthDate: convertDateInput(get(userInformation, 'brithDay', '')),
      gender: get(userInformation, 'sex', ''),
      email: '',
      addressLine: get(userInformation, 'provinceDetail.streetName', ''),
      city: get(userInformation, 'provinceDetail.city', ''),
      district: get(userInformation, 'provinceDetail.district', ''),
      precinct: get(userInformation, 'provinceDetail.precinct', ''),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentCityCode(getParentCode(values.city, listCity, true));
    setCurrentDistrictCode(getParentCode(values.district, listDistrict, false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

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
          <span className="field-name mt-3">Loại</span>
          <TextField
            value={mapCardTypeToValue(values?.cardType)}
            required={true}
            className="text-field"
            id="cardType"
            variant="outlined"
            name="cardType"
            onChange={(e) => onHandleChange('cardType', e)}
          />
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
                type="date"
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
              <FormControl
                variant="outlined"
                fullWidth={true}
                error={validation?.gender?.error || errors.gender === 'Required'}
              >
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
                type="date"
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
          {!isEmpty(cityCode) && <div className="field-name my-3">{`Mã thành phố: ${cityCode}`}</div>}
          <span className="field-name mt-1">Tỉnh/Thành phố</span>
          <FormControl
            variant="outlined"
            fullWidth={true}
            error={validation?.city?.error || errors.city === 'Required'}
          >
            <Select
              labelId="demo-simple-select-outlined-label"
              id="city"
              value={values?.city}
              onChange={(e) => onHandleChangeDropdown('city', e)}
              label="Thành phố"
              name="city"
              onFocus={(e) => onBlur('city', e)}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {listCity.map((item: any, idx: number) => {
                return <MenuItem key={idx} value={item.provinceName}>{`${item.provinceName}`}</MenuItem>;
              })}
            </Select>
            <FormHelperText>{validation?.city?.textError || errors.city}</FormHelperText>
          </FormControl>
          <div className="block-row">
            <div className="w-50 pr-2">
              {!isEmpty(districtCode) && <div className="field-name mt-3">{`Mã Quận/Huyện: ${districtCode}`}</div>}
              <span className="field-name mt-1">Quận/Huyện</span>
              <FormControl variant="outlined" fullWidth={true} error={errors.district === 'Required'}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="district"
                  value={values?.district}
                  onChange={(e) => onHandleChangeDropdown('district', e)}
                  label="Quận huyện"
                  name="district"
                  onFocus={(e) => onBlur('district', e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {values?.city !== '' &&
                    listDistrict
                      .filter((item: any) => item.parentCode === currentCityCode)
                      .map((item: any, idx: number) => {
                        return <MenuItem key={idx} value={item.districtName}>{`${item.districtName}`}</MenuItem>;
                      })}
                </Select>
                <FormHelperText>{errors.district}</FormHelperText>
              </FormControl>
            </div>
            <div className="flex-column w-50 pr-2">
              {!isEmpty(wardCode) && <div className="field-name mt-3">{`Mã Phường/Xã: ${wardCode}`}</div>}
              <span className="field-name mt-1">Phường/Xã</span>
              <FormControl variant="outlined" fullWidth={true} error={errors.precinct === 'Required'}>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="precinct"
                  value={values?.precinct}
                  onChange={(e) => onHandleChangeDropdown('precinct', e)}
                  label="Phường xã"
                  name="precinct"
                  onFocus={(e) => onBlur('precinct', e)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {values?.district !== '' &&
                    listPrecinct
                      .filter((item: any) => item.parentCode === currentDistrictCode)
                      .map((item: any, idx: number) => {
                        return <MenuItem key={idx} value={item.precinctName}>{`${item.precinctName}`}</MenuItem>;
                      })}
                </Select>
                <FormHelperText>{errors.precinct}</FormHelperText>
              </FormControl>
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
          <span className="field-name mt-3">{`Địa chỉ đầy đủ: ${values?.addressLine || ''} ${values?.precinct} - ${
            values?.district
          } - ${values?.city}
          `}</span>

          <span className="field-name mt-3">Địa chỉ đầy đủ trên giấy tờ</span>
          <TextField
            value={values?.address}
            required={true}
            className="text-field"
            id="address"
            variant="outlined"
            name="address"
            onChange={(e) => onHandleChange('address', e)}
          />
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
    address: '',
    cardType: '',
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
})(EditKYCForm);

export default StepEditKYCForm;
