import React, {useEffect, useState} from 'react'
import {
    sortableHeaderCellFormatter,
    tableCellFormatter
    , Grid, Toolbar, Button, actionHeaderCellFormatter, Table, MenuItem
} from 'patternfly-react'

import {policiesService} from '../../../services/policies-service'
import {Filesize} from '../../../compoenents/convert/Filesize'
import {TableFilter} from '../../../compoenents/table/TableFilter'
import {
    Link,
    useParams
} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {getPolicies, removePolicy, setFilteredPolicies} from '../../../../../store/policies/actions';
import {selectFilteredPolicies, selectPolicies} from '../../../../../store/policies/selectors';
import {
    TableWithPagination,
    sortableTransform,
    sortingFormatter,
    sortingColumns
} from '../../../compoenents/table/TableWithPagination'
import {showModalAction} from '../../../../../store/modal/actions';
import {BackupModal} from '../../../compoenents/modal/BackupModal'


const filterFields = [
    {
        property: 'name',
        title: 'Name',
        placeholder: 'Filter by Name',
        filterType: 'text'
    }, {
        property: 'guid',
        title: 'Guid',
        placeholder: 'Filter by Guid',
        filterType: 'text'
    }, {
        property: 'backupDestination.name',
        title: 'Backup Destination',
        placeholder: 'Filter by Backup Destination',
        filterType: 'text'
    }
];

export const BackupPoliciesList = () => {
    const dispatch = useDispatch()
    const {type} = useParams()

    console.log(type)

    useEffect(() => {
        dispatch(getPolicies(type))
    }, [type])

    let rows = useSelector(selectPolicies);
    let filteredRows = useSelector(selectFilteredPolicies);

    const columns = [
        {
            property: 'name',
            header: {
                label: 'Name',
                props: {
                    index: 0,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 0
                },
                formatters: [(value, {rowData}) => {
                    return <td>
                        <Link to={`/policies/edit/vm-backup/${rowData.guid}`}>
                            {value}
                        </Link>
                    </td>
                }]
            }
        },
        {
            property: 'priority',
            header: {
                label: 'Priority',
                props: {
                    index: 1,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 1
                },
                formatters: [tableCellFormatter]
            }
        },
        {
            property: 'ruleCount',
            header: {
                label: 'VM Count',
                props: {
                    index: 2,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 2
                },
                formatters: [tableCellFormatter]
            }
        },
        {
            property: 'vmCount',
            header: {
                label: 'VM Count',
                props: {
                    index: 3,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 3
                },
                formatters: [tableCellFormatter]
            }
        },
        {
            header: {
                label: 'Actions',
                props: {
                    index: 4,
                    rowSpan: 1,
                    colSpan: 1
                },
                formatters: [actionHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 4,
                    rowSpan: 1,
                    colSpan: 1
                },
                formatters: [
                    (value, {rowData}) => {
                        return [
                            <Table.Actions key='0'>
                                <Table.DropdownKebab id='myKebab' pullRight>
                                    {rowData.vmCount > 0 && <MenuItem onClick={async () => {
                                        const policy = await policiesService.getPolicy('vm-backup', rowData.guid);
                                        dispatch(showModalAction({
                                            modal: BackupModal,
                                            props: {
                                                virtualEnvironments: policy.vms
                                            }
                                        }))
                                    }}>
                                      Backup
                                    </MenuItem>}
                                    <MenuItem onClick={() => {
                                        dispatch(removePolicy('vm-backup', rowData.guid))
                                    }}>
                                        Remove
                                    </MenuItem>
                                </Table.DropdownKebab>
                            </Table.Actions>
                        ]
                    }
                ]
            }
        }
    ];


    return (
        <div>
            <Toolbar>
                <div className={'d-flex flex-row justify-content-between'}>
                    <div>
                        <TableFilter fields={filterFields} rows={rows} change={(value) => {
                            dispatch(setFilteredPolicies(value))
                        }}/>
                    </div>
                    <div className={'form-group'}>
                        <Link to={`/policies/edit/vm-backup/create`}>
                            <Button className={'btn btn-default'}>Create</Button>
                        </Link>
                    </div>
                </div>
            </Toolbar>
            <div className={'pt-4'}>
                <Grid fluid>
                    <TableWithPagination columns={columns}
                                         sortingColumns={sortingColumns}
                                         rows={filteredRows}/>
                </Grid>
            </div>
        </div>
    )
}

export default BackupPoliciesList
