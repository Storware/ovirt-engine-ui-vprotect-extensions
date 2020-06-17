import React from 'react';
import PropTypes from 'prop-types';

const sufixes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const getBytes = (bytes) => {
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (!bytes && '0 Bytes') ||
    (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sufixes[i]
  );
};

export const Filesize = ({ bytes }) => <span>{getBytes(bytes)}</span>;

Filesize.propTypes = {
  bytes: PropTypes.number,
};
