import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import PropTypes from 'prop-types';
import VirtualMachinesList from './virtual-machines-list/VirtualMachinesList';
import VirtualMachine from './virtual-machine/VirtualMachine';

const VirtualMachines = () => {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.path}:guid`}>
        <VirtualMachine />
      </Route>
      <Route path={match.path}>
        <VirtualMachinesList />
      </Route>
    </Switch>
  );
};

export default VirtualMachines;
