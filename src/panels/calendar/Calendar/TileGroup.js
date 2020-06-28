import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';

import moment from 'moment';

import Tile from './Tile';
import s from './Calendar.module.css';

const TileGroup = (props) => {
    let Tiles = [];
    let cur = moment(props.curMonth), last = moment(props.curMonth);
    cur.startOf('month'); last.endOf('month');
    
    for(let i = 0; i < (cur.day() + 6) % 7; i++) //push empty
        Tiles.push(<div key = {-i}/>);

    var curActiveDateStr = moment(props.curDate).format("YYYY-MM-DD");

    while(cur <= last){
        var curDateStr = moment(cur).format("YYYY-MM-DD");

        let curTileProps = {};

        if (props.stats != null && props.stats[curDateStr] != null) {
            curTileProps.mood = props.stats[curDateStr].mood - 1;
            curTileProps.stress = props.stats[curDateStr].stress - 1;
            curTileProps.anxiety = props.stats[curDateStr].anxiety - 1;
        }
       
        if(curActiveDateStr == curDateStr)
            curTileProps.active = true;
        Tiles.push(<Tile key = {cur.format("D")}date = {moment(cur)} onClickTile = {props.onClickTile} {...curTileProps}/>);
        cur.add(1, 'days');
    }

    return (
        <div className = {s.tileGroup}>
            {Tiles}
        </div>
    );
}

export default TileGroup;
