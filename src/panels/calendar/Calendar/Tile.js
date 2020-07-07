import React from 'react';
import { Subhead } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import moment from 'moment';
import s from './Calendar.module.css';

const Tile = (props) => {
    const {
        mood,
        stress,
        anxiety
    } = props;

    let borderStyle = {}, circleStyle = {}, circleClass = s.circle, borderClass = s.border;
    if (mood != null && stress != null && anxiety != null) {
        let colors = ["var(--very_good)", "var(--good)", "var(--norm)", "var(--bad)", "var(--very_bad)"];
        let gradient = [];
        gradient.push(colors[4 - mood]);
        gradient.push(colors[stress]);
        gradient.push(colors[stress]);
        gradient.push(colors[anxiety]);
        gradient.push(colors[anxiety]);
        gradient.push(colors[4 - mood]);

        borderStyle.background = 'conic-gradient(' + gradient.join(', ') + ')';
        circleStyle.background = 'conic-gradient(' + gradient.join(', ') + ')'; 
        if (props.active)
            circleClass += " " + s.circleActive;       
    }
    if(props.active)
        borderClass += " " + s.borderActive;

    return (
        <div className={s.tile} onClick={() => {props.onClickTile(moment(props.date));}}>
            <div className={borderClass} style={borderStyle}>
                <div className={circleClass} style = {circleStyle}> <Subhead className = {s.tileText} weight = "regular"> {props.date.format("D")} </Subhead> </div>
            </div>
        </div>
    );
}

export default Tile;
