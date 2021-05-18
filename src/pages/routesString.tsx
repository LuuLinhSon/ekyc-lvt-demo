import { lazy } from 'react';

import { ENTITIES, PUBLIC_PAGES } from '../constants/enum';

const Login = lazy(() => import('./login/Login'));
const TermAndConditions = lazy(() => import('./term/TermAndConditions'));
const AccessDenied = lazy(() => import('./access-denied/AccessDenied'));
const Welcome = lazy(() => import('./welcome/Welcome'));
const Main = lazy(() => import('./main/Main'));
const CameraFaceDetect = lazy(() => import('./camera-face//CameraFaceDetect'));
const StepOne = lazy(() => import('./ekyc-journey/step/step-one/StepOne'));
const StepTwo = lazy(() => import('./ekyc-journey/step/step-two/StepTwo'));
const StepTwoTwo = lazy(() => import('./ekyc-journey/step/step-two/StepTwoOne'));
const StepTwoThree = lazy(() => import('./ekyc-journey/step/step-two/StepTwoOne'));
const StepThreeOne = lazy(() => import('./ekyc-journey/step/step-three/StepThree'));
const StepThreeTwo = lazy(() => import('./ekyc-journey/step/step-three/StepThree'));
const StepThreeThree = lazy(() => import('./ekyc-journey/step/step-three/StepThreeSpeechToText'));

export const Pages = {
  Login,
  TermAndConditions,
  AccessDenied,
  Welcome,
  Main,
  CameraFaceDetect,
  StepOne,
  StepTwo,
  StepTwoThree,
  StepTwoTwo,
  StepThreeOne,
  StepThreeTwo,
  StepThreeThree,
};

const RoutesString = {
  // Welcome: `/${PUBLIC_PAGES.NAME.WELCOME}`,
  Login: `/${PUBLIC_PAGES.NAME.LOGIN}`,
  // CameraFaceDetect: `/${PUBLIC_PAGES.NAME.CAMERA_FACE_DETECT}`,
  StepOne: `/${PUBLIC_PAGES.NAME.STEP_ONE}`,
  StepTwo: `/${PUBLIC_PAGES.NAME.STEP_TWO}`,
  StepTwoThree: `/${PUBLIC_PAGES.NAME.STEP_TWO_THREE}`,
  StepTwoTwo: `/${PUBLIC_PAGES.NAME.STEP_TWO_TWO}`,
  StepThreeOne: `/${PUBLIC_PAGES.NAME.STEP_THREE_ONE}`,
  StepTreeTwo: `/${PUBLIC_PAGES.NAME.STEP_THREE_TWO}`,
  StepThreeThree: `/${PUBLIC_PAGES.NAME.STEP_THREE_THREE}`,
  TermAndConditions: `/${PUBLIC_PAGES.NAME.TAC}`,
  AccessDenied: `/${PUBLIC_PAGES.NAME.ACCESS_DENIED}`,
  Main: `/${ENTITIES.PATH.MAIN}`,
};

export default RoutesString;
