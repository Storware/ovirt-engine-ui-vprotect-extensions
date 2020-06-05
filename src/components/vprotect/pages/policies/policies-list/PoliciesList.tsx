import React, {useEffect, useState} from 'react'
import {
    sortableHeaderCellFormatter,
    tableCellFormatter
    , Grid, Toolbar, Button, actionHeaderCellFormatter, Table, MenuItem
} from 'patternfly-react'

import {policiesService} from '../../../services/policies-service'
import {Filesize} from '../../../compoenents/convert/Filezize'
import {TableFilter} from '../../../compoenents/table/TableFilter'
import {
    Link,
    useRouteMatch
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

export const PoliciesList = () => {
    const dispatch = useDispatch()
    const match = useRouteMatch()

    useEffect(() => {
        dispatch(getPolicies('vm-backup'))
    }, [dispatch])

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
                        <Link to={`${match.path}/${rowData.guid}`}>
                            {value}
                        </Link>
                    </td>
                }]
            }
        },
        {
            property: 'backupDestination',
            header: {
                label: 'Backup Destination',
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
                formatters: [value => {
                    return <td>
                        {value ? value.name : ''}
                    </td>
                }]
            }
        },
        {
            property: 'priority',
            header: {
                label: 'Priority',
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
            property: 'vmBackupPolicy',
            header: {
                label: 'Policy',
                props: {
                    index: 4,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 4
                },
                formatters: [value => {
                    return <td>
                        {value ? value.name : ''}
                    </td>
                }]
            }
        },
        {
            property: 'averageBackupSize',
            header: {
                label: 'Average Backup Size',
                props: {
                    index: 5,
                    rowSpan: 1,
                    colSpan: 1
                },
                transforms: [sortableTransform],
                formatters: [sortingFormatter],
                customFormatters: [sortableHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 5
                },
                formatters: [(value) => {
                    return <td>
                        <Filesize bytes={value}/>
                    </td>
                }]
            }
        },
        {
            header: {
                label: 'Actions',
                props: {
                    index: 6,
                    rowSpan: 1,
                    colSpan: 1
                },
                formatters: [actionHeaderCellFormatter]
            },
            cell: {
                props: {
                    index: 6,
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
                        <Link to={`${match.path}/create`}>
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

export default PoliciesList
