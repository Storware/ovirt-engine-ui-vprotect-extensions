import React, {useEffect} from 'react'
import {Column} from 'primereact/column'
import {useDispatch, useSelector} from 'react-redux'
import Table from '../../../compoenents/table/primereactTable';
import {selectFileSystems} from '../../../../../store/mounted-backups/selectors';
import {getFileSystems} from '../../../../../store/mounted-backups/actions';
import {useParams} from 'react-router-dom'
import {showModal} from '../../../../../store/modal/actions';
import FileSystemModal from '../../../compoenents/modal/FileSystemModal';
import {Dispatch} from 'redux';

const actionTemplate = (dispatch: Dispatch) => (rowData) => {
    return <button onClick={() => {
        dispatch(showModal(
            {modal: FileSystemModal , props: rowData.guid}
            ))
    }} >Browse</button>
};

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
                <Column field='guid' header='Action' body={actionTemplate(dispatch)} />
            </Table>
        </div>
    )
}

export default FileSystemsTable
