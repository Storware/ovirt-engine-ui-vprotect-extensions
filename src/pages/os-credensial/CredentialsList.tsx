import React, { useEffect, useState } from 'react';
import Table from '../../components/table/primereactTable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { selectCredentials } from '../../store/credentials/selectors';
import { CredentialModel } from '../../model';
import { getCredentials } from '../../store/credentials/actions';
import { credentialsService } from '../../services/credensial-service';
import Header from './components/Header';
import { Link, useHistory } from 'react-router-dom';

const CredentialsList = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [globalFilter, setGlobalFilter] = useState(null);

  const rows = useSelector(selectCredentials);
  const locationPath = location.pathname.replace(/\//g, '');

  useEffect(() => {
    dispatch(getCredentials);
  }, []);

  const deleteCredential = async (guid: string) => {
    await credentialsService.deleteCredential(guid);
    dispatch(getCredentials);
  };

  const createCredential = () => {
    history.push(`/${locationPath}/create`);
  };

  return (
    <div>
      <Table
        value={rows}
        header={
          <Header onSearch={setGlobalFilter} onCreate={createCredential} />
        }
        globalFilter={globalFilter}
      >
        <Column
          field="name"
          header="Name"
          body={({ guid, name }) => (
            <Link to={`/${locationPath}/${guid}`}>{name}</Link>
          )}
        />
        <Column
          className="actions"
          field="action"
          body={({ guid }: CredentialModel) => (
            <Button
              icon="pi pi-times"
              onClick={() => deleteCredential(guid)}
              aria-controls="popup_menu"
              aria-haspopup
              className="p-button-outlined"
            />
          )}
        />
      </Table>
    </div>
  );
};

export default CredentialsList;
