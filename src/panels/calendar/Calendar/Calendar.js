import React, {useState, useEffect} from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import Navigation from './Navigation'
import Weekdays from './Weekdays';
import TileGroup from './TileGroup';
import moment from 'moment';
import callPicker from '../../../utils/callPicker';

let localState = {
    curDate: moment(),
    curMonth: moment().startOf('month')
};

const Calendar = (props) => {
    const [curMonth, setCurMonth] = useState(moment(localState.curMonth));
    const [curDate, setCurDate] = useState(moment(localState.curDate));
    const onDateChange = props.onDateChange;

    useEffect(() => {
        onDateChange(moment(curDate));
    }, [curDate, onDateChange]);

    return (
        <div>
            <Navigation 
            NavLabel = {moment(curMonth).format("MMMM YYYY")}
            onClickPrev = {() => {
                let date = moment(curMonth);
                date.add(-1, 'months');
                date.startOf('month');
                setCurMonth(moment(date));
                localState.curMonth = moment(date);
            }} 
            onClickPicker = {() => {
                callPicker({type: "date", startDate: curDate.toDate(), maxDate: new Date(2050, 0, 1)}, props.setPopout, (res) => {
                    setCurDate(moment(res));
                    localState.curDate = moment(res);
                    res.startOf('month');
                    setCurMonth(moment(res));
                    localState.curMonth = moment(res);
                });
            }}
            onClickNext = {() => {
                let date = moment(curMonth);
                date.add(1, 'months');
                date.startOf('month');
                setCurMonth(moment(date));
                localState.curMonth = moment(date);
            }} />
            <Weekdays/>
            <TileGroup
                onClickTile={(date) => {
                    setCurDate(moment(date));
                    localState.curDate = moment(date);
                }}
                curMonth={moment(curMonth)}
                curDate={moment(curDate)}
                stats={props.stats}/>
        </div>
    );
}

export default Calendar;
