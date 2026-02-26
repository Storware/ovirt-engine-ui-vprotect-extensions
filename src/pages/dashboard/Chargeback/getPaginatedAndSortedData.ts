import getPaginatedData from 'pages/dashboard/Chargeback/getPaginatedData';
import getSortedData from 'pages/dashboard/Chargeback/getSortedData';

export default (chartData, sortBy, page) =>
  getPaginatedData(getSortedData(chartData, sortBy), page);
