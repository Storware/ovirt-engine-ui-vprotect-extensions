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

export default () => {
  const dispatch = useDispatch();
  const chartData = useSelector(selectChartData);
  const sortBy = useSelector(selectSortBy);
  const page = useSelector(selectPage);

  const onSortClick = (property) => () => {
    Object.keys(sortBy).forEach((el) => {
      if (el !== property) {
        sortBy[el] = null;
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

  return (
    <div>
      <Chart
        type="bar"
        data={getPaginatedAndSortedData(chartData, sortBy, page)}
        options={options}
      />
      <div className="d-flex justify-content-between cursor-pointer">
        <div className="d-flex w-25">
          <div className="pt-1 px-2">Sort by:</div>
          <div onClick={onSortClick('name')} className="d-flex">
            <div className="pt-1 px-2">Name</div>
            <i
              className={`pi blue-icon d-flex flex-column justify-content-center ${
                sortBy.name === true && 'pi-angle-down'
              } ${sortBy.name === false && 'pi-angle-up'}`}
            />
          </div>
          <div onClick={onSortClick('size')} className="d-flex">
            <div className="pt-1 px-2">Size</div>
            <i
              className={`pi blue-icon d-flex flex-column justify-content-center ${
                sortBy.size === true && 'pi-angle-down'
              } ${sortBy.size === false && 'pi-angle-up'}`}
            />
          </div>
        </div>

        <div className="d-flex">
          {page > 0 && (
            <div onClick={onPrevClick} className="d-flex">
              <i className="pi pi-angle-left blue-icon d-flex flex-column justify-content-center" />
              <div className="pt-1 px-2">Previous</div>
            </div>
          )}
          {(page + 1) * 10 < chartData.labels.length && (
            <div onClick={onNextClick} className="d-flex ml-3">
              <div className="pt-1 px-2">Next</div>
              <i className="pi pi-angle-right blue-icon d-flex flex-column justify-content-center" />
            </div>
          )}
        </div>
        <div className="d-flex w-25 justify-content-end">Page {pagesLabel}</div>
      </div>
    </div>
  );
};
