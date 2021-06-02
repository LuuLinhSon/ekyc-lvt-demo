import { ToastPosition } from 'react-toastify';
import { AlertTypeOptions } from '../../constants/enum';

export type ToastProps = {
  type?: AlertTypeOptions;
  message: string;
  position?: ToastPosition;
  duration?: number | false;
  handleClose?: () => void;
};