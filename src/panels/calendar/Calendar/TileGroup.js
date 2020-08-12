import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';

import moment from 'moment';

import Tile from './Tile';

const TileGroup = (props) => {
    let cur = moment(props.curMonth), last = moment(props.curMonth);
    cur.startOf('month'); last.endOf('month');

    var tiles = [], row = [];

    const add = (x) => {
        row.push(x);
        if(row.length === 7){
            tiles.push(<tr> {row.map((day) => <td> {day} </td>)} </tr>);
            row = [];
        }
    }

    for(let i = 0; i < (cur.day() + 6) % 7; i++) //push empty
        add(<div key = {-i}/>);

    var curActiveDateStr = props.curDate.format("YYYY-MM-DD");

    while(!cur.isAfter(last)){
        var curDateStr = cur.format("YYYY-MM-DD");

        let curTileProps = {};

        if (props.stats != null && props.stats[curDateStr] != null) {
            curTileProps.mood = props.stats[curDateStr].mood - 1;
            curTileProps.stress = props.stats[curDateStr].stress - 1;
            curTileProps.anxiety = props.stats[curDateStr].anxiety - 1;
        }
       
        if(curActiveDateStr === curDateStr)
            curTileProps.active = true;
        add(<Tile key = {cur.format("D")} date = {moment(cur)} onClickTile = {props.onClickTile} {...curTileProps}/>);
        cur.add(1, 'days');
    }

    if(row.length !== 0)
        tiles.push(<tr> {row.map((day) => <td> {day} </td>)} </tr>);

    return (<> {tiles} </>);
}

export default TileGroup;
