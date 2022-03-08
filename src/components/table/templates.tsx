import React from 'react';
import { DateShow } from '../convert/Date';
import { Filesize } from '../convert/Filesize';
import { schedulesService } from '../../services/schedules-service';
import { convertMilisecondsToHours } from '../../utils/convertMilisecondsToHours';

enum StatusColorHex {
  IN_PROGRESS = '#1f75b1',
  PRESENT = '#00624c',
  FAILED = '#c70015',
  REMOVED = '#9A9A9A',
}
export const durationTemplate = (rowData) => {
  return (
    <span>
      {rowData.state.name !== 'QUEUED' &&
        convertMilisecondsToHours(
          rowData.state.name !== 'RUNNING'
            ? rowData.finishTime || 0
            : +new Date() - rowData.startTime,
        )}
    </span>
  );
};

export const dateTemplate = (rowData, column) => {
  const path = column.field.split('.');
  return (
    <DateShow
      date={
        path.length > 1
          ? path.reduce((prev, curr) => {
              return prev ? prev[curr] : null;
            }, rowData || self)
          : rowData[column.field]
      }
    />
  );
};

export const sizeTemplate = (rowData, column) => {
  if (rowData[column.field] == null) {
    return;
  }
  return <Filesize bytes={rowData[column.field]} />;
};

export const booleanTemplate = (rowData, column) => {
  const classes = rowData[column.field]
    ? 'pi-check text-success'
    : 'pi-times text-danger';
  return (
    <div className="ml-1">
      <span className={`pi ${classes}`} />
    </div>
  );
};

export const scheduleTimeTemplate = (rowData) => {
  return (
    <span>{schedulesService.getScheduleTimeOrIntervalLabel(rowData)}</span>
  );
};

export const scheduleDaysTemplate = (rowData) => {
  return rowData.daysOfWeek.map((el) => {
    return <span>{el.name} </span>;
  });
};

export const convertTemplate = (convertValue) => (rowData, column) => {
  return <span>{rowData[column.field] / convertValue}</span>;
};

export const permissionTemplate = (rowData, column) => {
  const perm = [
    'OWNER_READ',
    'OWNER_WRITE',
    'OWNER_EXECUTE',
    'GROUP_READ',
    'GROUP_WRITE',
    'GROUP_EXECUTE',
    'OTHERS_READ',
    'OTHERS_WRITE',
    'OTHERS_EXECUTE',
  ];

  const checkIfPresent = (item) => {
    let permission;

    if (rowData[column.field] && rowData[column.field].includes(item)) {
      permission = transformDisplay(item);
    } else {
      permission = '-';
    }
    return permission;
  };

  const transformDisplay = (el) => {
    let displayedLetter;
    if (el.toLowerCase().includes('read')) {
      displayedLetter = 'r';
    } else if (el.toLowerCase().includes('write')) {
      displayedLetter = 'w';
    } else if (el.toLowerCase().includes('execute')) {
      displayedLetter = 'x';
    }
    return displayedLetter;
  };

  const displayText = perm.map((el) => {
    return checkIfPresent(el);
  });

  return displayText.join('');
};

export const backupLocationsTemplates = (rowData) => {
  return rowData.backupLocations.map(
    ({ backupDestination: { name }, status }, i) => (
      <div key={i} className="d-flex align-items-center">
        <i
          className="pi pi-circle-on mr-2"
          style={{ color: StatusColorHex[status.name] }}
        />
        {name}
      </div>
    ),
  );
};