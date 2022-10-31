import React, { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import Table from 'components/table/primereactTable';
import { Column } from 'primereact/column';
import { createBrowserHistory } from 'history';
import { useDispatch, useSelector } from 'react-redux';
import { selectMailingTable } from 'store/mailingTable/selectors';
import {
  getMailingTablePage,
  removeMailingList,
} from 'store/mailingTable/actions';
import { nameTemplate } from 'components/table/templates';

const MailingTable = () => {
  const dispatch = useDispatch();
  const [globalFilter, setGlobalFilter] = useState('');
  const [tableParams, setTableParams] = useState(new TableParams());
  const history = createBrowserHistory();
  const rows = useSelector(selectMailingTable);

  useEffect(() => {
    dispatch(getMailingTablePage(tableParams));
  }, [tableParams]);

  const header = () => (
    <div>
      <div className="d-flex justify-content-between mt-2">
        <div className="p-datatable-globalfilter-container">
          <InputText
            type="search"
            onInput={({ target }) =>
              setGlobalFilter((target as HTMLInputElement).value)
            }
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

  return (
    <div>
      <Table
        value={rows}
        header={header()}
        globalFilter={globalFilter}
        apiPagination={(e) => setTableParams(e)}
      >
        <Column
          field="name"
          header="Name"
          body={nameTemplate(history)}
          sortable
        />
        <Column field="recipientCount" header="Recipient count" />
        <Column
          field="action"
          header="Action"
          body={(rowData) => (
            <Button
              label="Remove"
              onClick={() => {
                dispatch(removeMailingList(rowData.guid, tableParams));
              }}
            />
          )}
        />
      </Table>
    </div>
  );
};

export default MailingTable;
