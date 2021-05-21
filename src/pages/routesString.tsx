import { lazy } from 'react';

import { ENTITIES, PUBLIC_PAGES } from '../constants/enum';

const Login = lazy(() => import('./login/Login'));
const TermAndConditions = lazy(() => import('./term/TermAndConditions'));
const AccessDenied = lazy(() => import('./access-denied/AccessDenied'));
const Welcome = lazy(() => import('./welcome/Welcome'));
const Main = lazy(() => import('./main/Main'));
const CameraFaceDetect = lazy(() => import('./camera-face//CameraFaceDetect'));
const StepOne = lazy(() => import('./ekyc-journey/step/step-one/StepOneContainer'));
const StepTwo = lazy(() => import('./ekyc-journey/step/step-two/StepTwo'));
const StepTwoTwo = lazy(() => import('./ekyc-journey/step/step-two/StepTwoOne'));
const StepTwoThree = lazy(() => import('./ekyc-journey/step/step-two/StepTwoOne'));
const StepEditKYC = lazy(() => import('./ekyc-journey/step/step-two/StepEditKyc'));
const StepThreeOne = lazy(() => import('./ekyc-journey/step/step-three/StepThree'));
const StepThreeTwo = lazy(() => import('./ekyc-journey/step/step-three/StepThree'));
const StepFour = lazy(() => import('./ekyc-journey/step/step-four/StepFour'));

export const Pages = {
  Login,
  TermAndConditions,
  AccessDenied,
  Welcome,
  Main,
  CameraFaceDetect,
  StepOne,
  StepTwo,
  StepTwoTwo,
  StepTwoThree,
  StepEditKYC,
  StepThreeOne,
  StepThreeTwo,
  StepFour,
};

const RoutesString = {
  // Welcome: `/${PUBLIC_PAGES.NAME.WELCOME}`,
  Login: `/${PUBLIC_PAGES.NAME.LOGIN}`,
  // CameraFaceDetect: `/${PUBLIC_PAGES.NAME.CAMERA_FACE_DETECT}`,
  StepOne: `/`,
  StepTwo: `/${PUBLIC_PAGES.NAME.STEP_TWO}`,
  StepTwoThree: `/${PUBLIC_PAGES.NAME.STEP_TWO_THREE}`,
  StepTwoTwo: `/${PUBLIC_PAGES.NAME.STEP_TWO_TWO}`,
  StepEditKYC: `/${PUBLIC_PAGES.NAME.STEP_EDIT_KYC}`,
  StepThreeOne: `/${PUBLIC_PAGES.NAME.STEP_THREE_ONE}`,
  StepTreeTwo: `/${PUBLIC_PAGES.NAME.STEP_THREE_TWO}`,
  StepFour: `/${PUBLIC_PAGES.NAME.STEP_FOUR}`,
  TermAndConditions: `/${PUBLIC_PAGES.NAME.TAC}`,
  AccessDenied: `/${PUBLIC_PAGES.NAME.ACCESS_DENIED}`,
  Main: `/${ENTITIES.PATH.MAIN}`,
};

export default RoutesString;
