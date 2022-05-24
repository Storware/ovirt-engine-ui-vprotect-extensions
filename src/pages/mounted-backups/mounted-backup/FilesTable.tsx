import React, { useEffect } from 'react';
import { Column } from 'primereact/column';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../components/table/primereactTable';
import { selectFiles } from '../../../store/mounted-backups/selectors';
import { getFiles } from '../../../store/mounted-backups/actions';
import { useParams } from 'react-router-dom';
import { booleanTemplate } from '../../../components/table/templates';

const FilesTable = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();

  useEffect(() => {
    dispatch(getFiles(guid));
  }, []);

  const files = useSelector(selectFiles);
  return (
    <div>
      <Table value={files}>
        <Column field="path" header="Path" />
        <Column
          field="randomAccess"
          header="Random path access"
          body={booleanTemplate}
        />
      </Table>
    </div>
  );
};

export default FilesTable;
