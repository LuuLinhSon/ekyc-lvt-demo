import React, { useEffect } from 'react';
import { TOAST_TYPE, POSITION, AlertTypeOptions } from '../../constants/enum';
import { ToastContainer, toast, ToastContent, ToastOptions } from 'react-toastify';
import { ToastProps } from './Toast.d';

const Toast: React.FC<ToastProps> = (props) => {
  const { type, duration, message, handleClose } = props;
  const { position } = props;
  const positionToast = position || POSITION.TOP_CENTER;

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const content: ToastContent = getContentToast(message, type);

  useEffect(() => {
    switch (type) {
      case TOAST_TYPE.ERROR:
        toast.error(content, { onClose: handleClose });
        break;
      case TOAST_TYPE.SUCCESS:
        toast.success(content, { onClose: handleClose });
        break;
      default:
        toast(content, { onClose: handleClose });
    }
  }, [type, content, handleClose]);

  return <ToastContainer position={positionToast} autoClose={duration} draggable={false} hideProgressBar />;
};

export const getTitle = (type?: string) => {
  let title = '';
  switch (type) {
    case TOAST_TYPE.ERROR:
      title = 'ERROR!';
      break;
    case TOAST_TYPE.SUCCESS:
      title = 'SUCCESS!';
      break;
    case TOAST_TYPE.INFO:
      title = 'INFO!';
      break;
    case TOAST_TYPE.WARNING:
      title = 'WARNING!';
      break;
    default:
      break;
  }
  return title;
};

export const getContentToast = (message: string, type: AlertTypeOptions, title?: string) => () => {
  return (
    <div className="content-toast">
      <div className="body">
        <p
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: message,
          }}
        />
      </div>
    </div>
  );
};

export const notify = {
  error: (message: string, title?: string, options?: ToastOptions) => {
    return toast.error(getContentToast(message, TOAST_TYPE.ERROR, title), options);
  },
  success: (message: string, title?: string, options?: ToastOptions) => {
    return toast.success(getContentToast(message, TOAST_TYPE.SUCCESS, title), options);
  },
  info: (message: string, title?: string, options?: ToastOptions) => {
    return toast.info(getContentToast(message, TOAST_TYPE.INFO, title), options);
  },
  warning: (message: string, title?: string, options?: ToastOptions) => {
    return toast.warning(getContentToast(message, TOAST_TYPE.WARNING, title), options);
  },
};

export default Toast;