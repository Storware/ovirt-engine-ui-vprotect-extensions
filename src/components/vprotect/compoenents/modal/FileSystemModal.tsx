import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {selectSaved} from '../../../../store/modal/selectors';
import {hideModal, unsaveModal} from '../../../../store/modal/actions';

const FileSystemModal = ({...props}) => {
    let dispatch = useDispatch();

    const save = () => {
        if(1) {
            dispatch(hideModal())
        } else {
            dispatch(unsaveModal())
        }
    }

    if(useSelector(selectSaved)) {
        save()
    }

    useEffect(() => {
        // dispatch(getFileSystems(guid));
    }, [])

    // let fileSystems = useSelector(selectFileSystems);
    return (
        <div>filesystem modal</div>
    )
}

export default FileSystemModal
