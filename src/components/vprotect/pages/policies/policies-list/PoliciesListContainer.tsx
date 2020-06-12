import React from 'react'
import {
    Link,
    Switch,
    Route,
    useRouteMatch,
    useLocation
} from 'react-router-dom'
import PoliciesList from './PoliciesList'

const items = [
    {label: 'Virtual Environment Backup', type: 'vm-backup'},
    {label: 'Snapshot Management', type: 'snapshot'},
];

export const PoliciesListContainer = () => {
    let match = useRouteMatch()
    let location = useLocation()
    let type = location.pathname.split('/').pop()

    return (
        <div>
            <ul className="nav nav-tabs">
                {items.map(el => {
                    return <li className={type === el.type && 'active'}>
                        <Link to={`${match.path}/${el.type}`}>
                            <a>{el.label}</a>
                        </Link>
                    </li>
                })}
            </ul>

            <Switch>
                <Route path={`${match.path}/:type`}>
                    <PoliciesList/>
                </Route>
            </Switch>
        </div>
    )
}

export default PoliciesListContainer
