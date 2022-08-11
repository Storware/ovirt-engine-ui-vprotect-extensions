import React from 'react';
import { Dialog, DialogProps } from 'primereact/dialog';
import { Footer, FooterProps } from './components';

interface Props extends DialogProps, FooterProps {}

export class Modal extends React.Component<Props> {
  render() {
    const { save, cancel, ...modalProps } = this.props;
    return (
      <Dialog
        footer={() =>
          Footer({
            save: {
              onClick: (...events) => {
                modalProps.onHide();
                save?.onClick?.(...events);
              },
            },
            cancel: {
              onClick: (...events) => {
                modalProps.onHide();
                cancel?.onClick?.(...events);
              },
            },
          })
        }
        {...modalProps}
      >
        {this.props.children}
      </Dialog>
    );
  }
}
