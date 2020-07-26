import React from 'react';
import getColors from '../../utils/getColors';
import styles from "./progressBar.module.css";

const ProgressBar = (props) => {
    const colors = getColors(props.param);
    const color = props.value ? colors[Math.ceil(props.value / 20) - 1] : 0;

    return (
        <div className={`Progress ${styles.colorfulProgressBar}`}>
            <div className="Progress__bg"/>
            <div className="Progress__in" style={{width: `${props.value}%`, background: color}}/>
        </div>
    );
};

export default ProgressBar;