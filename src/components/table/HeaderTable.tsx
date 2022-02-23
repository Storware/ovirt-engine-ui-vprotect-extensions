import React from 'react';

const HeaderTable = ({ children }) => {
  return (
    <div>
      <div className="d-flex justify-content-between">{children}</div>
    </div>
  );
};

export default HeaderTable;
