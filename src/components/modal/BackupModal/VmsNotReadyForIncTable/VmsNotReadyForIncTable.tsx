import React, {useEffect, useState} from 'react';
import {Column} from 'primereact/column';
import {useDispatch} from 'react-redux';
import Table from 'components/table/primereactTable';
import {TableActionsTemplate} from 'pages/virtual-machines/virtual-machine/components/backups/TableActionsTemplate';
import {Button} from 'primereact/button';
import {virtualMachinesService} from 'services/virtual-machines-service'

export default ({vms}) => {
  const dispatch = useDispatch();
  const [vmsNotReadyForIncTable, setVmsNotReadyForIncTable] = useState([]);
  const [isVmsNotReadyForIncrementalTableActive, setIsVmsNotReadyForIncrementalTableActive] = useState(false);

  const getVmsTable = async () => {
    setVmsNotReadyForIncTable(await virtualMachinesService
      .getVirtualMachinesNotReadyForIncremental({entities: vms}))
  }

  useEffect(() => {
    getVmsTable();
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
          <Column field="name" header="Name"/>
          <Column
            field="reasons"
            header="Reasons"
            body={(rowData) => (
              console.log(rowData)
              // <ul>
              //   {rowData.map((reason) => (
              //     <li>{reason.description}</li>
              //   ))}
              // </ul>
            )}
          />
          <Column
            body={(data) => TableActionsTemplate(data, dispatch)}
            style={{width: '10%'}}
          />
        </Table>
      )}
    </div>
  );
};
