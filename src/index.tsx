// import '_/logger'
import React from 'react'
import ReactDOM from 'react-dom'
// import appInit from './components/vprotect/services/app-init'
import appInit from './app-init'
import 'patternfly/dist/css/patternfly.min.css'
import 'patternfly/dist/css/patternfly-additions.min.css'
import 'patternfly-react/dist/css/patternfly-react.css'

// TODO(vs): Move component-specific CSS next to the relevant React component and
// have that React component import the CSS. Once we update our code to use only
// patternfly-react components, remove dependency on PatternFly as well as related
// dependencies like jQuery and C3/D3.
import './theme/vprotect.scss'

// TODO(vs): For now, we use Bootstrap JavaScript library providing interactive
// components via jQuery plugins. Eventually, we should use only patternfly-react
// components and remove Bootstrap & jQuery dependencies. (Note: jQuery is loaded
// automatically through webpack ProvidePlugin, no explicit import needed here.)
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap-grid.css'

// Bootstrap 3.3.7 Tooltip.getPosition() function has a bug, this override fixes
// the problem.
import './bootstrap-overrides/tooltip-fix'
import Vprotect from './components/vprotect/index'
import {store} from './store'
import {Provider} from 'react-redux'

const appRoot = document.getElementById('app')

appInit.run().then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <Vprotect/>
        </Provider>,
        appRoot
    )
})
