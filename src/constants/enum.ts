import { ToastPosition } from 'react-toastify';

export const ENTITIES = {
  PATH: {
    MAIN: 'main',
  },
};

export const PUBLIC_PAGES = {
  NAME: {
    WELCOME: '/',
    LOGIN: 'login',
    TAC: 'term-and-conditions',
    ACCESS_DENIED: 'access-denied-403',
    CAMERA_FACE_DETECT: 'camera-face-detect',
    EKYC_JOURNY: 'ekyc-journy',
    STEP_ONE: '/',
    STEP_TWO: 'step-2-1',
    STEP_TWO_TWO: 'step-2-2',
    STEP_TWO_THREE: 'step-2-3',
    STEP_EDIT_KYC: 'step-2-4',
    STEP_THREE_ONE: 'step-3-1',
    STEP_THREE_TWO: 'step-3-2',
    STEP_FOUR: 'step-4',
    ORC_FACE: 'orc-face',
    FACE_COMPARE: 'face-compare'
  },
};

export const API_ENTITIES_NAME = {
  MAIN: 'main',
};

export const TITLE_PAGE = {
  WELCOME: 'ENTITY_WELCOME',
  ACCESS_DENIED: 'ENTITY_ACCESS_DENIED',
  MAIN: 'ENTITY_NAME',
};

export const API_ERROR_CODE = {
  TOKEN_INVALID: '1012',
  TOKEN_EXPIRED: '1011',
  REFRESH_TOKEN_EXPIRED: '1014',
  REFRESH_TOKEN_INVALID: '1015',
  AUTH_TOKEN_INVALID: '1020',
  ELIGIBLE_LIST_ERROR: '2045',
};

export type AlertTypeOptions = 'info' | 'success' | 'warning' | 'error' | undefined;

interface TYPE_OPTIONS {
  [type: string]: AlertTypeOptions;
}

export const TOAST_TYPE: TYPE_OPTIONS = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

interface POSITION_OPTIONS {
  [pos: string]: ToastPosition;
}

export const POSITION: POSITION_OPTIONS = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  TOP_CENTER: 'top-center',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM_CENTER: 'bottom-center',
};

export const DURATION = {
  TOAST: 5000,
  TOAST_TRANSITION: 1000,
  BULK_POLLING_DELAY: 15000,
  UPDATE_NOTIFICATIONS: 60000,
  UPDATE_PROGRESS_JOB: 5000,
};
