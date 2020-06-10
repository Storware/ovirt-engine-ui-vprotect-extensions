import React from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import BackupPolicy from './BackupPolicy'

export const Policy = () => {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/vm-backup/:guid`}>
                <BackupPolicy/>
            </Route>
        </Switch>
    )
}

export default Policy
