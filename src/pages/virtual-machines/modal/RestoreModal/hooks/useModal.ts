import { useDispatch } from 'react-redux';
import {
  hideFooterAction,
  hideModalAction,
  saveModalAction,
} from 'store/modal/actions';

export const useModal = () => {
  const dispatch = useDispatch();

  const hideModal = () => {
    dispatch(hideModalAction());
  };

  const saveModal = () => {
    dispatch(saveModalAction());
  };

  const hideFooter = () => {
    dispatch(hideFooterAction());
  };

  return {
    hideModal,
    saveModal,
    hideFooter,
  };
};
