import React, { useState } from 'react';
import {Column} from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
  backupLocationsTemplates,
  originTemplate
} from 'components/table/templates';
import {useDispatch, useSelector} from 'react-redux';
import {selectBackupsHistory} from 'store/virtual-machine/selectors';
import Table from 'components/table/primereactTable';
import {Button} from 'primereact/button';
import {backupsService} from 'services/backups-service';
import {CalendarPropsModel} from 'model/time/calendarPropsModel';
import {Calendar} from 'primereact/calendar';
import {showModalAction} from 'store/modal/actions';
import {policiesService} from 'services/policies-service';
import {EditRuleModal} from '../../modal/EditRuleModal';
import {AdjustRetention} from '../components/AdjustRetention';

interface Props extends CalendarPropsModel {
  onRefresh: () => void;
}

export default ({ onRefresh, date, setDate }: Props) => {
  const dispatch = useDispatch();
  const backupsHistory = useSelector(selectBackupsHistory);
  const [selected, setSelected] = useState([]);
  const markBackupWarningsAsKnowledged = (guid) => {
    backupsService.markBackupWarningsAsKnowledged(guid);
    onRefresh();
  };

  const warningIconTemplate = (rowData) =>
    !!rowData?.warnings.length && (
      <Button
        id={rowData.guid}
        icon="pi pi-exclamation-triangle"
        className={'p-button-rounded p-button-text'}
        onClick={() => markBackupWarningsAsKnowledged(rowData.guid)}
        tooltip={rowData.warnings.join(', ')}
        tooltipOptions={{position: 'top', className: 'text-center'}}
        style={{
          color: rowData.warningsAcknowledged ? '#b1b1b1' : '#ffb236',
        }}
      />
    );

  const openEditRuleModal = async (backup) => {
    if (!backup.backupRule) {
      return;
    }
    const rule = await policiesService.getRule(backup.backupRule.guid)
    const primaryBackupDestination = rule.ruleBackupDestinations.find(
      ({roleType}) => roleType.name === 'PRIMARY'
    );
    const secondaryBackupDestination = rule.ruleBackupDestinations.find(
      ({roleType}) => roleType.name === 'SECONDARY'
    )

    dispatch(
      showModalAction({
        component: EditRuleModal,
        title: 'Rule Details',
        props: {
          rule, primaryBackupDestination,
          secondaryBackupDestination
        },
        style: {width: '80vw'},
      }),
    );
  }

  return (
    <div>
      <AdjustRetention
        disabled={selected.length === 0}
        data={selected.map(
          ({ backupLocations: [backupLocation] }) => backupLocation,
        )}
        onSave={() => {
          setSelected([]);
          onRefresh();
        }}
      />
      <Calendar
        id="range"
        value={date}
        onChange={({value}) => setDate(value)}
        selectionMode="range"
        maxDate={new Date()}
        readOnlyInput
      />
      <Table
        value={backupsHistory}
        selectionMode="checkbox"
        selection={selected}
        onSelectionChange={({ value }) => setSelected(value)}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
        <Column
          field="snapshotTime"
          header="Snapshot time"
          body={dateTemplate}
        />
        <Column
          field="warnings"
          header=""
          body={warningIconTemplate}
          style={{width: '64px'}}
        />
        <Column field="status.description" header="Status"/>
        <Column
          field="backupLocations"
          header="Locations"
          body={backupLocationsTemplates}
        />
        <Column header="Origin" body={originTemplate} />

        <Column field="statusInfo" header="Status info" />
        <Column
          field="type.description"
          header="Type"
          style={{width: '120px'}}
        />
        <Column
          field="size"
          header="Size"
          body={sizeTemplate}
          style={{width: '100px'}}
        />
        <Column
          body={(data) =>
            <>
              <Button
                onClick={() => openEditRuleModal(data)}
                className="p-button-outlined"
                icon="pi pi-pencil"
              />
            </>
          }
          style={{width: '10%'}}
        />
      </Table>
    </div>
  );
};
