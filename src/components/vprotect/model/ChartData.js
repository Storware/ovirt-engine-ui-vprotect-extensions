import {barChartColors} from '../compoenents/chart/colors'

export class ChartData {
  labels = []
  datasets = []

  constructor (numberOfDatasets) {
    for (let i = 0; i < numberOfDatasets; i++) {
      this.datasets.push({
        label: '',
        data: [],
        ...barChartColors[i]
      })
    }
  }
}
