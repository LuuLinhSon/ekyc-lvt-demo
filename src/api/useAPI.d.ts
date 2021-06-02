import { IUser } from '../modules/users/users.d';

interface IAnotherData {
  foo: string;
  age: number;
}

type ResponseData = IUser | IAnotherData;
interface ServerResponse<T = any> {
  data: IUser | ResponseData | T;
}

export interface Params {
  [key: string]: any;
}

interface DataProperty {
  url: string;
  initialValue?: any;
  params?: AnyObject | string | undefined;
  method?: Method;
  headers?: AnyObject;
  payload?: object | string;
  loadInitialState?: boolean;
}

export type useApiFunction = (params: DataProperty) => any;
