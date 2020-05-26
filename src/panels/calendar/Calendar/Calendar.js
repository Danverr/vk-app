import React, { useState } from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Navigation from './Navigation'
import Weekdays from './Weekdays';
import TileGroup from './TileGroup'
import './Calendar.css';
import { getPreviousMonthStart, getNextMonthStart, getMonth, getYear } from '@wojtekmaj/date-utils';

const Calendar = (props) => {
    let [curDate, setCurDate] = useState(new Date());
    let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return (
        <div>
            <Navigation NavLabel = {months[getMonth(curDate)] + ' ' + getYear(curDate)} onClickPrev = {() => setCurDate(getPreviousMonthStart(curDate))} onClickNext = {() => {setCurDate(getNextMonthStart(curDate))}}/>
            <Weekdays/>
            <TileGroup onClickTile = {props.onClickTile} curDate = {curDate} userPosts = {props.userPosts}/>
        </div>
    );
}

export default Calendar;
