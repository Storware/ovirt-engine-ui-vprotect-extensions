export default (chartData, sortBy) => {
  if (sortBy.size === null && sortBy.name === null) {
    return chartData;
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
    labelsAndDataMergedAndSorted = labelsAndDataMergedAndSorted.sort((a, b) => {
      const x = a.label.toLowerCase();
      const y = b.label.toLowerCase();
      const sortValue = x <= y ? -1 : 1;
      return sortBy.name ? sortValue : -sortValue;
    });
  }

  return {
    labels: labelsAndDataMergedAndSorted.map((el) => el.label),
    datasets: [
      {
        label: 'Size',
        data: labelsAndDataMergedAndSorted.map((el) => el.dataValue),
      },
    ],
  };
};
