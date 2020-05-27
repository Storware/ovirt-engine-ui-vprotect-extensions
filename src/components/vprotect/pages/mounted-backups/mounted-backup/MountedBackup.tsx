import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import {
    Link,
    useParams
} from 'react-router-dom'
import {getMountedBackupsPage} from '../../../../../store/mounted-backups/actions';
import {selectMountedBackup} from '../../../../../store/mounted-backups/selectors';
import {Button} from 'primereact/button';
import {Card} from 'primereact/card';
import {Panel} from 'primereact/panel';
import {DateShow} from '../../../compoenents/convert/Date'
import {Filesize} from '../../../compoenents/convert/Filezize'

const MountedBackup = () => {
    let dispatch = useDispatch();
    let {guid} = useParams();

    useEffect(() => {
        dispatch(getMountedBackupsPage(guid));
    }, [])

    let mountedBackup: any = useSelector(selectMountedBackup)
    console.log(mountedBackup);
    return (
        <Panel header='Mounted Backup'>
            <div className='d-flex mt-3'>
                <div>
                    <Link to={`mounted-backups`}>
                        <Button label='Back'/>
                    </Link>
                </div>
            </div>
            {mountedBackup.backup && <Card title={mountedBackup.backup.protectedEntity.name}
                  className='mt-4'>
                <div className="row">
                  <div className={'col'}>
                    <div>
                      <p>Size - <Filesize bytes={mountedBackup.backup.size}/></p>
                      <p>Sharable over iSCSI - {mountedBackup.backup.iscsiMountable}</p>
                      <p>Snapshot Date - <DateShow date={mountedBackup.backup.snapshotTime}/></p>
                    </div>
                  </div>
                  <div className="col">
                      {mountedBackup && mountedBackup.node && <div>
                        <h3>NODE</h3>
                        <span>
                            {mountedBackup.node.name}
                        </span>
                      </div>}
                      <div>
                          <h3>MODE</h3>
                          <span>
                              {mountedBackup.mode.description}
                          </span>
                      </div>
                  </div>
                </div>
            </Card>}
        </Panel>
    )
}

export default MountedBackup
