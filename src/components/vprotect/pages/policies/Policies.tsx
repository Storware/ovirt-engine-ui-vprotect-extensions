import React from 'react'
import {
    Switch,
    Route,
    useRouteMatch
} from 'react-router-dom'
import PoliciesList from './policies-list/PoliciesList'
import Policy from './policy/Policy'

export const Policies = () => {
    let match = useRouteMatch();

    return (
        <Switch>
            <Route exact path={match.path}>
                <PoliciesList/>
            </Route>
            <Route path={`${match.path}/:guid`}>
                <Policy/>
            </Route>
        </Switch>
    )
}

export default Policies
