import React from 'react';
import { Switch, useRouteMatch } from 'react-router-dom';
import { Tab } from 'components/tabs/Tab';
import { RouteList } from 'components/routes/Route';
import Routes from 'components/routes/Routes';
import DateRange from 'pages/reporting/DateRange';
import Tabs from 'components/tabs/Tabs';
import { ExportAs } from './ExportAs';
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
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <DateRange />
        <ExportAs />
      </div>
      <Tabs items={tabs} />
      <Switch>
        <Routes items={routes} absolutePathPart={match.path} />
      </Switch>
    </div>
  );
};
