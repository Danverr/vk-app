import React, {useState, useEffect} from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import TestPanel from "./testPanel/testPanel";
import SubmitPanel from "./submitPanel/submitPanel";
import testPanelsData from "./testPanel/testPanelsData";
import style from "./checkInStory.module.css";

const getBullets = (index = testPanelsData.length) => {
    let bullets = [];

    for (let i = 0; i < testPanelsData.length + 1; i++) {
        let bulletStyles = style.bullet;

        if (i === index) {
            bulletStyles += " " + style.bulletSelected;
        }

        bullets.push(<div key={i} className={bulletStyles}/>);
    }

    return (<div className={style.bulletsContainer}>{bullets}</div>);
};

const CheckInStory = (props) => {
    const [loading, setLoading] = useState(null);
    const testPanels = testPanelsData.map((panelData, i, arr) => {
        return (<TestPanel id={panelData.name}
                           goTo={() => {
                               props.nav.goTo(props.id, i + 1 < arr.length ? arr[i + 1].name : "submit");
                           }}
                           answer={props.answer}
                           setAnswer={props.setAnswer}
                           bullets={getBullets(i)}
                           panelData={panelData}
        />);
    });

    useEffect(() => {
        props.nav.setNavbarVis(false);
        return () => {
            props.nav.setNavbarVis(true);
        };
    }, []);

    return (
        <View id={props.id}
              popout={loading}
              activePanel={props.nav.activePanel}
              history={props.nav.panelHistory[props.id]}
              onSwipeBack={props.nav.goBack}
        >
            {testPanels[0]}
            {testPanels[1]}
            {testPanels[2]}
            <SubmitPanel id="submit"
                         answer={props.answer}
                         setAnswer={props.setAnswer}
                         bullets={getBullets()}
                         nav={props.nav}
                         setLoading={setLoading}
            />
        </View>
    );
};

export default CheckInStory;

