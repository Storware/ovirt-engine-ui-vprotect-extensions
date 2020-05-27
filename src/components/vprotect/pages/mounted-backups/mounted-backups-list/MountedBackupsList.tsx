import React, {useEffect} from 'react'
import {
    actionHeaderCellFormatter,
    sortableHeaderCellFormatter,
    tableCellFormatter,
    Table,
    MenuItem
    , Grid, Toolbar
} from 'patternfly-react'

import {DateShow} from '../../../compoenents/convert/Date'
import {
    TableWithPagination,
    sortableTransform,
    sortingFormatter,
    sortingColumns
} from '../../../compoenents/table/TableWithPagination'
import {
    Link
} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import {getMountedBackupsListPage} from '../../../../../store/mounted-backups/actions';
import {selectMountedBackups} from '../../../../../store/mounted-backups/selectors';

const columns = [
    {
        property: 'backup',
        header: {
            label: 'Virtual Machine',
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
            formatters: [(value) => {
                return <td>
                    {value && <Link to={`virtual-machines/${value.protectedEntity.guid}`}>
                        {value.protectedEntity.name}
                    </Link>}
                </td>
            }]
        }
    },
    {
        property: 'mode',
        header: {
            label: 'Mode',
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
            formatters: [(value) => {
                return <td>{value && value.description}</td>
            }]
        }
    },
    {
        property: 'node',
        header: {
            label: 'Node',
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
            formatters: [(value) => {
                return <td>{value && value.name}</td>
            }]
        }
    },
    {
        property: 'backup',
        header: {
            label: 'Snapshot Date',
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
            formatters: [(value) => {
                return <td>
                    {value && <DateShow date={value.snapshotTime} />}
                </td>
            }]
        }
    },
    {
        property: 'mountedFileSystemCount',
        header: {
            label: 'File systems',
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
            formatters: [tableCellFormatter]
        }
    },
    {
        property: 'mountedFileCount',
        header: {
            label: 'Files',
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
                return <td>{value ? <span className='text-success'>Backup up to date</span> : typeof value === 'undefined' ?
                    <span>No schedule defined</span> : <span className='text-danger'>Backup outdated</span>}</td>
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
                index: 8,
                rowSpan: 1,
                colSpan: 1
            },
            formatters: [
                (value, {rowData}) => {
                    return [
                        <Table.Actions key='0'>
                            <Table.DropdownKebab id='myKebab' pullRight>
                                {rowData.backup &&<MenuItem>
                                    <Link to={`mounted-backups/${rowData.guid}`}>
                                      <div>
                                        Details
                                      </div>
                                    </Link>
                                </MenuItem>}
                                <MenuItem onClick={() => {

                                }}>
                                    Remount
                                </MenuItem>
                            </Table.DropdownKebab>
                        </Table.Actions>
                    ]
                }
            ]
        }
    }
];

export const MountedBackupsList = () => {
    let dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMountedBackupsListPage);
    }, [dispatch]);

    let rows = useSelector(selectMountedBackups)

    return (
        <div>
            <Toolbar>
            </Toolbar>
            <div className={'pt-4'}>
                <Grid fluid>
                    <TableWithPagination columns={columns}
                                         sortingColumns={sortingColumns}
                                         rows={rows}/>
                </Grid>
            </div>
        </div>
    )
}

export default MountedBackupsList
