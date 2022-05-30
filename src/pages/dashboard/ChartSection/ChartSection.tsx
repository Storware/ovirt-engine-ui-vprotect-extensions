import { ChartDonut } from '@patternfly/react-charts';
import { Card } from 'primereact/card';
import React from 'react';

interface Props {
  header: string;
  colorScale: string[];
  data: unknown[];
  subTitle: string;
  title: string;
  chartHeader: string;
  additionalText?: string;
}

export const ChartSection = ({
  header,
  data,
  additionalText,
  chartHeader,
  ...props
}: Props) => (
  <Card className="w-100 ml-2">
    <div className={'card-pf-heading'}>
      <h5 className={'font-weight-light'}>{header}</h5>
    </div>
    <hr />
    {data && (
      <div className={'d-flex flex-row justify-content-around'}>
        <div className="d-flex flex-column">
          <h6 className={'text-center card-pf-title'}>{chartHeader}</h6>
          <ChartDonut
            data={data}
            labels={({ datum }) => `${datum.x}: ${datum.y}%`}
            {...props}
          />
        </div>
        {additionalText && (
          <div className={'align-self-center'}>{additionalText}</div>
        )}
      </div>
    )}
  </Card>
);
