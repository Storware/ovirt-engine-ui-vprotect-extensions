import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSaved } from '../../../../store/modal/selectors';
import {
  hideModalAction,
  unsaveModalAction,
} from '../../../../store/modal/actions';
import { getFilesystemListing } from '../../../../store/mounted-backups/actions';
import { selectFileSystemListing } from '../../../../store/mounted-backups/selectors';
import { BreadCrumb } from 'primereact/breadcrumb';
import Table from '../../../../components/table/primereactTable';
import { Column } from 'primereact/column';
import {
  sizeTemplate,
  dateTemplate,
  permissionTemplate,
} from '../../../../components/table/templates';
import { Button } from 'primereact/button';
import { fileSaverService } from '../../../../services/file-saver-service';
import { backupsService } from '../../../../services/backups-service';

const icon = {
  DIRECTORY: 'fa-folder-o',
  REGULAR_FILE: 'fa-file-text-o',
  SYMLINK: 'fa-link',
  BROKEN_SYMLINK: 'fa-unlink',
};

const FileSystemModal = ({ guid }) => {
  let dispatch = useDispatch();

  const save = () => {
    if (1) {
      dispatch(hideModalAction());
    } else {
      dispatch(unsaveModalAction());
    }
  };

  if (useSelector(selectSaved)) {
    save();
  }

  useEffect(() => {
    dispatch(getFilesystemListing(guid, currentPath));
  }, []);

  let data = useSelector(selectFileSystemListing);

  let currentPath;
  let setCurrentPath;
  [currentPath, setCurrentPath] = useState({
    path: '/',
  });

  let breadCrumb;
  let setBreadCrumb;
  [breadCrumb, setBreadCrumb] = useState([]);

  let selection;
  let setSelection;
  [selection, setSelection] = useState([]);

  const download = async () => {
    const path = {
      paths: [],
    };
    path.paths = selection.map((el) => {
      return `${currentPath.path}${el.name}`;
    });
    const data = await backupsService.downloadBackupFilesystemsFiles(
      guid,
      path,
    );
    fileSaverService.saveFile(data);
    setSelection([]);
  };

  const goToPage = (newBreadCrumb) => {
    const newCurrentPath = {
      path: newBreadCrumb.length > 0
          ? `/${newBreadCrumb.map((el) => el.label).join('/')}/`
          : '/'
    };
    setCurrentPath(newCurrentPath)
    dispatch(getFilesystemListing(guid, newCurrentPath));
    setBreadCrumb(newBreadCrumb);
  };

  const goToBreadcrumbs = (event) => {
    const newBreadCrumb =
      event.item.label === 'ROOT' ? [] : [...breadCrumb, event.item];

    goToPage(newBreadCrumb);
  };

  const home = {
    icon: 'pi pi-home',
    command: goToBreadcrumbs,
    label: 'ROOT',
  };

  return (
    <div className="filesystemModal">
      <BreadCrumb model={breadCrumb} home={home} />
      <div className="my-4">
        <Button onClick={download} label="Download selected" />
      </div>
      <Table
        selection={selection}
        onSelectionChange={(e) => setSelection(e.value)}
        value={data}
      >
        <Column selectionMode="multiple" style={{ width: '3em' }} />
        <Column
          field="name"
          header="Name"
          body={(rowData, column) => {
            return (
              <div>
                <i className={'mr-2 fa ' + icon[rowData.fileType.name]} />
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    if (rowData.fileType.name === 'DIRECTORY') {
                      let newBreadCrumb = [
                        ...breadCrumb,
                        {
                          label: rowData[column.field],
                          command: goToBreadcrumbs,
                        },
                      ];
                      goToPage(newBreadCrumb);
                    }
                  }}
                >
                  {rowData[column.field]}
                </span>
              </div>
            );
          }}
        />
        <Column field="fileType.description" header="Type" />
        <Column field="size" header="Size" body={sizeTemplate} />
        <Column field="modified" header="Modified" body={dateTemplate} />
        <Column field="owner" header="Owner" />
        <Column field="group" header="Group" />
        <Column
          field="permissions"
          header="Permissions"
          body={permissionTemplate}
        />
      </Table>
    </div>
  );
};

export default FileSystemModal;
