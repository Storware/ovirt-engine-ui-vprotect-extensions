import React from 'react'
import {DataTable} from 'primereact/datatable'

const Table = ({children, ...props }) => {
    return (
        <div>
            <DataTable paginator rows={10} rowsPerPageOptions={[5, 10, 20]} {...props}>
                {children}
            </DataTable>
        </div>
    )
}

export default Table
