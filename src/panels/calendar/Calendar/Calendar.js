import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Navigation from './Navigation'
import Weekdays from './Weekdays';
import TileGroup from './TileGroup';
import moment from 'moment';

const Calendar = (props) => {
    if(props.curMonth < props.minMonth || props.curMonth > props.maxMonth)
        return null;
    return (
        <div>
            <Navigation NavLabel = {moment(props.curMonth).format("MMMM YYYY")}
            curMonth = {props.curMonth}
            minMonth = {props.minMonth}
            maxMonth = {props.maxMonth}
            onClickPrev = {() => {
                let date = moment(props.curMonth);
                date.add(-1, 'months');
                date.startOf('month');
                props.onClickPrev(moment(date));
            }} 
            onClickNext = {() => {
                let date = moment(props.curMonth);
                date.add(1, 'months');
                date.startOf('month');
                props.onClickNext(moment(date));
            }} />
            <Weekdays/>
            <TileGroup onClickTile = {props.onClickTile} curMonth = {props.curMonth} curDate = {props.curDate} stats = {props.stats}/>
        </div>
    );
}

export default Calendar;
