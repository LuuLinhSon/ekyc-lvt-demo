import {
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  withStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import API from 'api';

import './OrcFace.scss';
import { useStoreAPI } from 'api/storeAPI';
import { get } from 'lodash';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: '#696969',
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }),
)(TableCell);

export const checkOrcImage = async (image: string) => {
  const headers = {
    'api-key': '7c8ba773-64cd-4ba5-a9bd-f035f06d0149',
  };
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/ocr',
    method: 'POST',
    headers,
    data: {
      image,
    },
  });
  return response;
};

export const checkOrcQualityImage = async (image: string, isFront: boolean, document: string) => {
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/checkquality8006',
    method: 'POST',
    data: {
      image,
      case: isFront ? 'FrontCard' : 'BackCard',
      document,
    },
  });
  return response;
};

export const checkFaceAttributes = async (image: string) => {
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/faceattr',
    method: 'POST',
    data: {
      image,
    },
  });
  return response;
};

export const checkFaceLiveness = async (image: string) => {
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/antispoof',
    method: 'POST',
    data: {
      image,
    },
  });
  return response;
};

const mapBrightnessToValue = (brightness: string) => {
  switch (brightness) {
    case 'Dark':
      return 'T???i';
    case 'Maybe_Dark':
      return 'Nghi ng??? t???i';
    case 'Normal':
      return 'B??nh th?????ng';
    case 'Maybe_Light':
      return 'Nghi ng??? ch??i';
    case 'Light':
      return 'Ch??i';
    default:
      return '';
  }
};

const mapCardTypeToValue = (cardType: string) => {
  switch (cardType) {
    case 'OLD ID':
      return 'CMND 9 s???';
    case 'NEW ID':
      return 'CCCD 12 s???';
    case 'CHIP ID':
      return 'CCCD g???n chip';
    case 'PASSPORT':
      return 'H??? Chi???u';
    case 'CCCD':
      return 'CCCD';
    default:
      return '';
  }
};

interface RowOrcInterface {
  src: any;
  cardType: string;
  isCorner: boolean;
  isPunch: boolean;
  isPhotocopy: boolean;
  isFake: boolean;
  brightness: string;
  isBlur: boolean;
}

interface RowFaceInterface {
  src: any;
  isStraightFace: boolean;
  isMask: boolean;
  isGlasses: boolean;
  isHand: boolean;
  isDark: boolean;
  isLight: boolean;
  isBlur: boolean;
  isFake: boolean;
}

const OrcFace: React.FC<any> = (props) => {
  const classes = useStyles();
  const [radio, setRadio] = useState('cmnd');
  const [images, setImages] = useState([]);
  const [, actionStoreAPI] = useStoreAPI();
  const [rows, setRows] = useState<RowOrcInterface[] | []>([]);
  const [rowsFace, setRowsFace] = useState<RowFaceInterface[] | []>([]);
  const maxNumber = 69;

  const handleChange = (event: any) => {
    const value = event.target.value;
    setRadio(value);
  };

  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const removeAll = (onImageRemoveAll: () => void) => {
    onImageRemoveAll();
    setRows([]);
    setRowsFace([]);
  };

  const onCheckImage = async () => {
    const image: any = images[0];
    const base64 = image?.data_url?.split(',')[1] || '';

    try {
      actionStoreAPI.setFetching(true);
      const responseCheckOrc = await checkOrcImage(base64);
      const id = get(responseCheckOrc, 'id', '');
      const document = get(responseCheckOrc, 'document', '');
      const responseCheckOrcQuality = await checkOrcQualityImage(base64, id !== 'N/A', document);
      const isCorner = get(responseCheckOrc, 'id_check', '') === 'CORNER';
      const isPhotocopy = get(responseCheckOrc, 'id_check', '') === 'BW';
      const isFake = get(responseCheckOrc, 'id_check', '') === 'FAKE';
      const isPunch = get(responseCheckOrc, 'id_check', '') === 'PUNCH';
      const brightness = get(responseCheckOrcQuality, 'Brightness', '');
      const isBlur = get(responseCheckOrcQuality, 'Blur', '');

      setRows([
        {
          src: image?.data_url,
          cardType: get(responseCheckOrc, 'document', ''),
          isCorner,
          brightness,
          isBlur,
          isPhotocopy,
          isFake,
          isPunch,
        },
      ]);
    } catch (e) {
    } finally {
      actionStoreAPI.setFetching(false);
    }
  };

  const onCheckFace = async () => {
    const image: any = images[0];
    const base64 = image?.data_url?.split(',')[1] || '';

    try {
      actionStoreAPI.setFetching(true);
      const responseFaceAttributes = await checkFaceAttributes(base64);
      const responseFaceLiveness = await checkFaceLiveness(base64);
      const faceAttributes = responseFaceAttributes[0];
      const isStraightFace = get(faceAttributes, 'isStraightFace', '');
      const isMask = get(faceAttributes, 'mask', '');
      const isGlasses = get(faceAttributes, 'glasses', '');
      const isHand = get(faceAttributes, 'hand', '');
      const isDark = get(faceAttributes, 'isDark', '');
      const isLight = get(faceAttributes, 'isLight', '');
      const isBlur = !get(faceAttributes, 'isNotBlur', '');
      const isFake = get(responseFaceLiveness, 'is_fake', '');

      setRowsFace([
        {
          src: image?.data_url,
          isStraightFace,
          isMask,
          isGlasses,
          isHand,
          isDark,
          isLight,
          isBlur,
          isFake,
        },
      ]);
    } catch (e) {
    } finally {
      actionStoreAPI.setFetching(false);
    }
  };

  return (
    <div className="container-orc">
      <RadioGroup row={true} aria-label="orc" name="orc1" value={radio} onChange={handleChange}>
        <FormControlLabel value="cmnd" control={<Radio />} label="CMND/CCCD" />
        <FormControlLabel value="face" control={<Radio />} label="Khu??n m???t" />
      </RadioGroup>
      <ImageUploading multiple={true} value={images} onChange={onChange} maxNumber={maxNumber} dataURLKey="data_url">
        {({ imageList, onImageUpload, onImageRemoveAll, dragProps }) => (
          <>
            <div className="upload_image-wrapper">
              {images.length === 0 && (
                <Button
                  className="action-button"
                  variant="contained"
                  color="primary"
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Ch???n ???nh
                </Button>
              )}
              {images.length !== 0 && (
                <Button
                  className="action-button"
                  variant="contained"
                  color="primary"
                  onClick={() => removeAll(onImageRemoveAll)}
                  {...dragProps}
                >
                  X??a t???t c??? ???nh
                </Button>
              )}
            </div>
            <div className="wrapper-list-image">
              {imageList?.map((image, index) => {
                const nameFile = image.file?.name;
                return (
                  <div key={index} className="image-item">
                    <span>{nameFile}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </ImageUploading>
      {images.length !== 0 && (
        <Button
          className="action-button"
          variant="contained"
          color="primary"
          onClick={radio === 'cmnd' ? onCheckImage : onCheckFace}
        >
          Ki???m tra
        </Button>
      )}
      {radio === 'cmnd' ? (
        <TableContainer component={Paper} className="mt-5">
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  STT
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ???nh
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  Ki???u
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? c???t g??c
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  Photocopy
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? ?????c l???
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? l??m gi???
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ????? s??ng
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? m???
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 &&
                rows.map((row, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="d-flex justify-content-center">
                        <img src={row?.src} className="d-block" alt="LOGO_ALT" width="390" />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">{mapCardTypeToValue(row?.cardType)}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isCorner ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isPhotocopy ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isPunch ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isFake ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{mapBrightnessToValue(row?.brightness)}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isBlur ? 'C??' : 'Kh??ng'}</StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} className="mt-5">
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" className="font-weight-bold">
                  STT
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ???nh
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ???nh gi???
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  Ch???p th???ng m???t
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ??eo k??nh
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  ??eo kh???u trang
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  Tay che m???t
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? l??a
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? t???i
                </StyledTableCell>
                <StyledTableCell align="center" className="font-weight-bold">
                  B??? m???
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rowsFace.length > 0 &&
                rowsFace.map((row, idx) => (
                  <TableRow key={idx}>
                    <StyledTableCell align="center">{idx + 1}</StyledTableCell>
                    <StyledTableCell align="center">
                      <div className="d-flex justify-content-center">
                        <img src={row?.src} className="d-block" alt="LOGO_ALT" width="390" />
                      </div>
                    </StyledTableCell>
                    <StyledTableCell align="center">{row?.isFake ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isStraightFace ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isGlasses ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isMask ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isHand ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isLight ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isDark ? 'C??' : 'Kh??ng'}</StyledTableCell>
                    <StyledTableCell align="center">{row?.isBlur ? 'C??' : 'Kh??ng'}</StyledTableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default OrcFace;
