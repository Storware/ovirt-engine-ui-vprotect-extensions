import { InputText } from 'primereact/inputtext';
import React from 'react';

export class InputConvert extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  static getDerivedStateFromProps(props) {
    return {
      value: props.value / props.factor,
    };
  }

  render() {
    return (
      <InputText
        value={this.state.value}
        onChange={(event: any) => {
          this.props.onChange(event.target.value * this.props.factor);
        }}
      />
    );
  }
}
 