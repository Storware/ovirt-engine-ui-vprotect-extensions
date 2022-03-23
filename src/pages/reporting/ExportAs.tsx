import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { showModalAction } from '../../store/modal/actions';
import SendReportViaEmailModal from '../dashboard/chargeback/SendReportViaEmailModal';
import { Dropdown } from 'primereact/dropdown';
import { NameAndDescription } from '../../model/dto/nameAndDescription';
import { fileSaverService } from '../../services/file-saver-service';
import dashboardService from 'services/dashboard-service';
import { selectRange } from '../../store/reporting/selectors';
import getCookie from '../../utils/getCookie';

export const ExportAs = () => {
  const dispatch = useDispatch();
  const range = useSelector(selectRange);
  const projectUuid = getCookie('recent_project');
  const [selectedExportType] = useState(null);
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

  const getReportPdf = async () => {
    fileSaverService.saveFile(
      await dashboardService.getDashboardInfoPdf({
        ...range,
        'project-uuid': projectUuid,
      }),
    );
  };

  const getReportHtml = async () => {
    fileSaverService.saveFile(
      await dashboardService.getDashboardInfoHtml({
        ...range,
        'project-uuid': projectUuid,
      }),
    );
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
