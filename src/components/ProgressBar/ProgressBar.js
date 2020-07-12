import React from 'react';
import s from './ProgressBar.module.css'
import getColors from '../../utils/getColors'    

function getColor(param, value) {
    const v = getColors(param);
    if (value <= 20) return v[0];
    if (value <= 40) return v[1];
    if (value <= 60) return v[2];
    if (value <= 80) return v[3];
    return v[4];
}

const ProgressBar = (props) => {
    return (
        <div className={s.Progress}>
            <div className={s.Progress__bg} />
            <div className={s.Progress__in} style={{ width: `${props.value}%`, background: getColor(props.param, props.value) }} />
        </div>
    );
};

export default ProgressBar;