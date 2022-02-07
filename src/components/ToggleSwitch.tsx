import './ToggleSwitch.scss';
import React from 'react';

interface Props {
  startToggled: boolean;
  onToggle: (toggled: boolean) => void;
}

interface State {
  toggled: boolean;
}

export default class ToggleSwitch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      toggled: props.startToggled
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.onToggle(!this.state.toggled);
    this.setState(state => ({ toggled: !state.toggled }));
  }

  render() {
    return (
      <button
        className={`toggle-switch ${this.state.toggled ? 'on' : 'off'}`}
        onClick={this.toggle}
      >
        <div className='toggle-switch__knob' />
      </button>
    );
  }
}
