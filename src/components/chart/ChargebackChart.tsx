import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChartData,
  selectPage,
  selectSortBy,
} from 'store/chargeback-chart/selectors';
import { setPage, setSortBy } from 'store/chargeback-chart/actions';
import { HorizontalBar } from 'react-chartjs-2';
import getPaginatedAndSortedData from 'pages/dashboard/chargeback/getPaginatedAndSortedData';
import {
  commonOptions,
  tickOptions,
} from 'pages/dashboard/chargeback/commonOptions';

export default () => {
  const dispatch = useDispatch();
  const chartData = useSelector(selectChartData);
  const sortBy = useSelector(selectSortBy);
  const page = useSelector(selectPage);

  const options = {
    ...commonOptions('xLabel'),
    scales: {
      xAxes: [tickOptions(chartData.datasets[0].data)],
      yAxes: [
        {
          barPercentage: 0.4,
        },
      ],
    },
  };

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

  return (
    <div>
      <HorizontalBar
        data={getPaginatedAndSortedData(chartData, sortBy, page)}
        options={options}
      />
      <div className="d-flex justify-content-between cursor-pointer">
        <div className="d-flex w-25">
          <div onClick={onSortClick('name')} className="d-flex">
            <div className="pt-1 px-2">Sort by Name</div>
            <i
              className={`fa blue-icon d-flex flex-column justify-content-center ${
                sortBy.name === true && 'fa-arrow-down'
              } ${sortBy.name === false && 'fa-arrow-up'}`}
            />
          </div>
          <div onClick={onSortClick('size')} className="d-flex">
            <div className="pt-1 px-2">Sort by size</div>
            <i
              className={`fa blue-icon d-flex flex-column justify-content-center ${
                sortBy.size === true && 'fa-arrow-down'
              } ${sortBy.size === false && 'fa-arrow-up'}`}
            />
          </div>
        </div>

        <div className="d-flex">
          {page > 0 && (
            <div onClick={onPrevClick} className="d-flex">
              <i className="fa fa-arrow-left blue-icon d-flex flex-column justify-content-center" />
              <div className="pt-1 px-2">Previous</div>
            </div>
          )}
          {(page + 1) * 10 < chartData.labels.length && (
            <div onClick={onNextClick} className="d-flex ml-3">
              <div className="pt-1 px-2">Next</div>
              <i className="fa fa-arrow-right blue-icon d-flex flex-column justify-content-center" />
            </div>
          )}
        </div>
        <div className="d-flex w-25 justify-content-end">Page {pagesLabel}</div>
      </div>
    </div>
  );
};
