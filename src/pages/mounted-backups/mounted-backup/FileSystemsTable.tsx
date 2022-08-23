import React, { useEffect } from 'react';
import { Column } from 'primereact/column';
import { useDispatch, useSelector } from 'react-redux';
import Table from '../../../components/table/primereactTable';
import { selectFileSystems } from '../../../store/mounted-backups/selectors';
import { getFileSystems } from '../../../store/mounted-backups/actions';
import { useParams } from 'react-router-dom';
import { showModalAction } from '../../../store/modal/actions';
import FileSystemModal from './FileSystemModal';
import { Dispatch } from 'redux';
import { sizeTemplate } from '../../../components/table/templates';
import { Button } from 'components/button';

const actionTemplate = (dispatch: Dispatch) => (rowData) =>
  (
    <Button
      onClick={() => {
        dispatch(
          showModalAction({
            component: FileSystemModal,
            props: {
              guid: rowData.guid,
            },
            title: 'File System',
          }),
        );
      }}
      label="Browse"
    />
  );

const FileSystemsTable = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();

  useEffect(() => {
    dispatch(getFileSystems(guid));
  }, []);

  const fileSystems = useSelector(selectFileSystems);
  return (
    <div>
      <Table value={fileSystems}>
        <Column field="fileSystem.volume" header="Volume" />
        <Column field="mountPath" header="Mount path" />
        <Column field="fileSystem.size" header="Size" body={sizeTemplate} />
        <Column field="fileSystem.type" header="Type" />
        <Column field="fileSystem.label" header="Label" />
        <Column field="guid" header="Action" body={actionTemplate(dispatch)} />
      </Table>
    </div>
  );
};

export default FileSystemsTable;
