import React from 'react';
import PropTypes from 'prop-types';
import getFileSize from 'utils/getFileSize';

export const Filesize = ({ bytes }) => <span>{getFileSize(bytes)}</span>;

Filesize.propTypes = {
  bytes: PropTypes.number,
};
