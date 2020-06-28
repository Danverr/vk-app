import React, { useState, useEffect } from 'react';
import { Button, Title } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import s from './Calendar.module.css';
import moment from 'moment';

const Navigation = (props) => {
    return (
        <div className={s.navigation}>
            <Button
                mode="tertiary"
                disabled={moment(props.curMonth).format("YYYY-MM-DD") == moment(props.minMonth).format("YYYY-MM-DD")}
                className={s.navItem + " " + s.navButton}
                onClick={() => { props.onClickPrev() }}>
                <Icon24BrowserBack fill="var(--accent)" />
            </Button>
            <Title level='3' weight='medium' className={s.navItem + " " + s.navText}> {props.NavLabel} </Title>
            <Button
                mode="tertiary"
                disabled={moment(props.curMonth).format("YYYY-MM-DD") == moment(props.maxMonth).format("YYYY-MM-DD")}
                className={s.navItem + " " + s.navButton}
                onClick={() => { props.onClickNext() }}>
                <Icon24BrowserForward fill="var(--accent)" />
            </Button>
        </div>
    );
}

export default Navigation;
