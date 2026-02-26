import { ProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { BorderBox } from '@/components/BorderBox';
import { AdvancedFile } from '@/model/AdvancedFile';

export const StagingSpaceUI = ({ stagingSpace }: any) => (
  <Card className="w-100 mr-3 mt-3">
    <div>
      <div className={'card-pf-heading'}>
        <h5 className={'font-weight-light'}>Staging Space</h5>
      </div>
      <hr />
      <div>
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
                      <div
                        className={'d-flex flex-row justify-content-between'}
                      >
                        <span className={'color-black'}>
                          {percentage.toFixed(2)}%
                        </span>
                        <span className={'color-black'}>
                          <span>{AdvancedFile.formatFileSize(usedSpace)}</span>
                          {' / '}
                          <span>
                            {AdvancedFile.formatFileSize(el.totalSpace)}
                          </span>
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
      </div>
    </div>
  </Card>
);
