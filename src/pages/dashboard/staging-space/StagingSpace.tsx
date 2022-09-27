import React from 'react';
import { BorderBox } from 'components/border-box/BorderBox';
import { Filesize } from '../../../components/convert/Filesize';
import { ProgressBar } from 'primereact/progressbar';

export const StagingSpace = ({ stagingSpace }) => (
  <div className="card-pf">
    <div>
      <div className={'card-pf-heading'}>
        <h6 className={'card-pf-title'}>STAGING UTILIZATION PER NODE</h6>
      </div>

      {stagingSpace.length > 0 &&
        stagingSpace.map((el) => {
          const usedSpace = el.totalSpace - el.availableSpace;
          const percentage = (usedSpace / el.totalSpace) * 100;
          return (
            <BorderBox key={el.node.name} heading={el.node.name}>
              <div key={el.node.name + 'Progress'} className={'w-100'}>
                <div className={'d-flex flex-row justify-content-between'}>
                  <span className={'color-black'}>
                    {percentage.toFixed(2)}%
                  </span>
                  <span className={'color-black'}>
                    <Filesize bytes={usedSpace} /> /{' '}
                    <Filesize bytes={el.totalSpace} />
                  </span>
                </div>

                <ProgressBar
                  className="progress-bar-element"
                  value={percentage.toFixed(2)}
                  showValue={true}
                />
              </div>
            </BorderBox>
          );
        })}
    </div>
  </div>
);
