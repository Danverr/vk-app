import React, {useState} from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { getDate, getYear, getMonth, getMonthStart, getNextDayStart, getNextMonthStart } from '@wojtekmaj/date-utils';
import Tile from './Tile'

const TileGroup = (props) => {
    let[activeTile, setActiveTile] = useState(new Date());

    let Tiles = [];
    let cur = getMonthStart(props.curDate);
    let key = 0;
    for(let i = 1; i < cur.getDay(); i++, key++) //push empty
        Tiles.push(<Tile key = {key} onClickTile = {() => {}}/>);
    while(cur < getNextMonthStart(props.curDate)){
        let year = getYear(cur);
        let month = ('0' + (parseInt(getMonth(cur)) + 1).toString()).slice(-2);
        let day = ('0' + getDate(cur)).slice(-2);
        let curDateStr = year + "-" + month + "-" + day;

        let curTileProps = {};

        if (props.userPosts != null && props.userPosts[curDateStr] != null) {
            curTileProps.mood = props.userPosts[curDateStr].mood - 1;
            curTileProps.stress = props.userPosts[curDateStr].stress - 1;
            curTileProps.anxiety = props.userPosts[curDateStr].anxiety - 1;
        }
        if(activeTile.toString() == cur.toString())
            curTileProps.active = true;
        Tiles.push(<Tile key = {key} date = {cur} onClickTile = {(date) => {setActiveTile(date); props.onClickTile(date);}} {...curTileProps}/>);
        cur = getNextDayStart(cur);
        key++;
    }
    while(Tiles.length < 35) //push empty
        Tiles.push(<Tile onClickTile = {() => {}}/>);

    return (
        <div className = 'tile-group'>
            {Tiles}
        </div>
    );
}

export default TileGroup;
