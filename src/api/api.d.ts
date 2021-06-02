import { Method, CancelTokenSource } from 'axios';
import { AnyObject } from '../constants/types';

export type ErrorObjectType = {
  property: string;
  invalidValue: string;
  message: string;
};

export interface DataProperty {
  url: string;
  params?: AnyObject | string;
  method?: Method;
  headers?: AnyObject;
  data?: AnyObject | string;
  cancelTokenSource?: CancelTokenSource;
  onUploadProgress?: (progressEvent: any) => void;
}

export type APIFunction = (params: DataProperty) => any;
