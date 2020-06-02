import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectSaved} from '../../../../../store/modal/selectors';
import {hideModal, showModal, unsaveModal} from '../../../../../store/modal/actions';
import {getFilesystemListing} from '../../../../../store/mounted-backups/actions';
import {selectFileSystemListing} from '../../../../../store/mounted-backups/selectors';
import {BreadCrumb} from 'primereact/breadcrumb';
import Table from '../../table/primereactTable';
import {Column} from 'primereact/column';
import {sizeTemplate, dateTemplate, permissionTemplate} from '../../table/templates'
import {Button} from 'primereact/button';
import {fileSaverService} from '../../../services/file-saver-service'
import {backupsService} from '../../../services/backups-service'

const FileSystemModal = ({guid}) => {
    let dispatch = useDispatch();

    const save = () => {
        if (1) {
            dispatch(hideModal())
        } else {
            dispatch(unsaveModal())
        }
    }

    if (useSelector(selectSaved)) {
        save()
    }

    useEffect(() => {
        dispatch(getFilesystemListing(guid, currentPath));
    }, [])

    let data = useSelector(selectFileSystemListing)

    const currentPath = {
        'path': '/'
    };

    let breadCrumb
    let setBreadCrumb
    [breadCrumb, setBreadCrumb] = useState([])

    let selection
    let setSelection
    [selection, setSelection] = useState([])

    const download = async () => {
        const path = {
            paths: []
        };
        path.paths = selection.map((el) => {
            return `${currentPath.path}${el.name}`
        });
        const data = await backupsService.downloadBackupFilesystemsFiles(guid, path)
        fileSaverService.saveFile(data)
        setSelection([])
    };

    const goToPage = (newBreadCrumb) => {
        currentPath.path = newBreadCrumb.length > 0 ? `/${newBreadCrumb.map(el => el.label).join('/')}/` : '/'
        dispatch(getFilesystemListing(guid, currentPath))
        setBreadCrumb(newBreadCrumb)
    }

    const goToBreadcrumbs = (event) => {
        const newBreadCrumb = event.item.label === 'Home' ? [] : [
            ...breadCrumb,
            event.item
        ];

        goToPage(newBreadCrumb);
    }

    const home = {
        icon: 'pi pi-home',
        command: goToBreadcrumbs,
        label: 'Home'
    }

    return (
        <div>
            <BreadCrumb model={breadCrumb} home={home}/>
            <div className='my-4'>
                <Button onClick={download}
                    label='Download selected'
                />
            </div>
            <Table
                selection={selection} onSelectionChange={e => setSelection(e.value)}
                value={data}>
                <Column selectionMode="multiple" style={{width: '3em'}}/>
                <Column field='name' header='Name' body={(rowData, column) => {
                    return <span className='cursor-pointer' onClick={() => {
                        if (rowData.fileType.name === 'DIRECTORY') {
                            let newBreadCrumb = [
                                ...breadCrumb,
                                {
                                    label: rowData[column.field],
                                    command: goToBreadcrumbs
                                }
                            ];
                            goToPage(newBreadCrumb)
                        }
                    }}>
                        {rowData[column.field]}
                    </span>
                }}/>
                <Column field='fileType.description' header='Type'/>
                <Column field='size' header='Size' body={sizeTemplate}/>
                <Column field='modified' header='Modified' body={dateTemplate}/>
                <Column field='owner' header='Owner'/>
                <Column field='group' header='Group'/>
                <Column field='permissions' header='Permissions' body={permissionTemplate}/>
            </Table>
        </div>
    )
}

export default FileSystemModal
