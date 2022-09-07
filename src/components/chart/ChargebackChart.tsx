import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChartData,
  selectPage,
  selectSortBy,
} from 'store/chargeback-chart/selectors';
import { setPage, setSortBy } from 'store/chargeback-chart/actions';
import getPaginatedAndSortedData from 'pages/dashboard/chargeback/getPaginatedAndSortedData';
import { Chart } from 'primereact/chart';
import {
  commonSizeOptions,
  tickSizeOptions,
} from 'pages/dashboard/chargeback/commonSizeOptions';

type SortType = 'name' | 'size';

export default () => {
  const dispatch = useDispatch();
  const chartData = useSelector(selectChartData);
  const sortBy = useSelector(selectSortBy);
  const page = useSelector(selectPage);

  const onSortClick = (property: SortType) => () => {
    Object.keys(sortBy).forEach((key) => {
      if (key !== property) {
        sortBy[key] = null;
      }
    });

    switch (sortBy[property]) {
      case true:
        sortBy[property] = false;
        break;
      case false:
        sortBy[property] = null;
        break;
      case null:
        sortBy[property] = true;
        break;
    }

    dispatch(setSortBy({ ...sortBy }));
  };

  const onPrevClick = () => {
    dispatch(setPage(page - 1));
  };

  const onNextClick = () => {
    dispatch(setPage(page + 1));
  };

  const pagesLabel = `${page + 1}/${
    Math.floor((chartData.labels.length - 1) / 10) + 1
  }`;

  if (chartData.labels.length === 0) {
    return (
      <div className="text-center">
        <h6 className="text-muted font-weight-lighter">No data</h6>
      </div>
    );
  }

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
    ...commonSizeOptions('x'),
    scales: {
      x: tickSizeOptions(chartData.datasets[0].data),
    },
  };

  const SortBy = ({ type }: { type: SortType }) => (
    <div onClick={onSortClick(type)} className="d-flex cursor-pointer">
      <div className="pt-1 px-2 text-capitalize">{type}</div>
      <i
        className={`pi blue-icon d-flex flex-column justify-content-center ${
          sortBy[type] === true && 'pi-angle-down'
        } ${sortBy[type] === false && 'pi-angle-up'}`}
      />
    </div>
  );

  const PaginationArrow = ({ className = '', ...props }) => (
    <div
      {...props}
      className={`d-flex mr-3 pi blue-icon d-flex flex-column justify-content-center cursor-pointer ${className}`}
    ></div>
  );

  return (
    <div>
      <Chart
        className={'w-100'}
        type="bar"
        data={getPaginatedAndSortedData(chartData, sortBy, page)}
        options={options}
      />
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <div className="pt-1 px-2">Sort by:</div>
          <SortBy type="name" />
          <SortBy type="size" />
        </div>

        <div className="d-flex">
          {page > 0 && (
            <PaginationArrow
              onClick={onPrevClick}
              className="mr-3 pi-angle-left"
            />
          )}
          <div className="d-flex justify-content-end">Page {pagesLabel}</div>
          {(page + 1) * 10 < chartData.labels.length && (
            <PaginationArrow
              onClick={onNextClick}
              className="ml-3 pi-angle-right"
            />
          )}
        </div>
      </div>
    </div>
  );
};
