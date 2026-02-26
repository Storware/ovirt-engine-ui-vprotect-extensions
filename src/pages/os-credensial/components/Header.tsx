import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import HeaderTable from '@/components/table/HeaderTable';

export const Header = ({ onSearch, onCreate }) => (
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
