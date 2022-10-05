import React, { useState } from 'react';
import { Switch, useRouteMatch, useLocation } from 'react-router-dom';
import Summary from 'pages/reporting/Summary';
import { Tab } from 'components/tabs/Tab';
import { RouteList } from 'components/routes/Route';
import Routes from 'components/routes/Routes';
import DateRange from 'pages/reporting/DateRange';
import ReportTable from 'pages/reporting/ReportTable';
import ChargebackForm from 'pages/reporting/ChargebackForm';
import Tabs from 'components/tabs/Tabs';
import { ExportAs } from './ExportAs';
import { ToggleButton } from 'primereact/togglebutton';

const tabs: Tab[] = [
  { label: 'Summary', path: 'summary' },
  { label: 'Virtual Environment Backup', path: 'backups' },
  { label: 'Virtual Environment Restore', path: 'restores' },
  { label: 'Backup Size', path: 'backup-size' },
];

const routes: RouteList = [
  { path: 'summary', component: Summary },
  { path: 'backups', component: ReportTable },
  { path: 'restores', component: ReportTable },
  { path: 'backup-size', component: ChargebackForm },
];

export default () => {
  const match = useRouteMatch();
  const location = useLocation();

  const [isDateFilter, setIsDateFilter] = useState(true);

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
                offLabel="Show hide filter"
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
