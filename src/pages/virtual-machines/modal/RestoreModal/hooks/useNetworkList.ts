import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectNetwork } from 'store/network/selectors';
import { selectTask } from 'store/restore-modal/selectors';
import { getNetwork } from 'store/network/actions';

export const useNetworkList = () => {
  const dispatch = useDispatch();
  const task = useSelector(selectTask);
  const networkList = useSelector(selectNetwork);

  useEffect(() => {
    if (!!task.hypervisorManager && networkList.length === 0) {
      dispatch(
        getNetwork({ hypervisorManagerGuid: task?.hypervisorManager.guid }),
      );
    }
  }, [task]);
};
