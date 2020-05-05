import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24MoreHorizontal from '@vkontakte/icons/dist/24/more_horizontal';
import { PanelHeaderButton, PanelHeaderBack, Panel, PanelHeader, Button, Group, Cell, Div, Avatar, CellButton, ConfigProvider, View } from '@vkontakte/vkui';
import vkBridge from '@vkontakte/vk-bridge';
import CircleButton from './circleButton/CircleButton';

class CalendarField extends React.Component {
	render() {
		return (
			<CircleButton />
		);
	}
}

export default CalendarField;