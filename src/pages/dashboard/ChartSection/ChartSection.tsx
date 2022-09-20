import { ChartDonut } from '@patternfly/react-charts';
import { Card } from 'primereact/card';
import React from 'react';

interface Data {
  x: string;
  y: number;
}

interface Props {
  header: string;
  colorScale: string[];
  data: Data[] | undefined;
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
}: Props) => {
  const sumValues: number =
    data === undefined ? 0 : data.reduce((a, b) => a + b.y, 0);

  const calcPercent = (value: number): number =>
    sumValues === 0 ? 0 : parseInt(((value / sumValues) * 100).toFixed(0), 10);

  return (
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
              innerRadius={80}
              data={data}
              labels={({ datum }) => `${datum.x}: ${calcPercent(datum.y)}%`}
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
};
