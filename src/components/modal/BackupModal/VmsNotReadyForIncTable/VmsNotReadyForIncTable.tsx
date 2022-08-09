import React, {useEffect, useState} from 'react';
import {Column} from 'primereact/column';
import Table from 'components/table/primereactTable';
import {Button} from 'primereact/button';
import {virtualMachinesService} from 'services/virtual-machines-service'
import {showModalAction} from 'store/modal/actions';
import {useDispatch} from 'react-redux';
import ScheduleModal from './ScheduleModal';
import {VirtualMachineBackupPolicy} from 'model/VirtualMachineBackupPolicy';

export default ({vms}) => {
  const dispatch = useDispatch();
  const [vmsNotReadyForIncTable, setVmsNotReadyForIncTable] = useState({});
  const [isVmsNotReadyForIncrementalTableActive, setIsVmsNotReadyForIncrementalTableActive] = useState(false);

  const openCreateScheduleModal = (policy: VirtualMachineBackupPolicy) => {
    dispatch(showModalAction({
      component: ScheduleModal,
      title: 'Create schedule',
      props: { policy },
      style: { width: '80vw' },
    }))
  }

  const getVmsNotReadyForInc = async () => {
    setVmsNotReadyForIncTable(await virtualMachinesService
      .getVirtualMachinesNotReadyForIncremental({entities: vms}))
  }

  useEffect(() => {
    getVmsNotReadyForInc();
  }, [vms])

  return (
    <div>
      <div className="d-flex align-items-center">
        <Button
          icon="pi pi-exclamation-triangle"
          className={'p-button-rounded p-button-text'}
          style={{
            color: '#ffb236',
          }}
        />

        <p>
          One or more VMs is not ready for incremental backup
          <span
            style={{color: '#3F51B5'}}
            className="cursor-pointer"
            onClick={() =>
              setIsVmsNotReadyForIncrementalTableActive(!isVmsNotReadyForIncrementalTableActive)}>
            {(isVmsNotReadyForIncrementalTableActive ? ' (See less)' : ' (See more)')}
          </span>
        </p>
      </div>

      {isVmsNotReadyForIncrementalTableActive && (
        <Table value={vmsNotReadyForIncTable}>
          <Column field="virtualMachine.name" header="Name"/>
          <Column
            field="reasons"
            header="Reasons"
            body={(rowData) => (
              <ul>
                {rowData.reasons.map((reason, i) => (
                  <li
                    key={i}
                    className="mb-1">
                    {reason.description}
                  </li>
                ))}
              </ul>
            )}
          />
          <Column
            body={(data) => (
              data.reasons.includes('MISSING_INCREMENTAL_SCHEDULER') &&
                <>
                  <Button
                    label="Create schedule"
                    onClick={() => openCreateScheduleModal(data.virtualMachine.vmBackupPolicy)}
                  />
                </>
            )}
            style={{width: '10%'}}
          />
        </Table>
      )}
    </div>
  );
};
