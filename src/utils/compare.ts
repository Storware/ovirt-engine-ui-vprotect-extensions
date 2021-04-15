const compare = (c1, c2) => {
  if (c1 && c2 && c1.guid) {
    return c1.guid === c2.guid;
  }

  if (c1 && c2 && c1.name) {
    return c1.name === c2.name;
  }

  if (c1 && c2 && c1.value) {
    return c1.value === c2.value;
  }

  return c1 === c2;
};

export const compareWithValueProperty = (valueProperty, c1, c2) => {
  if (!valueProperty) {
    return compare(c1, c2);
  }
  return c1 === c2[valueProperty];
};

export default compare;
