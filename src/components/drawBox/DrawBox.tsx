import React, { useEffect, useState } from 'react';
const WIDTH_MAX_BOX = 246;
const HEIGHT_MAX_BOX = 238;
const X_MAX_BOX = 86;
const Y_MAX_BOX = 65;

const WIDTH_MIN_BOX = 120;
const HEIGHT_MIN_BOX = 96;
const X_MIN_BOX = 159;
const Y_MIN_BOX = 80;

const DrawBox: React.FC<any> = ({ checkFaceNear, fullDesc, imageWidth, boxColor, screenshot }) => {
  const [detections, setDetections] = useState<any>(null);
  let box = null;

  useEffect(() => {
    getDescription(fullDesc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullDesc]);

  const getDescription = async (fullDesc: any) => {
    if (!!fullDesc) {
      await setDetections(fullDesc.map((fd: any) => fd.detection));
    }
  };

  if (!!detections) {
    box = detections?.map((detection: any, i: any) => {
      const relativeBox = detection.relativeBox;
      const dimension = detection._imageDims;
      const _X = imageWidth * relativeBox._x;
      const _Y = (relativeBox._y * imageWidth * dimension._height) / dimension._width;
      const _W = imageWidth * relativeBox.width;
      const _H = (relativeBox.height * imageWidth * dimension._height) / dimension._width;

      if (checkFaceNear && _W * _H >= 40000 && _W * _H <= 58310) {
        screenshot();
      }

      if (!checkFaceNear && _W * _H >= 12000 && _W * _H <= 13520) {
        screenshot();
      }

      return (
        <div key={i}>
          <div
            style={{
              position: 'absolute',
              border: 'solid',
              borderColor: boxColor,
              height: _H,
              width: _W,
              transform: `translate(${_X}px,${_Y}px)`,
            }}
          />
        </div>
      );
    });
  }

  return (
    <div>
      {box}
      <div>
        {checkFaceNear ? (
          <div
            style={{
              position: 'absolute',
              border: 'solid',
              borderColor: 'yellow',
              height: HEIGHT_MAX_BOX,
              width: WIDTH_MAX_BOX,
              transform: `translate(${X_MAX_BOX}px,${Y_MAX_BOX}px)`,
            }}
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              border: 'solid',
              borderColor: 'yellow',
              height: HEIGHT_MIN_BOX,
              width: WIDTH_MIN_BOX,
              transform: `translate(${X_MIN_BOX}px,${Y_MIN_BOX}px)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DrawBox;
