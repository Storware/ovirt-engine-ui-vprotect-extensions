import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Panel } from 'primereact/panel';
import { TabPanel, TabView } from 'primereact/tabview';
import { createBrowserHistory } from 'history';
import { getMountedBackup } from '../../../store/mounted-backups/actions';
import { selectMountedBackup } from '../../../store/mounted-backups/selectors';
import FileSystemsTable from './FileSystemsTable';
import FilesTable from './FilesTable';
import { AdvancedFile } from '@/model/AdvancedFile';
import { AdvancedDateAndTime } from '@/model/AdvancedDateAndTime';

const MountedBackup = () => {
  const dispatch = useDispatch();
  const { guid } = useParams();
  const history = createBrowserHistory();

  useEffect(() => {
    dispatch(getMountedBackup(guid));
  }, []);

  const mountedBackup: any = useSelector(selectMountedBackup);
  return (
    <Panel header="Mounted Backup">
      <div className="d-flex mt-3">
        <Link to="/mounted_backups">
          <Button label="Back" />
        </Link>
      </div>
      {mountedBackup.backup && (
        <Card
          title={mountedBackup.backup.protectedEntity.name}
          className="mt-4"
        >
          <div className="row">
            <div className={'col'}>
              <div>
                <p>
                  Size -{' '}
                  <span>
                    {AdvancedFile.formatFileSize(mountedBackup.backup.size)}
                  </span>
                </p>
                <p>
                  Sharable over iSCSI - {mountedBackup.backup.iscsiMountable}
                </p>
                <p>
                  Snapshot Date -{' '}
                  {AdvancedDateAndTime.legacyFormat(
                    mountedBackup.backup.snapshotTime,
                  )}
                </p>
              </div>
            </div>
            <div className="col">
              {mountedBackup && mountedBackup.node && (
                <div>
                  <h5>NODE</h5>
                  <span>{mountedBackup.node.name}</span>
                </div>
              )}
              <div className="mt-2">
                <h5>MODE</h5>
                <span>{mountedBackup.mode.description}</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      <Card className="mt-4" title="Mounted Backup Details">
        <TabView>
          <TabPanel header="File systems">
            <FileSystemsTable />
          </TabPanel>
          <TabPanel header="Files">
            <FilesTable />
          </TabPanel>
        </TabView>
      </Card>
    </Panel>
  );
};

export default MountedBackup;
