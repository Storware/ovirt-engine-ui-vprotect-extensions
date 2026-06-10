import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectHypervisorClusters } from 'store/policy/selectors';
import { setFilteredHypervisorStoragesAction } from 'store/restore-modal/actions';
import { selectHypervisorStorages } from 'store/restore-modal/selectors';

export const useClusters = () => {
  const dispatch = useDispatch();
  const [clusterCopy, setClusterCopy] = useState(null);
  const storages = useSelector(selectHypervisorStorages);
  const clusters = useSelector(selectHypervisorClusters);

  const onClusterChange = (event) => {
    const cluster = clusters.find((el) => el.uuid === event.value);

    setClusterCopy(cluster);
    dispatch(
      setFilteredHypervisorStoragesAction(
        storages.filter(
          (storage) =>
            !!storage.clusters &&
            !!storage.clusters.find((el) => cluster.guid === el.guid),
        ),
      ),
    );
  };

  return {
    clusterCopy,
    clusters,

    onClusterChange,
  };
};
