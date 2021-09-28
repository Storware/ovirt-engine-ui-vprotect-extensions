import React, { useEffect, useState } from 'react';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  booleanTemplate,
} from '../../../components/table/templates';
import { useDispatch, useSelector } from 'react-redux';
import { selectDisks } from '../../../store/virtual-machine/selectors';
import Table from '../../../components/table/primereactTable';
import { ToggleButton } from 'primereact/togglebutton';
import { virtualMachinesService } from 'services/virtual-machines-service';
import { alertService } from 'services/alert-service';
import { Button } from 'primereact/button';
import { setDisks } from 'store/virtual-machine/actions';

export const excludedFromBackupTemplate = (list, setList) => (rowData) => {
  const element = list.find((el) => el.guid === rowData.guid);

  return (
    <div className={'text-center'}>
      <ToggleButton
        checked={element.excludedFromBackup}
        onChange={(e) => {
          element.excludedFromBackup = !element.excludedFromBackup;
          setList([...list]);
        }}
      />
    </div>
  );
};

const saveDisks = async (list, updatedList, dispatch) => {
  for (let i = 0; i < updatedList.length; i++) {
    if (updatedList[i].excludedFromBackup !== list[i].excludedFromBackup) {
      await virtualMachinesService.updateVirtualMachineDiskSettings(
        updatedList[i],
      );
    }
  }
  dispatch(setDisks(updatedList));
  alertService.info('Disks have been updated');
};

const DisksTable = () => {
  const disks = useSelector(selectDisks);
  const [list, setList] = useState(disks);
  const dispatch = useDispatch();

  useEffect(() => {
    setList(JSON.parse(JSON.stringify(disks)));
  }, []);

  return (
    <div>
      <Table value={disks}>
        <Column field="name" header="Name" />
        <Column field="uuid" header="UUID" />
        <Column field="size" header="Size date" body={sizeTemplate} />
        <Column field="present" header="Present" body={booleanTemplate} />
        <Column
          field="excludedFromBackup"
          header="Excluded from backup"
          body={excludedFromBackupTemplate(list, setList)}
        />
      </Table>

      <div className="d-flex justify-content-end">
        <Button
          className="p-button-success"
          onClick={() => {
            saveDisks(disks, list, dispatch);
          }}
          label="Save"
        />
      </div>
    </div>
  );
};

export default DisksTable;
