import React from 'react';
import {Button} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon24BrowserForward from '@vkontakte/icons/dist/24/browser_forward';
import s from './Calendar.module.css';
import moment from 'moment';

const Navigation = (props) => {
    const {curMonth} = props;
    return (
        <div className={s.navigation}>
            <Button
                disabled = {moment(curMonth).isSame(moment("1970-01-01"))}
                mode="tertiary"
                className={s.navItem + " " + s.navButton}
                onClick={() => {
                    props.onClickPrev()
                }}>
                <Icon24BrowserBack fill="var(--accent)"/>
            </Button>
            <Button
                size="xl"
                mode="tertiary"
                className={s.navItem + " " + s.navText}
                onClick={() => {
                    props.onClickPicker();
                }}>
                {moment(curMonth).format("MMMM YYYY")}
            </Button>
            <Button
                disabled = {moment(curMonth).isSame(moment("2050-01-01"))}
                mode="tertiary"
                className={s.navItem + " " + s.navButton}
                onClick={() => {
                    props.onClickNext()
                }}>
                <Icon24BrowserForward fill=" var(--accent)"/>
            </Button>
        </div>
    );
};

export default Navigation;
