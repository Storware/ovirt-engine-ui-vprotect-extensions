import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import Table from 'components/table/primereactTable';
import { Button } from 'primereact/button';
import { virtualMachinesService } from 'services/virtual-machines-service';
import { Modal } from 'components/modal/Modal';
import Schedule from './Schedule';
import { schedulesService } from 'services/schedules-service';
import { alertService } from 'services/alert-service';
import { VirtualMachineSchedule } from 'model/VirtualMachineSchedule';

export default ({ vms }) => {
  const [vmsNotReadyForIncTable, setVmsNotReadyForIncTable] = useState([]);
  const [
    isVmsNotReadyForIncrementalTableActive,
    setIsVmsNotReadyForIncrementalTableActive,
  ] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [scheduleFormModel, setScheduleFormModel] =
    useState<VirtualMachineSchedule | null>(null);

  const getVmsNotReadyForInc = async () => {
    setVmsNotReadyForIncTable(
      await virtualMachinesService.getVirtualMachinesNotReadyForIncremental({
        entities: vms,
      }),
    );
  };

  useEffect(() => {
    getVmsNotReadyForInc();
  }, [vms]);

  const scheduleSave = async (values) => {
    await schedulesService.createSchedule({
      ...values,
      backupType: {
        name: 'INCREMENTAL',
        description: 'Incremental',
      },
    });
    alertService.info('Schedule has been successfully created');
  };

  return (
    <div>
      {!!vmsNotReadyForIncTable.length && (
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
              style={{ color: '#3F51B5' }}
              className="cursor-pointer"
              onClick={() =>
                setIsVmsNotReadyForIncrementalTableActive(
                  !isVmsNotReadyForIncrementalTableActive,
                )
              }
            >
              {isVmsNotReadyForIncrementalTableActive
                ? ' (See less)'
                : ' (See more)'}
            </span>
          </p>
        </div>
      )}

      {isVmsNotReadyForIncrementalTableActive && (
        <Table value={vmsNotReadyForIncTable}>
          <Column field="virtualMachine.name" header="Name" />
          <Column
            field="reasons"
            header="Reasons"
            body={(rowData) => (
              <ul>
                {rowData.reasons.map((reason, i) => (
                  <li key={i} className="mb-1">
                    {reason.description}
                  </li>
                ))}
              </ul>
            )}
          />
          <Column
            body={(data) =>
              data.reasons.some(
                ({ name }) => name === 'MISSING_INCREMENTAL_SCHEDULER',
              ) && (
                <>
                  <Button
                    label="Create schedule"
                    onClick={() =>
                      setPolicy(data.virtualMachine.vmBackupPolicy)
                    }
                  />
                </>
              )
            }
            style={{ width: '10%' }}
          />
        </Table>
      )}
      <Modal
        header={'Create schedule'}
        visible={!!policy}
        onHide={() => {
          setPolicy(null);
          setScheduleFormModel(null);
        }}
        style={{ width: '80vw' }}
        save={{
          onClick: async () => {
            await scheduleSave(scheduleFormModel);
            setScheduleFormModel(null);
          },
          disabled: !!scheduleFormModel,
        }}
      >
        {!!policy && (
          <Schedule policy={policy} onModelChange={setScheduleFormModel} />
        )}
      </Modal>
    </div>
  );
};
