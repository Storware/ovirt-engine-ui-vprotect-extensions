import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { showModalAction } from 'store/modal/actions';
import SendReportViaEmailModal from '../dashboard/chargeback/SendReportViaEmailModal';
import { Dropdown } from 'primereact/dropdown';
import { NameAndDescription } from 'model/dto/nameAndDescription';
import { fileSaverService } from 'services/file-saver-service';
import dashboardService from 'services/dashboard-service';
import { selectRange } from 'store/reporting/selectors';
import { selectExportRequest } from 'store/export-report/selectors';
import { mapPropertiesObjectListToStringOfGuids } from './components/ReportSizeContainer';

export const ExportAs = () => {
  const dispatch = useDispatch();
  const range = useSelector(selectRange);
  const [selectedExportType] = useState(null);
  const exportRequest = useSelector(selectExportRequest);
  const exportTypes: NameAndDescription<string>[] = [
    { description: 'Send report via e-mail', name: 'sendReportViaEmail' },
    { description: 'Export as PDF', name: 'exportAsPdf' },
    { description: 'Export as HTML', name: 'exportAsHtml' },
  ];

  const onSendReportViaEmail = () => {
    dispatch(
      showModalAction({
        component: SendReportViaEmailModal,
        title: 'Send report via e-mail',
      }),
    );
  };

  const exportRequestGuids = {
    backupSize: mapPropertiesObjectListToStringOfGuids(
      exportRequest.backupSize,
    ),
    transferSize: mapPropertiesObjectListToStringOfGuids(
      exportRequest.transferSize,
    ),
    value: '',
  };

  const getPdf = () =>
    dashboardService.getDashboardInfoPdf(range, exportRequestGuids);
  const getHtml = () =>
    dashboardService.getDashboardInfoHtml(range, exportRequestGuids);

  const getReportPdf = async () => {
    await fileSaverService.saveFile(await getPdf());
  };

  const getReportHtml = async () => {
    await fileSaverService.saveFile(await getHtml());
  };

  const downloadReport = {
    sendReportViaEmail: onSendReportViaEmail,
    exportAsPdf: getReportPdf,
    exportAsHtml: getReportHtml,
  };

  const onExportTypeChange = (e) => {
    downloadReport[e.value.name]();
  };

  return (
    <Dropdown
      value={selectedExportType}
      options={exportTypes}
      optionLabel="description"
      onChange={onExportTypeChange}
      placeholder="Export"
    />
  );
};
