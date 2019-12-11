import React from 'react'
import PropTypes from 'prop-types'
import {VprotectService} from '../../../services/vprotect-service'
import {Button, DonutChart, ListView, ListViewItem, PieChart, ProgressBar, Toolbar} from 'patternfly-react'
import {Filesize} from '../convert/Filezize'

export class Dashboard extends React.Component {
  vprotectService = new VprotectService()

  constructor (props) {
    super(props)

    this.state = {
      protection: null,
      backupStats: null,
      stagingSpace: [],
      backupDestinationStats: null
    }
  }

  componentDidMount () {
    this.vprotectService.getDashboardProtectionInfo().then(result => {
      this.setState({protection: result})
    })
    this.vprotectService.getDashboardBackupStats().then(result => {
      this.setState({backupStats: result})
    })
    this.vprotectService.getDashboardStagingSpaceInfo().then(result => {
      this.setState({stagingSpace: result})
    })
    this.vprotectService.getDashboardBackupDestinationStats().then(result => {
      this.setState({backupDestinationStats: result})
    })
  }

  render () {
    return (
      <div>
        <Toolbar>
          <div className={'d-flex flex-row justify-content-between'}>
            <div>
              Timezone: {JSON.parse(localStorage.getItem('user')).uiTimeZone}
            </div>
            <div className={'form-group'}>
              <Button className={'btn btn-default'} onClick={() => {
                this.vprotectService.getAllHypervisorManagers().then(hypervisorManagers => {
                  this.vprotectService.submitTaskSync({
                    hypervisorManagers: hypervisorManagers.filter(el => el.type.name === 'RHV').map(el => {
                      return {guid: el.guid}
                    })
                  })
                })

              }}>Synchronize inventory</Button>
            </div>
          </div>
        </Toolbar>
        <div className={'container-fluid padding-top-20px'}>
          <div className='col-md-6'>
            <div className='card-pf'>
              <div className={'card-pf-heading'}>
                <div>
                  <h3>Protection stats</h3>
                </div>
              </div>
              {this.state.protection &&
              <div className='card-pf-body pie-chart-with-title-container'>
                <div className='col-md-6'>
                  <h3 className={'text-center card-pf-title'}>VIRTUAL ENVIRONMENTS</h3>
                  <div>
                    <PieChart
                      id="virtual-environments"
                      size={{width: 251, height: 161}}
                      data={{
                        colors: {
                          'Protected': '#34bfa3',
                          'Not Protected': '#f22d4e',
                          'Not Scheduled': '#666666',
                        },
                        columns: [
                          ['Protected', this.state.protection.vm.protectedNo],
                          ['Not Protected', this.state.protection.vm.notProtected],
                          ['Not Scheduled', this.state.protection.vm.noSchedule],
                        ],
                        type: 'pie'
                      }}
                      legend={{
                        show: true,
                        position: 'right'
                      }}
                    />
                  </div>
                </div>

                <div className='col-md-6'>
                  <h3 className={'text-center card-pf-title'}>APPLICATIONS</h3>
                  <div>
                    <PieChart
                      id="applications"
                      size={{width: 251, height: 161}}
                      data={{
                        colors: {
                          'Protected': '#34bfa3',
                          'Not Protected': '#f22d4e',
                          'Not Scheduled': '#666666',
                        },
                        columns: [
                          ['Protected', this.state.protection.app.protectedNo],
                          ['Not Protected', this.state.protection.app.notProtected],
                          ['Not Scheduled', this.state.protection.app.noSchedule],
                        ],
                        type: 'pie'
                      }}
                      legend={{
                        show: true,
                        position: 'right'
                      }}
                    />
                  </div>
                </div>
              </div>}

            </div>
          </div>

          <div className={'col-md-6'}>
            <div className='card-pf'>
              {this.state.backupStats &&
              <div>
                <div className={'card-pf-heading'}>
                  <div>
                    <h3>Success Rate</h3>
                  </div>
                  <div>
                    <h3 className={'card-pf-title'}>LAST 24H</h3>
                  </div>
                </div>
                <div className={'d-flex flex-row justify-content-around'}>
                  <div>
                    <DonutChart
                      id="donunt-chart-1"
                      size={{width: 210, height: 210}}
                      data={{
                        colors: {
                          'Success': '#34bfa3',
                          'Failed': '#f22d4e',
                          'In progress': '#666666',
                        },
                        columns: [
                          ['Success', this.state.backupStats.successfulBackups],
                          ['In progress', this.state.backupStats.backupsInProgress],
                          ['Failed', this.state.backupStats.failedBackups],
                        ],
                        groups: [
                          ['Success', 'In progress', 'Failed']
                        ],
                        order: null,

                      }}
                      tooltip={{show: true}}
                      title={{secondary: 'tasks'}}
                    />
                  </div>
                  <div className={'align-self-center'}>
                    Total data protected: <Filesize bytes={this.state.backupStats.totalDataProtected}/>
                  </div>
                </div>
              </div>}
            </div>
          </div>

          <div className={'col-md-6'}>
            <div className='card-pf'>
              <div>
                <div className={'card-pf-heading'}>
                  <div>
                    <h3>Staging Space</h3>
                  </div>
                  <div>
                    <h3 className={'card-pf-title'}>STAGING UTILIZATION PER NODE</h3>
                  </div>
                </div>
                <ListView>
                  {this.state.stagingSpace.length > 0 && this.state.stagingSpace.map((el) => {
                    let usedSpace = el.totalSpace - el.availableSpace
                    let percentage = usedSpace / el.totalSpace * 100
                    return (
                      <ListViewItem key={el.node.name}
                                    additionalInfo={[
                                      <div key={el.node.name + 'progressBar'} className={'w-100'}>
                                        <div className={'d-flex flex-row justify-content-between'}>
                                          <span className={'color-black'}>{percentage.toFixed(2)}%</span>
                                          <span className={'color-black'}><Filesize bytes={usedSpace}/> / <Filesize
                                            bytes={el.totalSpace}/></span>
                                        </div>
                                        <ProgressBar now={percentage}/>
                                      </div>
                                    ]}
                                    heading={el.node.name}
                      />
                    )
                  })}
                </ListView>
              </div>
            </div>
          </div>

          <div className={'col-md-6'}>
            <div className='card-pf'>
              <div>
                <div className={'card-pf-heading'}>
                  <h3>Backup Destinations</h3>
                </div>
                {this.state.backupDestinationStats &&
                <div>
                  {this.state.backupDestinationStats.totalUsedSpace && this.state.backupDestinationStats.totalAvailableSpace &&
                  <div className={'padding-top-bottom-10px'}>
                    <div className={'d-flex flex-row justify-content-between'}>
                      <div>
                        Total used space
                      </div>
                      <div>
                        <Filesize bytes={this.state.backupDestinationStats.totalUsedSpace}/>
                      </div>
                    </div>

                    <div className={'d-flex flex-row justify-content-between'}>
                      <div>
                        Total available space
                      </div>
                      <div>
                        <Filesize bytes={this.state.backupDestinationStats.totalAvailableSpace}/>
                      </div>
                    </div>
                  </div>
                  }


                  <ListView>
                    {this.state.backupDestinationStats.backupDestinations.length > 0 && this.state.backupDestinationStats.backupDestinations.map((el) => {
                      let usedSpace = el.totalUsedSpace / el.totalAvailableSpace * 100
                      let usedDedupSpace = el.totalDedupUsedSpace / el.totalDedupAvailableSpace * 100
                      let reductionRatio = (1 - (el.totalDedupUsedSpace / el.totalUsedSpace)) * 100

                      return (
                        <ListViewItem key={el.guid}
                                      heading={el.name}
                                      hideCloseIcon={true}>
                          {!(el.totalUsedSpace || el.totalAvailableSpace) &&
                          <ListViewItem
                                        heading={`No data`}
                          />}

                          {!el.totalAvailableSpace && el.totalUsedSpace &&
                          <ListViewItem additionalInfo={[
                                          <div key={el.guid + `totalUsedSpace`} className={'w-100'}>
                                            {el.totalUsedSpace}
                                          </div>
                                        ]}
                                        heading={'Used space'}
                          />}


                          {el.totalAvailableSpace &&
                          <div>
                            <ListViewItem additionalInfo={[
                                            <div key={el.guid + `progressBar`} className={'w-100'}>
                                              <div className={'d-flex flex-row justify-content-between'}>
                                                <span className={'color-black'}>{usedSpace.toFixed(2)}%</span>
                                                <span className={'color-black'}><Filesize
                                                  bytes={el.totalUsedSpace}/> / <Filesize bytes={el.totalAvailableSpace}/></span>
                                              </div>
                                              <ProgressBar now={usedSpace}/>
                                            </div>
                                          ]}
                                          heading={'Used space'}
                            />
                            {el.totalDedupUsedSpace &&
                            <div>
                              <ListViewItem additionalInfo={[
                                              <div key={el.guid + `progressBar`} className={'w-100'}>
                                                <div className={'d-flex flex-row justify-content-between'}>
                                                  <span className={'color-black'}>{usedDedupSpace.toFixed(2)}%</span>
                                                  <span className={'color-black'}><Filesize
                                                    bytes={el.totalDedupUsedSpace}/> / <Filesize bytes={el.totalDedupAvailableSpace}/></span>
                                                </div>
                                                <ProgressBar now={usedDedupSpace}/>
                                              </div>
                                            ]}
                                            heading={'Used Space (Deduplicated)'}
                              />
                            </div>}
                            {el.totalDedupUsedSpace && (1 - (el.totalDedupUsedSpace / el.totalUsedSpace) > 0) &&
                            <div>
                              <ListViewItem additionalInfo={[
                                              <div key={el.guid + `progressBar`} className={'w-100'}>
                                                <div className={'d-flex flex-row justify-content-between'}>
                                                  <span className={'color-black'}>{reductionRatio.toFixed(2)}%</span>
                                                </div>
                                                <ProgressBar now={reductionRatio}/>
                                              </div>
                                            ]}
                                            heading={'Reduction Ratio'}
                              />
                            </div>}
                          </div>}
                        </ListViewItem>
                      )
                    })}
                  </ListView>
                </div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  user: PropTypes.any.isRequired
}
