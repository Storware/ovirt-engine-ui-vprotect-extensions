import React, { useEffect, useState } from 'react';
import {
  actionHeaderCellFormatter,
  sortableHeaderCellFormatter,
  tableCellFormatter,
  Table,
  MenuItem,
  Grid,
  Toolbar,
} from 'patternfly-react';

import { BackupModal } from 'components/modal/BackupModal';
import { RestoreModal } from '../modal/RestoreModal';
import { DateShow } from 'components/convert/Date';
import { Filesize } from 'components/convert/Filesize';
import { TableFilter } from 'components/table/TableFilter';
import { Link, useRouteMatch } from 'react-router-dom';
import {
  TableWithPagination,
  sortableTransform,
  sortingFormatter,
  sortingColumns,
} from 'components/table/TableWithPagination';
import { useDispatch, useSelector } from 'react-redux';
import {
  getVirtualMachinesPage,
  setFilteredVirtualMachines,
} from 'store/virtual-machines/actions';
import {
  selectVirtualMachines,
  selectFilteredVirtualMachines,
} from 'store/virtual-machines/selectors';
import { showModalAction } from 'store/modal/actions';
import { MountBackupModal } from 'components/modal/MountBackupModal';
import { nameTemplate } from '../../policies/PoliciesList';
import { createBrowserHistory } from 'history';

const filterFields = [
  {
    property: 'name',
    title: 'Name',
    placeholder: 'Filter by Name',
    filterType: 'text',
  },
  {
    property: 'uuid',
    title: 'Uuid',
    placeholder: 'Filter by Uuid',
    filterType: 'text',
  },
  {
    property: 'hypervisor.name',
    title: 'Hypervisor',
    placeholder: 'Filter by Hypervisor',
    filterType: 'text',
  },
  {
    property: 'vmBackupPolicy.name',
    title: 'Policy',
    placeholder: 'Filter by Policy',
    filterType: 'text',
  },
];

const VirtualMachinesList = () => {
  let dispatch = useDispatch();
  const history = createBrowserHistory();

  useEffect(() => {
    dispatch(getVirtualMachinesPage);
  }, []);

  let rows = useSelector(selectVirtualMachines);
  let filteredRows = useSelector(selectFilteredVirtualMachines);

  const columns = [
    {
      property: 'name',
      header: {
        label: 'Name',
        props: {
          index: 0,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 0,
        },
        formatters: [
          (value, { rowData }) => nameTemplate(history, rowData, value),
        ],
      },
    },
    {
      property: 'uuid',
      header: {
        label: 'Uuid',
        props: {
          index: 1,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 1,
        },
        formatters: [tableCellFormatter],
      },
    },
    {
      property: 'present',
      header: {
        label: 'Present',
        props: {
          index: 2,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 2,
        },
        formatters: [
          (value) => {
            return (
              <td className={'text-center'}>
                {value ? (
                  <span className="fa fa-check text-success" />
                ) : (
                  <span className="fa fa-times text-danger" />
                )}
              </td>
            );
          },
        ],
      },
    },
    {
      property: 'hypervisor',
      header: {
        label: 'Hypervisor',
        props: {
          index: 3,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 3,
        },
        formatters: [
          (value) => {
            return <td>{value && value.name}</td>;
          },
        ],
      },
    },
    {
      property: 'vmBackupPolicy',
      header: {
        label: 'Policy',
        props: {
          index: 4,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 4,
        },
        formatters: [
          (value) => {
            return <td>{value && value.name}</td>;
          },
        ],
      },
    },
    {
      property: 'backupUpToDate',
      header: {
        label: 'Backup status',
        props: {
          index: 5,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 5,
        },
        formatters: [
          (value) => {
            return (
              <td>
                {value ? (
                  <span className="text-success">Backup up to date</span>
                ) : typeof value === 'undefined' ? (
                  <span>No schedule defined</span>
                ) : (
                  <span className="text-danger">Backup outdated</span>
                )}
              </td>
            );
          },
        ],
      },
    },
    {
      property: 'lastBackup',
      header: {
        label: 'Last backup date',
        props: {
          index: 6,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 6,
        },
        formatters: [
          (value) => {
            return (
              <td>
                <DateShow date={value} />
              </td>
            );
          },
        ],
      },
    },
    {
      property: 'lastSuccessfulBackupSize',
      header: {
        label: 'Last backup size',
        props: {
          index: 7,
          rowSpan: 1,
          colSpan: 1,
        },
        transforms: [sortableTransform],
        formatters: [sortingFormatter],
        customFormatters: [sortableHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 7,
        },
        formatters: [
          (value) => {
            return (
              <td className={'text-right'}>
                <Filesize bytes={value} />
              </td>
            );
          },
        ],
      },
    },
    {
      header: {
        label: 'Actions',
        props: {
          index: 8,
          rowSpan: 1,
          colSpan: 1,
        },
        formatters: [actionHeaderCellFormatter],
      },
      cell: {
        props: {
          index: 8,
          rowSpan: 1,
          colSpan: 1,
        },
        formatters: [
          (value, { rowData }) => {
            return [
              <Table.Actions key="0">
                <Table.DropdownKebab id="myKebab" pullRight>
                  <MenuItem
                    onClick={() => {
                      dispatch(
                        showModalAction({
                          component: BackupModal,
                          props: {
                            virtualEnvironments: [rowData],
                          },
                          title: 'Backup',
                        }),
                      );
                    }}
                  >
                    Backup
                  </MenuItem>
                  {rowData.lastSuccessfulBackupSize > 0 && (
                    <MenuItem
                      onClick={() => {
                        dispatch(
                          showModalAction({
                            component: MountBackupModal,
                            props: {
                              guid: rowData.guid,
                            },
                            title: 'Mount Backup',
                          }),
                        );
                      }}
                    >
                      Mount
                    </MenuItem>
                  )}
                  {rowData.lastSuccessfulBackupSize > 0 && (
                    <MenuItem
                      onClick={() => {
                        dispatch(
                          showModalAction({
                            component: RestoreModal,
                            props: {
                              virtualEnvironment: rowData,
                            },
                            title: 'Restore',
                          }),
                        );
                      }}
                    >
                      Restore
                    </MenuItem>
                  )}
                </Table.DropdownKebab>
              </Table.Actions>,
            ];
          },
        ],
      },
    },
  ];

  return (
    <div>
      <Toolbar>
        <TableFilter
          fields={filterFields}
          rows={rows}
          change={(value) => {
            dispatch(setFilteredVirtualMachines(value));
          }}
        />
      </Toolbar>
      <div className={'pt-4'}>
        <Grid fluid>
          <TableWithPagination
            columns={columns}
            sortingColumns={sortingColumns}
            rows={filteredRows}
          />
        </Grid>
      </div>
    </div>
  );
};

export default VirtualMachinesList;
