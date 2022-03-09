import React from 'react';
import {Switch, useRouteMatch} from 'react-router-dom';
import Summary from 'pages/reporting/Summary';
import {Tab} from 'components/tabs/Tab';
import {RouteList} from 'components/routes/Route';
import Routes from 'components/routes/Routes';
import DateRange from 'pages/reporting/DateRange';
import ReportTable from 'pages/reporting/ReportTable';
import ChargebackForm from 'pages/reporting/ChargebackForm';
import Tabs from 'components/tabs/Tabs';
import { ExportAs } from './ExportAs';

const tabs: Tab[] = [
  {label: 'Summary', path: 'summary'},
  {label: 'Virtual Environment Backup', path: 'backups'},
  {label: 'Virtual Environment Restore', path: 'restores'},
  {label: 'Backup Size', path: 'backup-size'},
];

const inkStyle = {
  summary: {width: '117px', left: '0'},
  backups: {width: '246px', left: '117px'},
  restores: {width: '247px', left: '363px'},
  'backup-size': {width: '138px', left: '610px'},
};

const routes: RouteList = [
  {path: 'summary', component: Summary},
  {path: 'backups', component: ReportTable},
  {path: 'restores', component: ReportTable},
  {path: 'backup-size', component: ChargebackForm},
];

export default () => {
  const match = useRouteMatch();
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <DateRange/>
        <ExportAs />
      </div>
      <Tabs items={{tabs, inkStyle}}/>
      <Switch>
        <Routes items={routes} absolutePathPart={match.path}/>
      </Switch>
    </div>
  );
};
