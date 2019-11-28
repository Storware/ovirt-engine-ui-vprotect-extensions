/* eslint-disable */

// TODO(vs) contribute changes to patternfly-react & remove this file

import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, Popover, OverlayTrigger } from 'patternfly-react';

/**
 * FieldLevelHelp Component for Patternfly React
 */
const FieldLevelHelp = ({ children, content, close, placement, container, ...props }) => {
  // TODO(vs) extra ...props is unused
  // TODO(vs) children prop is unused
  const trigger = 'click';
  // TODO(vs) id should be randomly generated
  const overlay = <Popover id="popover">{content}</Popover>;
  const rootClose = close === 'true';

  return (
    <OverlayTrigger
      overlay={overlay}
      trigger={trigger.split(' ')}
      rootClose={rootClose}
      container={container}
      placement={placement}
      // TODO(vs) here could go {...props}
    >
      <Button bsStyle="link">
        <Icon type="pf" name="info" />
      </Button>
    </OverlayTrigger>
  );
};

FieldLevelHelp.propTypes = {
  content: PropTypes.node,
  close: PropTypes.string,
  placement: PropTypes.string,
  children: PropTypes.node
};
FieldLevelHelp.defaultProps = {
  content: null,
  close: 'true',
  placement: 'top',
  children: null
};

export default FieldLevelHelp;
