import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import { createBrowserHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { selectMailingTable } from 'store/mailingTable/selectors';
import { getMailingTable, removeMailingList } from 'store/mailingTable/actions';

export const nameTemplate = (history) => (rowData, column) => {
  return (
    <Link to={`${history.location.pathname}/${rowData.guid}`}>
      {rowData[column.field]}
    </Link>
  );
};

const MailingTable = () => {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState(null);
  const history = createBrowserHistory();
  const [actionsElement, setActionsElement] = useState(null);
  const rows = useSelector(selectMailingTable);

  useEffect(() => {
    dispatch(getMailingTable());
  }, []);

  const header = () => {
    return (
      <div>
        <div className="d-flex justify-content-between mt-2">
          <div className="p-datatable-globalfilter-container">
            <InputText
              type="search"
              // @ts-ignore
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
            />
          </div>
          <div>
            <Link to={`${history.location.pathname}/create`}>
              <Button label="Create" />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Table value={rows} header={header()} globalFilter={globalFilter}>
        <Column field="name" header="Name" body={nameTemplate(history)} />
        <Column
          field="action"
          header="Action"
          body={(rowData) => (
            <Button
              label="Remove"
              onClick={() => {
                dispatch(removeMailingList(rowData.guid));
              }}
            />
          )}
        />
      </Table>
    </div>
  );
};

export default MailingTable;
