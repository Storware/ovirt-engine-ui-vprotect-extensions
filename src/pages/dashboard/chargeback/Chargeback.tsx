import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChartData,
  selectPage,
  selectPaginatedChartData,
  selectSortBy,
  selectSortedChartData,
} from 'store/chargeback-chart/selectors';
import getFileSize from 'utils/getFileSize';
import {
  getChargeBackData,
  setPaginatedChargebackData,
  setSortBy,
  setSortedChargebackData,
} from 'store/chargeback-chart/actions';
import { Bar, HorizontalBar } from 'react-chartjs-2';

export default () => {
  const dispatch = useDispatch();
  const chartData = useSelector(selectChartData);
  const sortedChartData = useSelector(selectSortedChartData);
  const paginatedChartData = useSelector(selectPaginatedChartData);
  const sortBy = useSelector(selectSortBy);
  const page = useSelector(selectPage);

  useEffect(() => {
    dispatch(getChargeBackData);
  }, []);

  const options = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: true,
    tooltips: {
      callbacks: {
        label: (tooltipItem) => {
          return `Size: ${getFileSize(tooltipItem.xLabel)}`;
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (value) => {
              return getFileSize(value);
            },
            min: 0,
            max: Math.max(...chartData.datasets[0].data),
            stepSize: Math.max(...chartData.datasets[0].data) / 10,
          },
        },
      ],
      yAxes: [
        {
          barThickness: 20,
        },
      ],
    },
  };

  const sortData = async () => {
    if (sortBy.size === null && sortBy.name === null) {
      await dispatch(setSortedChargebackData({ ...chartData }));
      return;
    }

    let labelsAndDataMergedAndSorted = chartData.labels.map((el, index) => {
      return {
        label: el,
        dataValue: chartData.datasets[0].data[index],
      };
    });

    if (sortBy.size !== null) {
      labelsAndDataMergedAndSorted = labelsAndDataMergedAndSorted.sort((a, b) =>
        sortBy.size ? b.dataValue - a.dataValue : a.dataValue - b.dataValue,
      );
    }

    if (sortBy.name !== null) {
      labelsAndDataMergedAndSorted = labelsAndDataMergedAndSorted.sort(
        (a, b) => {
          const x = a.label.toLowerCase();
          const y = b.label.toLowerCase();
          const sortValue = x <= y ? -1 : 1;
          return sortBy.name ? sortValue : -sortValue;
        },
      );
    }

    await dispatch(
      setSortedChargebackData({
        labels: labelsAndDataMergedAndSorted.map((el) => el.label),
        datasets: [
          {
            label: 'Size',
            data: labelsAndDataMergedAndSorted.map((el) => el.dataValue),
          },
        ],
      }),
    );
  };

  const getPaginatedData = async () => {
    await sortData();
    const startIndex = page * 10;
    const labels = sortedChartData.labels.slice(startIndex, startIndex + 10);
    const data = sortedChartData.datasets[0].data.slice(
      startIndex,
      startIndex + 10,
    );

    await dispatch(
      setPaginatedChargebackData({
        labels,
        datasets: [
          {
            label: 'Size',
            data,
          },
        ],
      }),
    );
  };

  const onSortClick = async (property) => {
    const sortByTmp = sortBy;
    Object.keys(sortByTmp).forEach((el) => {
      if (el !== property) {
        sortByTmp[el] = null;
      }
    });

    switch (sortByTmp[property]) {
      case true:
        sortByTmp[property] = false;
        break;
      case false:
        sortByTmp[property] = null;
        break;
      case null:
        sortByTmp[property] = true;
        break;
    }

    await dispatch(setSortBy(sortByTmp));
    await getPaginatedData();
  };

  const getPagesLabel = `${page + 1}/${Math.floor((chartData.labels.length - 1) / 10) + 1}`;
//*ngIf="paginatedChartData.series[0].data.length > 0"
  return (
    <div>
      <HorizontalBar data={chartData} options={options} />
      <div className='d-flex justify-content-between cursor-pointer'>
      <div className="d-flex w-25">
        <div onClick={() => onSortClick('name')} className="d-flex">
                <div className="pt-1 px-2">
                    Sort by Name
                </div>
                <i className={`fa blue-icon d-flex flex-column justify-content-center ${sortBy.name === true && 'fa-arrow-down'} ${sortBy.name === false && 'fa-arrow-up'}`} />
            </div>
            <div (click)="onSortClick('size')"
                 className="d-flex">
                <div className="pt-1 px-2">
                    {{'label.sortBySize' | translateWithBranding}}
                </div>
                <i className="fa blue-icon d-flex flex-column justify-content-center"
                   [className.fa-arrow-down]="sortBy.size === true"
                   [className.fa-arrow-up]="sortBy.size === false"></i>
            </div>
        </div>


        <div className="d-flex">
            <div *ngIf="page > 0" (click)="page = page - 1; getPaginatedData()"
                 className="d-flex">
                <i className="fa fa-arrow-left blue-icon d-flex flex-column justify-content-center"></i>
                <div className="pt-1 px-2">
                    {{'action.previous' | translateWithBranding}}
                </div>
            </div>
            <div *ngIf="(page + 1) * 10 < chartData.labels.length" (click)="page = page + 1; getPaginatedData()"
                 className="d-flex ml-3">
                <div className="pt-1 px-2">
                    {{'action.next' | translateWithBranding}}
                </div>
                <i className="fa fa-arrow-right blue-icon d-flex flex-column justify-content-center"></i>
            </div>
        </div>

        <div className="d-flex w-25 justify-content-end">
            {{'label.page' | translate}} {{getPagesLabel()}}
        </div>
    </div>
    </div>
  );
};
