import { Button, FormControlLabel, makeStyles, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useState } from 'react';
import ImageUploading from 'react-images-uploading';
import API from 'api';

import { Col } from 'reactstrap';
import './OrcFace.scss';
import { useStoreAPI } from 'api/storeAPI';
import { get } from 'lodash';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const checkOrcImage = async (image: string) => {
  const headers = {
    'api-key': '7c8ba773-64cd-4ba5-a9bd-f035f06d0149',
  };
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/ocr',
    method: 'POST',
    headers,
    data: {
      image
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
      image
    },
  });
  return response;
};

export const checkFaceLiveness = async (image: string) => {
  const response = await API({
    url: 'https://ekycsandbox.lienviettech.vn/antispoof',
    method: 'POST',
    data: {
      image
    },
  });
  return response;
};

const mapBrightnessToValue = (brightness: string) => {
  switch (brightness) {
    case 'Dark': 
      return 'Tối';
    case 'Maybe_Dark': 
      return 'Nghi ngờ tối';
    case 'Normal':
      return 'Bình thường';
    case 'Maybe_Light':
      return 'Nghi ngờ chói';
    case 'Light':
      return 'Chói';  
    default: 
      return '';
  }
}

interface RowOrcInterface {
  src: any;
  isCorner: boolean;
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
  // const [stateOrc, setStateOrc] = useState('front');
  // const [document, setDocument] = useState('OLD_ID');
  const [images, setImages] = useState([]);
  const [, actionStoreAPI] = useStoreAPI();
  const [rows, setRows] = useState<RowOrcInterface[] | []>([]);
  const [rowsFace, setRowsFace] = useState<RowFaceInterface[] | []>([]);
  const maxNumber = 69;

  const handleChange = (event: any) => {
    const value = event.target.value;
    setRadio(value);
  }

  // const handleChangeFrontBack = (event: any) => {
  //   const value = event.target.value;
  //   setStateOrc(value);
  // };

  // const handleChangeDocument = (event: any) => {
  //   const value = event.target.value;
  //   setDocument(value);
  // }

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
      const document = get(responseCheckOrc, 'document', '').replaceAll(' ', '_');
      const responseCheckOrcQuality = await checkOrcQualityImage(base64, id !== 'N/A', document);
      const isCorner = get(responseCheckOrc, 'id_check', '') === 'CORNER';
      const isPhotocopy = get(responseCheckOrc, 'id_check', '') === 'BW';
      const isFake = get(responseCheckOrc, 'id_check', '') === 'FAKE';
      const brightness = get(responseCheckOrcQuality, 'Brightness', '');
      const isBlur = get(responseCheckOrcQuality, 'Blur', '');

      setRows([{
        src: image?.data_url,
        isCorner,
        brightness,
        isBlur,
        isPhotocopy,
        isFake
      }])      
    } catch(e) {} finally {
      actionStoreAPI.setFetching(false);
    }
  }

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

      setRowsFace([{
        src: image?.data_url,
        isStraightFace,
        isMask,
        isGlasses,
        isHand,
        isDark,
        isLight,
        isBlur,
        isFake,
      }])      
    } catch(e) {} finally {
      actionStoreAPI.setFetching(false);
    }
  }  

  return (
      <div className="container-orc">
        <Col md={4} sm={4}>
            <RadioGroup row aria-label="orc" name="orc1" value={radio} onChange={handleChange}>
              <FormControlLabel value="cmnd" control={<Radio />} label="CMND/CCCD" />
              <FormControlLabel value="face" control={<Radio />} label="Khuôn mặt" />
            </RadioGroup>
            {/* {
              radio === 'cmnd' && 
              <div className="filter-wrapper">
                <FormControl className="w-50 mr-2" variant="outlined">
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="case"
                    value={stateOrc}
                    onChange={handleChangeFrontBack}
                    name="case"
                  >
                    <MenuItem value="front">
                      <em>Mặt trước</em>
                    </MenuItem>
                    <MenuItem value="back">
                      <em>Mặt sau</em>
                    </MenuItem>
                  </Select>
                </FormControl>
                <FormControl className="w-50 mr-2" variant="outlined">
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="document"
                    value={document}
                    onChange={handleChangeDocument}
                    name="document"
                  >
                    <MenuItem value="OLD_ID">
                      <em>CMND cũ</em>
                    </MenuItem>
                    <MenuItem value="NEW_ID ">
                      <em>CCCD mới</em>
                    </MenuItem>
                    <MenuItem value="CHIP_ID ">
                      <em>CCCD gắn chip</em>
                    </MenuItem>
                    <MenuItem value="PASSPORT">
                      <em>Passport</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </div>
            } */}
            <ImageUploading
              multiple
              value={images}
              onChange={onChange}
              maxNumber={maxNumber}
              dataURLKey="data_url"
            >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              dragProps,
            }) => (
              <>
              <div className="upload_image-wrapper">
                {images.length === 0 &&
                <Button className="action-button" variant="contained" color="primary" onClick={onImageUpload} {...dragProps}>
                  Chọn ảnh
                </Button>
                }
                {images.length !== 0 &&
                <Button className="action-button" variant="contained" color="primary" onClick={() => removeAll(onImageRemoveAll)} {...dragProps}>
                  Xóa tất cả ảnh
                </Button>
                }
              </div>
              <div className="wrapper-list-image">
                  {imageList?.map((image, index) => {
                    const nameFile = image.file?.name;
                    return <div key={index} className="image-item">
                      <span>{nameFile}</span>
                    </div>
                  })}
                </div>
              </>
            )}
            </ImageUploading>
            {images.length !== 0 &&
            <Button className="action-button" variant="contained" color="primary" onClick={radio === 'cmnd' ? onCheckImage : onCheckFace}>
              Kiểm tra
            </Button>
            }
        </Col>
        <Col md={8} sm={8}>
          {
            radio === 'cmnd' ? (
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="font-weight-bold">STT</TableCell>
                      <TableCell align="center" className="font-weight-bold">Ảnh</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị cắt góc</TableCell>
                      <TableCell align="center" className="font-weight-bold">Photocopy</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị làm giả</TableCell>
                      <TableCell align="center" className="font-weight-bold">Độ sáng</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị mờ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.length > 0 && rows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell align="center">
                        <div className="d-flex justify-content-center">
                          <img src={row?.src} className="d-block" alt="LOGO_ALT" height="150" width="200"/>
                        </div>
                        </TableCell>
                        <TableCell align="center">{row?.isCorner ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isPhotocopy ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isFake ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{mapBrightnessToValue(row?.brightness)}</TableCell>
                        <TableCell align="center">{row?.isBlur ? 'Có' : 'Không'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className="font-weight-bold">STT</TableCell>
                      <TableCell align="center" className="font-weight-bold">Ảnh</TableCell>
                      <TableCell align="center" className="font-weight-bold">Ảnh giả</TableCell>
                      <TableCell align="center" className="font-weight-bold">Chụp thẳng mặt</TableCell>
                      <TableCell align="center" className="font-weight-bold">Đeo kính</TableCell>
                      <TableCell align="center" className="font-weight-bold">Đeo khẩu trang</TableCell>
                      <TableCell align="center" className="font-weight-bold">Tay che mặt</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị lóa</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị tối</TableCell>
                      <TableCell align="center" className="font-weight-bold">Bị mờ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rowsFace.length > 0 && rowsFace.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell align="center">{idx + 1}</TableCell>
                        <TableCell align="center">
                        <div className="d-flex justify-content-center">
                          <img src={row?.src} className="d-block" alt="LOGO_ALT" height="150" width="200"/>
                        </div>
                        </TableCell>
                        <TableCell align="center">{row?.isFake ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isStraightFace ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isGlasses ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isMask ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isHand ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isLight ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isDark ? 'Có' : 'Không'}</TableCell>
                        <TableCell align="center">{row?.isBlur ? 'Có' : 'Không'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )
          }
        </Col>
      </div>
  );
};

export default OrcFace;
