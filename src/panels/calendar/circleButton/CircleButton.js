import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { PanelHeaderButton, PanelHeaderBack, Panel, PanelHeader, Button, Group, Cell, Div, Avatar, CellButton, ConfigProvider, View } from '@vkontakte/vkui';
import vkBridge from '@vkontakte/vk-bridge';
import './CircleButton.css'

class СircleButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checked: false
    };
  }
  render() {
    return (
      <div>
        <button className= {this.state.checked ? "on" : "off"} onClick={() => { this.setState({checked: !this.state.checked}); }}>
          <kbd> 16 </kbd>
        </button>
      </div>
    );
  }
}

export default СircleButton;