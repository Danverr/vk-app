import React, {useState} from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { getDate, getYear, getMonth, getMonthStart, getNextDayStart, getNextMonthStart } from '@wojtekmaj/date-utils';
import Tile from './Tile'
import s from './Calendar.module.css';

const TileGroup = (props) => {
    let[activeTile, setActiveTile] = useState(new Date());

    let Tiles = [];
    let cur = getMonthStart(props.curDate);

    for(let i = 0; i < (cur.getDay() + 6) % 7; i++) //push empty
        Tiles.push(<Tile onClickTile = {() => {}}/>);
    while(cur < getNextMonthStart(props.curDate)){
        let year = getYear(cur);
        let month = ('0' + (parseInt(getMonth(cur)) + 1).toString()).slice(-2);
        let day = ('0' + getDate(cur)).slice(-2);
        let curDateStr = year + "-" + month + "-" + day;

        let curTileProps = {};
        console.log(props.daysColors);
        if (props.daysColors != null && props.daysColors[curDateStr] != null) {
            curTileProps.mood = props.daysColors[curDateStr].mood - 1;
            curTileProps.stress = props.daysColors[curDateStr].stress - 1;
            curTileProps.anxiety = props.daysColors[curDateStr].anxiety - 1;
        }
        if(activeTile.toString() == cur.toString())
            curTileProps.active = true;
        Tiles.push(<Tile date = {cur} onClickTile = {(date) => {setActiveTile(date); props.onClickTile(date);}} {...curTileProps}/>);
        cur = getNextDayStart(cur);
    }

    return (
        <div className = {s.tileGroup}>
            {Tiles}
        </div>
    );
}

export default TileGroup;
