import React from 'react'
import PropTypes from 'prop-types'
import { searchPrefixes, searchFields, storageUnitTable, webadminPlaces } from '../constants'
import { msg } from '../intl-messages'
import { formatNumber0D, formatNumber1D } from '../utils/intl'
import { round } from '../utils/round'
import { convertValue } from '../utils/unit-conversion'
import { applySearch } from '../utils/webadmin-search'
import DonutChart from './patternfly/DonutChart'
import SparklineChart from './patternfly/SparklineChart'
import ModalDialog from './bootstrap/ModalDialog'
import ObjectUtilizationList from './ObjectUtilizationList'
import ObjectUtilizationListTitle from './ObjectUtilizationListTitle'
import Tooltip from './bootstrap/Tooltip'

// PatternFly reference:
//  http://www.patternfly.org/pattern-library/cards/utilization-trend-card/

// TODO(vs) replace with
//  https://github.com/patternfly/patternfly-react/tree/master/packages/core/src/components/Cards/UtilizationTrendCard

class UtilizationTrendCard extends React.Component {
  render () {
    const {
      data: { used, total, overcommit, allocated, history, utilization },
      title, unit, utilizationDialogTitle, showValueAsPercentage,
      donutCenterLabel, sparklineTooltipType, utilizationFooterLabel
    } = this.props

    const available = total - used
    const thresholds = { enabled: true, warning: 75, error: 90 }

    // for non-percentage values summary - scale the available and total unit values together
    const { unit: summaryUnit, value: [summaryAvailable, summaryTotal] } = convertValue(storageUnitTable, unit, [ available, total ])

    // for the donut chart - want to adjust the used and total values together so they stay balanced
    const { unit: newUnit, value: [newUsed, newTotal] } = convertValue(storageUnitTable, unit, [used, total])

    return (
      <div className='utilization-chart-pf'>

        {/* title */}
        <h3>{title}</h3>

        {/* summary */}
        <div className='current-values'>
          <h1 className='available-count pull-left'>
            {showValueAsPercentage ? `${formatNumber0D(available)}%` : formatNumber1D(summaryAvailable)}
          </h1>
          <div className='available-text pull-left'>
            <div>{msg.available()}</div>
            <div>
              {showValueAsPercentage
                ? msg.dashboardUtilizationCardAvailableOfPercent({ total: round(total) })
                : msg.dashboardUtilizationCardAvailableOfUnit({ total: round(summaryTotal, 1), unit: summaryUnit })
              }
            </div>
          </div>

          <Tooltip text={msg.dashboardUtilizationCardOverCommitTooltip()}>
            <div className='overcommit-text' style={{ clear: 'left', paddingTop: 5 }}>
              {msg.dashboardUtilizationCardOverCommit({
                overcommit: round(overcommit),
                allocated: round(allocated)
              })}
            </div>
          </Tooltip>
        </div>

        {/* donut chart */}
        <DonutChart
          used={newUsed}
          total={newTotal === 0 && newUsed === 0 ? 1 : newTotal}
          unit={newUnit}
          thresholds={thresholds}
          centerLabel={donutCenterLabel}
          onDataClick={() => {
            this._utilizationDialog.show()
          }}
        />

        {/* sparkline chart */}
        <SparklineChart
          data={history}
          total={total}
          unit={unit}
          tooltipType={sparklineTooltipType}
        />

        {/* utilization dialog  */}
        <ModalDialog
          title={utilizationDialogTitle}
          modalContainerClass='overutilization-dialog'
          ref={e => { this._utilizationDialog = e }}>

          {utilization.hosts &&
            <div>
              <ObjectUtilizationListTitle
                text={msg.dashboardUtilizationCardDialogHostListTitle({
                  hostCount: utilization.hosts.length
                })}
              />
              <ObjectUtilizationList
                data={utilization.hosts}
                unit={unit}
                emptyListText={msg.dashboardUtilizationCardDialogEmptyHostList()}
                thresholds={thresholds}
                utilizationFooterLabel={utilizationFooterLabel}
                onObjectNameClick={dataItem => {
                  applySearch(webadminPlaces.host, searchPrefixes.host, [{
                    name: searchFields.name,
                    values: [dataItem.name]
                  }])
                }}
              />
            </div>
          }

          {utilization.storage &&
            <div>
              <ObjectUtilizationListTitle
                text={msg.dashboardUtilizationCardDialogStorageListTitle({
                  storageCount: utilization.storage.length
                })}
              />
              <ObjectUtilizationList
                data={utilization.storage}
                unit={unit}
                emptyListText={msg.dashboardUtilizationCardDialogEmptyStorageList()}
                thresholds={thresholds}
                utilizationFooterLabel={utilizationFooterLabel}
                onObjectNameClick={dataItem => {
                  applySearch(webadminPlaces.storage, searchPrefixes.storage, [{
                    name: searchFields.name,
                    values: [dataItem.name]
                  }])
                }}
              />
            </div>
          }

          {utilization.vms &&
            <div>
              <ObjectUtilizationListTitle
                text={msg.dashboardUtilizationCardDialogVmListTitle({
                  vmCount: utilization.vms.length
                })}
              />
              <ObjectUtilizationList
                data={utilization.vms}
                unit={unit}
                emptyListText={msg.dashboardUtilizationCardDialogEmptyVmList()}
                thresholds={thresholds}
                utilizationFooterLabel={utilizationFooterLabel}
                onObjectNameClick={dataItem => {
                  applySearch(webadminPlaces.vm, searchPrefixes.vm, [{
                    name: searchFields.name,
                    values: [dataItem.name]
                  }])
                }}
              />
            </div>
          }

        </ModalDialog>

      </div>
    )
  }
}

const dataShape = UtilizationTrendCard.dataShape = {
  used: PropTypes.number,
  total: PropTypes.number,
  overcommit: PropTypes.number,
  allocated: PropTypes.number,
  history: SparklineChart.propTypes.data,
  utilization: PropTypes.shape({
    hosts: PropTypes.arrayOf(PropTypes.shape(ObjectUtilizationList.dataItemShape)),
    storage: PropTypes.arrayOf(PropTypes.shape(ObjectUtilizationList.dataItemShape)),
    vms: PropTypes.arrayOf(PropTypes.shape(ObjectUtilizationList.dataItemShape))
  })
}

UtilizationTrendCard.propTypes = {
  data: PropTypes.shape(dataShape).isRequired,
  title: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  utilizationDialogTitle: PropTypes.string.isRequired,
  showValueAsPercentage: PropTypes.bool,
  donutCenterLabel: DonutChart.propTypes.centerLabel,
  sparklineTooltipType: SparklineChart.propTypes.tooltipType,
  utilizationFooterLabel: ObjectUtilizationList.propTypes.utilizationFooterLabel
}

UtilizationTrendCard.defaultProps = {
  showValueAsPercentage: false,
  donutCenterLabel: DonutChart.defaultProps.centerLabel,
  sparklineTooltipType: SparklineChart.defaultProps.tooltipType,
  utilizationFooterLabel: ObjectUtilizationList.defaultProps.utilizationFooterLabel
}

export default UtilizationTrendCard
