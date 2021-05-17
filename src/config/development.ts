import { IConfig } from './index';
export const REACT_APP_API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:3004';
const CONFIG: IConfig = {
  API: {
    ROOT_ENDPOINT: `${REACT_APP_API_HOST}`,
    USER_SERVICE_LOGIN: `${REACT_APP_API_HOST}/login`,
    USER_SERVICE_REFRESH_SESSION: `${REACT_APP_API_HOST}/refresh-sesson`,
  },
  LINK: {
    PROJECTS_WEB: `${process.env.REACT_APP_SHAHID_WEB}`,
  },
  LANG: 'en',
  GIGYA_KEY: `${process.env.REACT_APP_GIGYA_SITE_KEY}`,
  SITE_NAME: `${process.env.REACT_APP_GIGYA_SITE_NAME}`,
};

export default CONFIG;
