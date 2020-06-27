import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { getDate } from '@wojtekmaj/date-utils';
import s from './Calendar.module.css';

const Tile = (props) => {
    const {
        mood,
        stress,
        anxiety
    } = props;

    let borderStyle = {}, circleStyle = {}, containerStyle = {};
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
    }
    if (props.active){
        borderStyle.border = '2px solid rgba(0, 0, 0, 0.5)';
        circleStyle.height = '22px';
        circleStyle.width = '22px';
        borderStyle.height = '20px';
        borderStyle.width = '20px';
    }

    return (
        <div className={s.tile} onClick={() => { props.onClickTile(props.date) }}>
            <div className={s.border} style={borderStyle}>
                <div className={s.container} style = {containerStyle}>
                    <div className={s.circle} style = {circleStyle}> {(props.date != null) ? getDate(props.date) : null} </div>
                </div>
            </div>
        </div>
    );
}

export default Tile;
