import React, { useEffect, useState } from 'react';
import { schedulesService } from 'services/schedules-service';
import { useDispatch, useSelector } from 'react-redux';
import { getSchedules, removeSchedule } from 'store/schedules/actions';
import { Link, useParams } from 'react-router-dom';
import { selectSchedules } from 'store/schedules/selectors';
import { nameTemplate } from 'components/table/templates';
import { createBrowserHistory } from 'history';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { booleanTemplate } from 'components/table/templates';
import Table from 'components/table/primereactTable';
import { Button } from 'primereact/button';
import {userHasPrivilege} from "utils/privileges";

const typeMap = {
  'vm-backup': 'VM_BACKUP',
  'vm-snapshot': 'VM_SNAPSHOT',
};

const SchedulesList = () => {
  const dispatch = useDispatch();
  const { type } = useParams();
  const history = createBrowserHistory();
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {
    dispatch(getSchedules(typeMap[type]));
  }, [type]);

  const rows = useSelector(selectSchedules);

  const removeElement = (guid: string) => {
    dispatch(removeSchedule(typeMap[type], guid));
  };

  const header = () => (
    <div>
      <div className="d-flex justify-content-between mt-2">
        <div className="p-datatable-globalfilter-container">
          <InputText
            type="search"
            value={globalFilter}
            // @ts-ignore
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Global Search"
          />
        </div>
        {userHasPrivilege('VE_BACKUP_SLA_WRITE') && (
          <div>
            <Link to={`${history.location.pathname}/create`}>
              <Button label="Create" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Table value={rows} header={header()} globalFilter={globalFilter}>
      <Column
        field="name"
        header="Name"
        body={nameTemplate(history)}
        sortable
      />
      <Column field="active" header="Active" body={booleanTemplate} sortable />
      <Column
        field="hour"
        header="Schedule"
        body={(rowData) =>
          schedulesService.getScheduleTimeOrIntervalLabel(rowData)
        }
      />
      <Column
        field="daysOfWeek"
        header="Days"
        body={(rowData) =>
          rowData.daysOfWeek.map((el) => <span>{el.name} </span>)
        }
      />
      <Column field="backupType.description" header="Backup Type" sortable />
      <Column field="rules.length" header="Policies" />
      <Column
        field="startWindowLength"
        header="Start window [min]"
        sortable
        body={(rowData) => rowData.startWindowLength / 1000 / 60}
      />
      <Column
        field="action"
        header="Action"
        body={(rowData) => (
          <Button label="Remove" onClick={() => removeElement(rowData.guid)} />
        )}
      />
    </Table>
  );
};

export default SchedulesList;
