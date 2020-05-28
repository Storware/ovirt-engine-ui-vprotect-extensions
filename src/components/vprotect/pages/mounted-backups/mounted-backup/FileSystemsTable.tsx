import React, {useEffect} from 'react'
import {Column} from 'primereact/column'
import {useDispatch, useSelector} from 'react-redux'
import Table from '../../../compoenents/table/primereactTable';
import {selectFileSystems} from '../../../../../store/mounted-backups/selectors';
import {getFileSystems} from '../../../../../store/mounted-backups/actions';
import {useParams} from 'react-router-dom'

const FileSystemsTable = () => {
    let dispatch = useDispatch();
    let {guid} = useParams();

    useEffect(() => {
        dispatch(getFileSystems(guid));
    }, [])

    let fileSystems = useSelector(selectFileSystems);
    return (
        <div>
            <Table value={fileSystems}>
                <Column field='fileSystem.volume' header='Volume'/>
                <Column field='mountPath' header='Mount path'/>
                <Column field='fileSystem.size' header='Size'/>
                <Column field='fileSystem.type' header='Type'/>
                <Column field='fileSystem.label' header='Label'/>
            </Table>
        </div>
    )
}

export default FileSystemsTable
