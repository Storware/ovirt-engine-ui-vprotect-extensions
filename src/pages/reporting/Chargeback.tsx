import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';

export default () => {
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReport(range));
  }, [range]);

  return <div></div>;
};
