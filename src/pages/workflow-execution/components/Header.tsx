import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { debounce } from 'utils/input.utils';

export const Header = (refresh, setFilter) => (
  <div>
    <div className="d-flex justify-content-between mt-2">
      <div className="p-datatable-globalfilter-container">
        <InputText
          type="search"
          style={{ fontSize: '13px' }}
          onInput={debounce(
            ({ target: { value = '' } }) => setFilter(value),
            500,
          )}
          placeholder="Global Search"
        />
      </div>
      <div>
        <Button
          onClick={refresh}
          label="Refresh"
          style={{ fontSize: '13px' }}
        />
      </div>
    </div>
  </div>
);
