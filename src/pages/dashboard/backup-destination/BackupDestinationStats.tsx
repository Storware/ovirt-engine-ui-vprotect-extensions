import React from 'react';
import { Filesize } from '../../../components/convert/Filesize';
import {
  Accordion,
  AccordionItem,
  AccordionToggle,
  AccordionContent,
  Progress,
} from '@patternfly/react-core';
import { BorderBox } from 'components/border-box/BorderBox';
import { ProgressBar } from 'primereact/progressbar';

export const BackupDestinationStatsComponent = ({ backupDestinationStats }) => {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const toggle = (id: string) => {
    const index = expanded.indexOf(id);
    const newExpanded: string[] =
      index >= 0
        ? [
            ...expanded.slice(0, index),
            ...expanded.slice(index + 1, expanded.length),
          ]
        : [...expanded, id];
    setExpanded(newExpanded);
  };
  return (
    <div className="card-pf">
      <div>
        {backupDestinationStats && (
          <div>
            {backupDestinationStats.totalUsedSpace &&
              backupDestinationStats.totalAvailableSpace && (
                <div className={'padding-top-bottom-10px'}>
                  <div className={'d-flex flex-row justify-content-between'}>
                    <div>Total used space</div>
                    <div>
                      <Filesize bytes={backupDestinationStats.totalUsedSpace} />
                    </div>
                  </div>

                  <div className={'d-flex flex-row justify-content-between'}>
                    <div>Total available space</div>
                    <div>
                      <Filesize
                        bytes={backupDestinationStats.totalAvailableSpace}
                      />
                    </div>
                  </div>
                </div>
              )}

            {backupDestinationStats.backupDestinations.length > 0 && (
              <Accordion asDefinitionList={false}>
                {backupDestinationStats.backupDestinations.map((el, id) => {
                  const usedSpace =
                    (el.totalUsedSpace / el.totalAvailableSpace) * 100;
                  const usedDedupSpace =
                    (el.totalDedupUsedSpace / el.totalDedupAvailableSpace) *
                    100;
                  const reductionRatio =
                    (1 - el.totalDedupUsedSpace / el.totalUsedSpace) * 100;
                  return (
                    <AccordionItem key={el.guid}>
                      <AccordionToggle
                        id={el.guid}
                        onClick={() => toggle(el.guid)}
                        isExpanded={expanded.includes(el.guid)}
                        style={{ fontSize: '1rem' }}
                      >
                        {el.name}
                      </AccordionToggle>
                      <AccordionContent
                        id={el.guid}
                        isHidden={!expanded.includes(el.guid)}
                        isFixed
                        className="border-box"
                        style={{ maxHeight: '300px' }}
                      >
                        {!(el.totalUsedSpace || el.totalAvailableSpace) && (
                          <BorderBox heading={'No data'}></BorderBox>
                        )}

                        {!el.totalAvailableSpace && el.totalUsedSpace && (
                          <div
                            key={el.guid + 'totalUsedSpace'}
                            className={'w-100'}
                          >
                            <h3>Used space</h3>
                            {el.totalUsedSpace}
                          </div>
                        )}

                        {el.totalAvailableSpace && (
                          <div>
                            <BorderBox heading={'Used space'}>
                              <div
                                key={el.guid + 'progressBar'}
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
                                    <Filesize bytes={el.totalUsedSpace} /> /{' '}
                                    <Filesize bytes={el.totalAvailableSpace} />
                                  </span>
                                </div>

                                <ProgressBar
                                  className="progress-bar-element"
                                  value={usedSpace.toFixed(2)}
                                  showValue={true}
                                />
                              </div>
                            </BorderBox>
                            {el.totalDedupUsedSpace && (
                              <div>
                                <BorderBox
                                  heading={'Used Space (Deduplicated)'}
                                >
                                  <div
                                    key={el.guid + 'progressBar'}
                                    className={'w-100'}
                                  >
                                    <div
                                      className={
                                        'd-flex flex-row justify-content-between'
                                      }
                                    >
                                      <span className={'color-black'}>
                                        {usedDedupSpace.toFixed(2)}%
                                      </span>
                                      <span className={'color-black'}>
                                        <Filesize
                                          bytes={el.totalDedupUsedSpace}
                                        />{' '}
                                        /{' '}
                                        <Filesize
                                          bytes={el.totalDedupAvailableSpace}
                                        />
                                      </span>
                                    </div>
                                    <ProgressBar
                                      className="progress-bar-element"
                                      value={usedDedupSpace.toFixed(2)}
                                      showValue={true}
                                    />
                                  </div>
                                </BorderBox>
                              </div>
                            )}
                            {el.totalDedupUsedSpace &&
                              1 - el.totalDedupUsedSpace / el.totalUsedSpace >
                                0 && (
                                <div>
                                  <BorderBox heading={'Reduction Ratio'}>
                                    <div
                                      key={el.guid + 'progressBar'}
                                      className={'w-100'}
                                    >
                                      <div
                                        className={
                                          'd-flex flex-row justify-content-between'
                                        }
                                      >
                                        <span className={'color-black'}>
                                          {reductionRatio.toFixed(2)}%
                                        </span>
                                      </div>

                                      <ProgressBar
                                        className="progress-bar-element"
                                        value={reductionRatio.toFixed(2)}
                                        showValue={true}
                                      />
                                    </div>
                                  </BorderBox>
                                </div>
                              )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
