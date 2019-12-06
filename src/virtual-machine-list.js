import '_/logger'
import React from 'react'
import ReactDOM from 'react-dom'
import {vprotectVirtualMachineListPlaceToken} from './constants'
import getPluginApi from './plugin-api'
import appInit from './services/app-init'
import 'patternfly/dist/css/patternfly.min.css'
import 'patternfly/dist/css/patternfly-additions.min.css'
import 'patternfly-react/dist/css/patternfly-react.css'

// TODO(vs): Move component-specific CSS next to the relevant React component and
// have that React component import the CSS. Once we update our code to use only
// patternfly-react components, remove dependency on PatternFly as well as related
// dependencies like jQuery and C3/D3.
import '../static/css/vprotect.css'

// TODO(vs): For now, we use Bootstrap JavaScript library providing interactive
// components via jQuery plugins. Eventually, we should use only patternfly-react
// components and remove Bootstrap & jQuery dependencies. (Note: jQuery is loaded
// automatically through webpack ProvidePlugin, no explicit import needed here.)
import 'bootstrap'

// Bootstrap 3.3.7 Tooltip.getPosition() function has a bug, this override fixes
// the problem.
import './bootstrap-overrides/tooltip-fix'
import {VirtualMachineListContainer} from './components/vprotect/virtual-machine-list/VirtualMachineListContainer'
import 'primereact/resources/themes/nova-light/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const appRoot = document.getElementById('virtual-machine-list')

appInit.run().then(() => {
  ReactDOM.render(
    <VirtualMachineListContainer />,
    appRoot
  )
})

getPluginApi().setPlaceUnloadHandler(vprotectVirtualMachineListPlaceToken, function () {
  ReactDOM.unmountComponentAtNode(appRoot)
})
