import React from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import VirtualEnvironmentBackupSchedule from './VirtualEnvironmentBackupSchedule'
import SnapshotSchedule from './SnapshotSchedule';

export const Policy = () => {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/vm-backup/:guid`}>
                <VirtualEnvironmentBackupSchedule/>
            </Route>
            <Route path={`${match.path}/snapshot/:guid`}>
                <SnapshotSchedule/>
            </Route>
        </Switch>
    )
}

export default Policy
