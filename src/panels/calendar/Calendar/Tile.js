import React from 'react';
import { Text } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { getDate } from '@wojtekmaj/date-utils';

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
        if(props.active){
            circleStyle.height = '100%';
            circleStyle.width = '100%';
        }
    }
    if (props.active){
        containerStyle.visibility = 'hidden';
        borderStyle.border = '2px solid rgba(0, 0, 0, 0.5)';
        borderStyle.height = '20px';
        borderStyle.width = '20px';
    }

    return (
        <div className='tile' onClick={() => { props.onClickTile(props.date) }}>
            <div className='border' style={borderStyle}>
                <div className='container' style = {containerStyle}>
                    <div className='circle' style = {circleStyle}> {(props.date != null) ? getDate(props.date) : null} </div>
                </div>
            </div>
        </div>
    );
}

export default Tile;
