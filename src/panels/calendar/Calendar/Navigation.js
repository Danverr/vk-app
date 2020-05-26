import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';

const Navigation = (props) => {
    return (
        <div className='navigation'>
            <button className={'nav-item', 'nav-button'} onClick = {() => {props.onClickPrev()}}>
                <Icon24BrowserBack width={14} height={14} />
            </button>
                <Text weight='semibold' className='nav-item'> {props.NavLabel} </Text>
            <button className={'nav-item', 'nav-button'} onClick = {() => {props.onClickNext()}}>
                <Icon24BrowserForward width={14} height={14} />
            </button>
        </div>
    );
}

export default Navigation;
