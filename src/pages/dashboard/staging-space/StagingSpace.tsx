import React from 'react';
import { BorderBox } from 'components/border-box/BorderBox';
import {
  AccordionContent,
  AccordionItem,
  AccordionToggle,
  Progress,
} from '@patternfly/react-core';
import { Filesize } from '../../../components/convert/Filesize';
import { Accordion } from 'primereact/accordion';

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
                <Progress value={percentage} />
              </div>
            </BorderBox>
          );
        })}
    </div>
  </div>
);
