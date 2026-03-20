import React from 'react';
import { Filesize } from 'components/convert/Filesize';
import { Form, Formik } from 'formik';
import { Button } from 'primereact/button';
import { useRestoreModal } from './hooks/useRestoreModal';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { GeneralTab } from './GeneralTab';
import { NetworkingTab } from './NetworkingTab';
import { StorageTab } from './StorageTab';
import { AdvancedTab } from './AdvancedTab';

export const storageDropdownTemplate = (option) => (
  <div>
    <span>{option.name}</span>
    {option.totalAvailableSpace && (
      <span>
        <Filesize bytes={option.totalAvailableSpace} />, free:{' '}
        <Filesize bytes={option.totalAvailableSpace - option.totalUsedSpace} />
      </span>
    )}
  </div>
);

export const RestoreModalContent = () => {
  const {
    visibleTabs,
    formRef,
    formInitialValue,
    loadingNetworkSettings,

    submitForm,
    hideModal,
    saveModal,
    setVisibleTabs,
  } = useRestoreModal();

  return (
    <div className="form">
      <Formik
        innerRef={formRef}
        initialValues={formInitialValue}
        onSubmit={submitForm}
      >
        <Form>
          <Accordion
            multiple
            activeIndex={visibleTabs}
            onTabChange={(e) => setVisibleTabs(e.index)}
          >
            <AccordionTab header="General">
              <GeneralTab />
            </AccordionTab>

            <AccordionTab header="Storage">
              <StorageTab />
            </AccordionTab>

            <AccordionTab header="Networking">
              <NetworkingTab />
            </AccordionTab>

            <AccordionTab header="Advanced">
              <AdvancedTab />
            </AccordionTab>
          </Accordion>

          <div
            className="mt-2 d-flex justify-content-end"
            style={{ gap: '1rem' }}
          >
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={() => hideModal()}
              className="p-button-text"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              disabled={loadingNetworkSettings}
              onClick={() => saveModal()}
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};
