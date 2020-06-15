import React from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import Schedule from './schedule/Schedule'
import SchedulesListContainer from './schedules-list/SchedulesListContainer';

const Schedules = () => {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route path={`${match.path}/list`}>
                <SchedulesListContainer/>
            </Route>
            <Route path={`${match.path}/edit`}>
                <Schedule/>
            </Route>
        </Switch>
    )
}


export default Schedules
