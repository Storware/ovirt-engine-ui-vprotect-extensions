import { useState } from 'react';
import { Switch, useRouteMatch, useLocation } from 'react-router-dom';
import { ToggleButton } from 'primereact/togglebutton';
import { ExportAs } from './ExportAs';
import { Tab } from 'components/tabs/Tab';
import { RouteList } from 'components/routes/Route';
import Routes from 'components/routes/Routes';
import DateRange from 'pages/reporting/DateRange';
import Tabs from 'components/tabs/Tabs';
import {
  ChargebackForm,
  ReportTable,
  Summary,
  TransferSize,
} from 'pages/reporting/Tabs';

const tabs: Tab[] = [
  { label: 'Summary', path: 'summary' },
  { label: 'Virtual Environment Backup', path: 'backups' },
  { label: 'Virtual Environment Restore', path: 'restores' },
  { label: 'Backup Size', path: 'backup-size' },
  { label: 'Transfer size', path: 'transfer-size' },
];

const routes: RouteList = [
  { path: 'summary', component: Summary },
  { path: 'backups', component: ReportTable },
  { path: 'restores', component: ReportTable },
  { path: 'backup-size', component: ChargebackForm },
  { path: 'transfer-size', component: TransferSize },
];

export default () => {
  const match = useRouteMatch();
  const location = useLocation();

  const [isDateFilter, setIsDateFilter] = useState(false);

  const isBackupSizePage = location.pathname.includes('backup-size');
  return (
    <div>
      <div className="d-flex bd-highlight">
        {!isBackupSizePage ? (
          <>
            {isDateFilter ? (
              <DateRange />
            ) : (
              <div className={'p-2 flex-grow-1 bd-highlight'}></div>
            )}
            <div className={'p-2 bd-highlight'}>
              <ToggleButton
                checked={isDateFilter}
                onLabel="Hide date filter"
                offLabel="Show date filter"
                onChange={(e) => setIsDateFilter(!isDateFilter)}
              />
            </div>
          </>
        ) : (
          <div className={'p-2 flex-grow-1 bd-highlight'}></div>
        )}
        <ExportAs />
      </div>
      <Tabs items={tabs} />
      <Switch>
        <Routes items={routes} absolutePathPart={match.path} />
      </Switch>
    </div>
  );
};
