import HeaderTable from '../../../components/table/HeaderTable';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React from 'react';

const Header = ({ onSearch, onCreate }) => {
  return (
    <HeaderTable>
      <div className="p-datatable-globalfilter-container">
        <InputText
          type="search"
          onInput={({ target }) => onSearch((target as HTMLInputElement).value)}
          placeholder="Global Search"
        />
      </div>
      <Button className="p-button-outlined" label="Create" onClick={onCreate} />
    </HeaderTable>
  );
};
export default Header;
