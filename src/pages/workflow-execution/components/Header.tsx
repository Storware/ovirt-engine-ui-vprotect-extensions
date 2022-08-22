import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { debounce } from 'utils/input.utils';
import { vprotectService } from 'services/vprotect-service';

interface WorkflowTableButton {
  label: string;
  fn: () => void;
}

const taskOperationButtons: WorkflowTableButton[] = [
  {
    label: 'Delete all finished and queued tasks',
    fn: vprotectService.deleteQueuedOrFinishedTasks,
  },
  {
    label: 'Remove all finished tasks',
    fn: vprotectService.deleteFinishedTasks,
  },
  {
    label: 'Cancel all running tasks',
    fn: vprotectService.cancelRunningTasks,
  },
];

export const Header = (refresh, setFilter) => {
  const handleOnClick = async (fn) => {
    await fn();
    refresh();
  };

  return (
    <div>
      <div className="d-flex justify-content-between mt-2">
        <div className="p-datatable-globalfilter-container">
          <InputText
            type="search"
            onInput={debounce(
              ({ target: { value = '' } }) => setFilter(value),
              500,
            )}
            placeholder="Global Search"
          />
        </div>
        <div>
          <Button onClick={refresh} label="Refresh" />
          {taskOperationButtons.map(({ label, fn }) => (
            <Button
              className="ml-2"
              label={label}
              onClick={() => handleOnClick(fn)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
