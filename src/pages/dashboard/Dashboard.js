import React from 'react';
import { vprotectService } from '../../services/vprotect-service';
import { hypervisorsService } from '../../services/hypervisors-service';
import {
  DonutChart,
  ListView,
  ListViewItem,
  ProgressBar,
  Toolbar,
} from 'patternfly-react';
import { Filesize } from '../../components/convert/Filesize';
import { TIMEZONES } from 'model/timezones';
import { user } from '../../utils/user';
import isNotOpenstackBuild from 'utils/isNotOpenstackBuild';
import Chargeback from './chargeback/Chargeback';
import ActivityChart from './activity/ActivityChart';
import { Card } from 'primereact/card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { version } from '../../../package.json';

const fullTimeZoneName =
  user &&
  TIMEZONES.find((el) => el.utc.some((utc) => user.uiTimeZone === utc)).text;

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      protection: null,
      backupStats: null,
      stagingSpace: [],
      backupDestinationStats: null,
    };

    vprotectService.getDashboardProtectionInfo().then((result) => {
      this.setState({ protection: result });
    });
    vprotectService.getDashboardBackupStats().then((result) => {
      this.setState({ backupStats: result });
    });
    vprotectService.getDashboardStagingSpaceInfo().then((result) => {
      this.setState({ stagingSpace: result });
    });
    vprotectService.getDashboardBackupDestinationStats().then((result) => {
      this.setState({ backupDestinationStats: result });
    });
  }

  render() {
    return (
      <div>
        <Toolbar>
          <div className={'d-flex flex-row justify-content-between'}>
            <div>Timezone: {fullTimeZoneName}</div>
            <div>Plugin version: {version}</div>
            {isNotOpenstackBuild && (
              <div className={'form-group'}>
                <Button
                  label="Synchronize inventory"
                  onClick={() => {
                    hypervisorsService
                      .getAllHypervisorManagers()
                      .then((hypervisorManagers) => {
                        vprotectService.submitTaskSync({
                          hypervisorManagers: hypervisorManagers
                            .filter((el) => el.type.name === 'RHV')
                            .map((el) => {
                              return { guid: el.guid };
                            }),
                        });
                      });
                  }}
                />
              </div>
            )}
          </div>
        </Toolbar>
        <div className={'container-fluid pt-4'}>
          <div className="d-flex w-100">
            <Card className="w-100 mr-2">
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Protection stats</h5>
              </div>
              <hr/>
              {this.state.protection && (
                <div className="card-pf-body pie-chart-with-title-container text-center">
                  <h6 className={'text-center font-weight-light card-pf-title'}>
                    VIRTUAL MACHINES
                  </h6>

                  <div>
                    <DonutChart
                      id="virtual-environments"
                      data={{
                        colors: {
                          Protected: '#34bfa3',
                          'Not Protected': '#f22d4e',
                          'Not Scheduled': '#b2b2b2',
                        },
                        columns: [
                          ['Protected', this.state.protection.vm.protectedNo],
                          [
                            'Not Protected',
                            this.state.protection.vm.notProtected,
                          ],
                          [
                            'Not Scheduled',
                            this.state.protection.vm.noSchedule,
                          ],
                        ],
                        groups: [
                          ['Protected', 'Not Protected', 'Not Scheduled'],
                        ],
                        // type: 'pie'
                      }}
                      tooltip={{ show: true }}
                      title={{ secondary: 'VMs' }}
                    />
                  </div>
                </div>
              )}
            </Card>
            <Card className="w-100 ml-2">
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Success Rate</h5>
              </div>
              <hr/>
              {this.state.backupStats && (
                <div className={'d-flex flex-row justify-content-around'}>
                  <div className="d-flex flex-column">
                    <h6 className={'text-center card-pf-title'}>LAST 24H</h6>
                    <DonutChart
                      id="donunt-chart-1"
                      size={{ width: 210, height: 167 }}
                      data={{
                        colors: {
                          Success: '#34bfa3',
                          Failed: '#f22d4e',
                          'In progress': '#b2b2b2',
                        },
                        columns: [
                          ['Success', this.state.backupStats.successful],
                          ['In progress', this.state.backupStats.inProgress],
                          ['Failed', this.state.backupStats.failed],
                        ],
                        groups: [['Success', 'In progress', 'Failed']],
                        order: null,
                      }}
                      tooltip={{ show: true }}
                      title={{ secondary: 'tasks' }}
                    />
                  </div>
                  <div className={'align-self-center'}>
                    Total data protected: {this.state.backupStats.totalData}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {isNotOpenstackBuild && (
            <div className={'col-md-6'}>
              <div className="card-pf">
                <div>
                  <div className={'card-pf-heading'}>
                    <div>
                      <h5>Staging Space</h5>
                    </div>
                    <div>
                      <h6 className={'card-pf-title'}>
                        STAGING UTILIZATION PER NODE
                      </h6>
                    </div>
                  </div>
                  <ListView>
                    {this.state.stagingSpace.length > 0 &&
                      this.state.stagingSpace.map((el) => {
                        let usedSpace = el.totalSpace - el.availableSpace;
                        let percentage = (usedSpace / el.totalSpace) * 100;
                        return (
                          <ListViewItem
                            key={el.node.name}
                            additionalInfo={[
                              <div
                                key={el.node.name + 'progressBar'}
                                className={'w-100'}
                              >
                                <div
                                  className={
                                    'd-flex flex-row justify-content-between'
                                  }
                                >
                                  <span className={'color-black'}>
                                    {percentage.toFixed(2)}%
                                  </span>
                                  <span className={'color-black'}>
                                    <Filesize bytes={usedSpace} /> /{' '}
                                    <Filesize bytes={el.totalSpace} />
                                  </span>
                                </div>
                                <ProgressBar now={percentage} />
                              </div>,
                            ]}
                            heading={el.node.name}
                          />
                        );
                      })}
                  </ListView>
                </div>
              </div>
            </div>
          )}

          {isNotOpenstackBuild && (
            <div className={'col-md-6'}>
              <div className="card-pf">
                <div>
                  <div className={'card-pf-heading'}>
                    <h6>Backup Destinations</h6>
                  </div>
                  {this.state.backupDestinationStats && (
                    <div>
                      {this.state.backupDestinationStats.totalUsedSpace &&
                        this.state.backupDestinationStats
                          .totalAvailableSpace && (
                          <div className={'padding-top-bottom-10px'}>
                            <div
                              className={
                                'd-flex flex-row justify-content-between'
                              }
                            >
                              <div>Total used space</div>
                              <div>
                                <Filesize
                                  bytes={
                                    this.state.backupDestinationStats
                                      .totalUsedSpace
                                  }
                                />
                              </div>
                            </div>

                            <div
                              className={
                                'd-flex flex-row justify-content-between'
                              }
                            >
                              <div>Total available space</div>
                              <div>
                                <Filesize
                                  bytes={
                                    this.state.backupDestinationStats
                                      .totalAvailableSpace
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}

                      <ListView>
                        {this.state.backupDestinationStats.backupDestinations
                          .length > 0 &&
                          this.state.backupDestinationStats.backupDestinations.map(
                            (el) => {
                              let usedSpace =
                                (el.totalUsedSpace / el.totalAvailableSpace) *
                                100;
                              let usedDedupSpace =
                                (el.totalDedupUsedSpace /
                                  el.totalDedupAvailableSpace) *
                                100;
                              let reductionRatio =
                                (1 -
                                  el.totalDedupUsedSpace / el.totalUsedSpace) *
                                100;

                              return (
                                <ListViewItem
                                  key={el.guid}
                                  heading={el.name}
                                  hideCloseIcon
                                >
                                  {!(
                                    el.totalUsedSpace || el.totalAvailableSpace
                                  ) && <ListViewItem heading={`No data`} />}

                                  {!el.totalAvailableSpace &&
                                    el.totalUsedSpace && (
                                      <ListViewItem
                                        additionalInfo={[
                                          <div
                                            key={el.guid + `totalUsedSpace`}
                                            className={'w-100'}
                                          >
                                            {el.totalUsedSpace}
                                          </div>,
                                        ]}
                                        heading={'Used space'}
                                      />
                                    )}

                                  {el.totalAvailableSpace && (
                                    <div>
                                      <ListViewItem
                                        additionalInfo={[
                                          <div
                                            key={el.guid + `progressBar`}
                                            className={'w-100'}
                                          >
                                            <div
                                              className={
                                                'd-flex flex-row justify-content-between'
                                              }
                                            >
                                              <span className={'color-black'}>
                                                {usedSpace.toFixed(2)}%
                                              </span>
                                              <span className={'color-black'}>
                                                <Filesize
                                                  bytes={el.totalUsedSpace}
                                                />{' '}
                                                /{' '}
                                                <Filesize
                                                  bytes={el.totalAvailableSpace}
                                                />
                                              </span>
                                            </div>
                                            <ProgressBar now={usedSpace} />
                                          </div>,
                                        ]}
                                        heading={'Used space'}
                                      />
                                      {el.totalDedupUsedSpace && (
                                        <div>
                                          <ListViewItem
                                            additionalInfo={[
                                              <div
                                                key={el.guid + `progressBar`}
                                                className={'w-100'}
                                              >
                                                <div
                                                  className={
                                                    'd-flex flex-row justify-content-between'
                                                  }
                                                >
                                                  <span
                                                    className={'color-black'}
                                                  >
                                                    {usedDedupSpace.toFixed(2)}%
                                                  </span>
                                                  <span
                                                    className={'color-black'}
                                                  >
                                                    <Filesize
                                                      bytes={
                                                        el.totalDedupUsedSpace
                                                      }
                                                    />{' '}
                                                    /{' '}
                                                    <Filesize
                                                      bytes={
                                                        el.totalDedupAvailableSpace
                                                      }
                                                    />
                                                  </span>
                                                </div>
                                                <ProgressBar
                                                  now={usedDedupSpace}
                                                />
                                              </div>,
                                            ]}
                                            heading={
                                              'Used Space (Deduplicated)'
                                            }
                                          />
                                        </div>
                                      )}
                                      {el.totalDedupUsedSpace &&
                                        1 -
                                          el.totalDedupUsedSpace /
                                            el.totalUsedSpace >
                                          0 && (
                                          <div>
                                            <ListViewItem
                                              additionalInfo={[
                                                <div
                                                  key={el.guid + `progressBar`}
                                                  className={'w-100'}
                                                >
                                                  <div
                                                    className={
                                                      'd-flex flex-row justify-content-between'
                                                    }
                                                  >
                                                    <span
                                                      className={'color-black'}
                                                    >
                                                      {reductionRatio.toFixed(
                                                        2,
                                                      )}
                                                      %
                                                    </span>
                                                  </div>
                                                  <ProgressBar
                                                    now={reductionRatio}
                                                  />
                                                </div>,
                                              ]}
                                              heading={'Reduction Ratio'}
                                            />
                                          </div>
                                        )}
                                    </div>
                                  )}
                                </ListViewItem>
                              );
                            },
                          )}
                      </ListView>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="d-flex align-items-stretch">
          <Card className="w-100 mr-3 mt-3">

          <div>
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Backup Size</h5>
              </div>
              <hr/>
              <div>
                <Chargeback />
              </div>
            </div>
          </Card>
            <Card className="w-100 mt-3">

            <div>
              <div className={'card-pf-heading'}>
                <h5 className={'font-weight-light'}>Activity</h5>
              </div>
              <hr/>
              <div>
                <ActivityChart />
              </div>
            </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}
