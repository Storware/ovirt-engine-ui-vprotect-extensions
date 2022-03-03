import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import VirtualMachine from './virtual-machine/VirtualMachine';
import VirtualMachinesList from 'pages/virtual-machines/virtual-machines-list/VirtualMachinesList';

const VirtualMachines = () => {
  const match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}/:guid`}>
        <VirtualMachine />
      </Route>
      <Route path={match.path}>
        <VirtualMachinesList />
      </Route>
    </Switch>
  );
};

export default VirtualMachines;
