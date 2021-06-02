/* eslint-disable import/no-anonymous-default-export */
import dev from './development';
import prod from './production';

export interface IConfig {
  API: {
    ROOT_ENDPOINT: string;
    USER_SERVICE_LOGIN: string;
    USER_SERVICE_REFRESH_SESSION: string;
  };
  LINK: {
    PROJECTS_WEB: string;
  };
  LANG: string;
  GIGYA_KEY: string;
  SITE_NAME: string;
}

let config: IConfig = { ...dev };
const env = process.env.REACT_APP_ENV;
switch (env) {
  case 'dev':
    config = dev;
    break;
  case 'prod':
    config = prod;
    break;
  default:
    break;
}

export const isDevEnv = () => {
  return process.env.REACT_APP_ENV === 'dev';
};
export const SESSION_TIMEOUT = Number(process.env.REACT_APP_SESSION_TIMEOUT);
export default {
  // Add common config values here
  env,
  ...config,
};
