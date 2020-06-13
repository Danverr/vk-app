import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import s from './Calendar.module.css';

const Navigation = (props) => {
    return (
        <div className={s.navigation}>
            <button className={s.navItem, s.navButton} onClick = {() => {props.onClickPrev()}}>
                <Icon24BrowserBack width={14} height={14} />
            </button>
                <Text weight='semibold' className={s.navItem}> {props.NavLabel} </Text>
            <button className={s.navItem, s.navButton} onClick = {() => {props.onClickNext()}}>
                <Icon24BrowserForward width={14} height={14} />
            </button>
        </div>
    );
}

export default Navigation;
