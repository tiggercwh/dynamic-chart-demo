export default function findMinMax(dataArr) {
  const minMaxResult = {
    DFEDTAR: {
      min: 0,
      max: 0,
    },
    DOLLAR: {
      min: 0,
      max: 0,
    },
    MORTGAGE30US: {
      min: 0,
      max: 0,
    },
    SPX: {
      min: 0,
      max: 0,
    },
  };

  if (Array.isArray(dataArr)) {
    const dataKeys = Object.keys(minMaxResult);
    dataArr.forEach((dataObj, index) => {
      dataKeys.forEach((key) => {
        const data = dataObj[key];
        if (data < minMaxResult[key].min || index === 0)
          minMaxResult[key].min = data;
        if (data > minMaxResult[key].max || index === 0)
          minMaxResult[key].max = data;
      });
    });
  }
  return minMaxResult;
}
