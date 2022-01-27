import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectRange, selectReport } from 'store/reporting/selectors';
import { getReport } from 'store/reporting/actions';
import ProtectionDoughnut from 'pages/reporting/ProtectionDoughnut';

const labels = {
  backups: {
    successful: 'Successful backups',
    inProgress: 'Backups in progress',
    queued: 'Backups in queued',
    failed: 'Failed backups',
    total: 'Total backups',
    totalData: 'Total data protected',
  },
  restores: {
    successful: 'Successful restores',
    inProgress: 'Restores in progress',
    failed: 'Failed restores',
    total: 'Total restores',
    totalData: 'Total data restored',
  },
};

export default () => {
  const range = useSelector(selectRange);
  const report = useSelector(selectReport);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getReport(range));
  }, [range]);

  return (
    <div>
      <div className="row mt-5">
        <div className="col">
          <div style={{ height: 370 }}>
            <ProtectionDoughnut report={report} type="backups" />
          </div>
          <div>
            <ProtectionDoughnut report={report} type="restores" />
          </div>
        </div>
        <div className="col">
          {['backups', 'restores'].map((type) => {
            return (
              <table className="mb-4" key={type}>
                <tbody>
                  {Object.keys(labels['backups']).map((property) => {
                    return (
                      <tr key={property}>
                        <td className="text-left py-4 pr-4">
                          {labels[type][property]}
                        </td>
                        <td className="text-left py-4 pl-4">
                          {report[type][property]}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            );
          })}
        </div>
      </div>
    </div>
  );
};
