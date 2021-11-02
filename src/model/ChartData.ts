import { barChartColors } from 'components/chart/colors';

export class ChartData {
  labels = [];
  datasets = [];
  max: number;

  constructor(numberOfDatasets) {
    for (let i = 0; i < numberOfDatasets; i++) {
      this.datasets.push({
        label: '',
        data: [],
        ...barChartColors[i],
      });
    }
  }
}
