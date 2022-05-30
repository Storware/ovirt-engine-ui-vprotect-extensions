import getPaginatedData from 'pages/dashboard/chargeback/getPaginatedData';
import getSortedData from 'pages/dashboard/chargeback/getSortedData';

export default (chartData, sortBy, page) =>
  getPaginatedData(getSortedData(chartData, sortBy), page);
