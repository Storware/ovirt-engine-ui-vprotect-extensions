import React, { useEffect, useState } from 'react';
import { Button } from 'components/button';
import { hideModalAction, saveModalAction } from 'store/modal/actions';
import { useDispatch } from 'react-redux';
import { GeneralTable, PreviewTable } from './table';
import { Step } from './table/tables-types';
import { retentionService } from 'services/retention-service';
import { alertService } from 'services/alert-service';

const Footer = ({
  step,
  setStep,
  getData,
  onSave,
}: {
  step: Step;
  setStep: (val: Step) => void;
  getData: () => void;
  onSave: () => void;
}) => {
  const dispatch = useDispatch();
  return (
    <div className="d-flex justify-content-end mt-2">
      <Button
        label="Cancel"
        onClick={() => dispatch(hideModalAction())}
        className="p-button-text"
      />
      {step === Step.GENERAL ? (
        <Button
          label="PreviewTable"
          onClick={() => {
            getData();
            setStep(Step.PREVIEW);
          }}
        />
      ) : (
        <>
          <Button
            label="Back"
            onClick={() => setStep(Step.GENERAL)}
            className="p-button-text"
          />
          <Button
            label="Save"
            onClick={() => {
              onSave();
              dispatch(saveModalAction());
              dispatch(hideModalAction());
            }}
          />
        </>
      )}
    </div>
  );
};

export const AdjustRetentionModal = ({ value: data, onSave: onSaveEmit }) => {
  const [previewData, setPreviewData] = useState([]);
  const [backupLocations, setBackupLocations] = useState([]);
  const [step, setStep] = useState<Step>(Step.GENERAL);

  const getPreviewData = async () => {
    const preview = await retentionService.previewMarkBackups(backupLocations);
    setPreviewData(preview);
  };

  const _initMarkBackupLocations = () => {
    setBackupLocations(
      data.map((el) => ({
        ...el,
        guid: el.backup.guid,
      })),
    );
  };

  const onSave = async () => {
    retentionService.markBackups(backupLocations).then(() => {
      alertService.info('Unmount task has been submitted');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      onSaveEmit();
    });
  };

  useEffect(() => {
    _initMarkBackupLocations();
    return () => {
      setPreviewData([]);
      setBackupLocations([]);
      setStep(Step.GENERAL);
    };
  }, []);

  useEffect(() => {
    if (step === Step.GENERAL) {
      setPreviewData([]);
    }
  }, [step]);

  return (
    <div>
      {step === Step.GENERAL && (
        <GeneralTable value={backupLocations} setValue={setBackupLocations} />
      )}
      {step === Step.PREVIEW && <PreviewTable value={previewData} />}
      <Footer
        step={step}
        setStep={setStep}
        getData={getPreviewData}
        onSave={onSave}
      />
    </div>
  );
};
