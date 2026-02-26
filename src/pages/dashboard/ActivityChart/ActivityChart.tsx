import { Bar } from 'react-chartjs-2';
import { Card } from 'primereact/card';
import { useActivityChart } from './useActivityChart';
import { commonSizeOptions, tickSizeOptions } from './commonSizeOptions';

export function ActivityChart() {
  const { chartData } = useActivityChart();

  // Restore options https://github.com/reactchartjs/react-chartjs-2
  return (
    <Card className="w-100 h-100 mt-3">
      <div className={'card-pf-heading'}>
        <h5 className={'font-weight-light'}>Activity</h5>
      </div>
      <hr />
      <div>
        <Bar
          className="w-100"
          data={chartData}
          options={{
            ...commonSizeOptions('y'),
            scales: {
              y: tickSizeOptions(chartData.datasets[0].data),
            },
          }}
          redraw={true}
        />
      </div>
    </Card>
  );
}
