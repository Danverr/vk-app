import React, {useState, useEffect} from 'react';
import {View, Panel} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import TestPanel from "./testPanel";
import testPanelsData from "./testPanelsData";

const CheckInStory = (props) => {
    const [answer, setAnswer] = useState({
        userId: (props.usersInfo ? props.usersInfo[0].id : null),
        mood: null,
        stress: null,
        anxiety: null,
        isPublic: 0,
    });
    const [testPanels] = useState(testPanelsData.map((panelData, i, arr) => {
        return (<TestPanel id={panelData.name}
                           goTo={() => {
                               props.nav.goTo(props.id, i + 1 < arr.length ? arr[i + 1].name : "submit");
                           }}
                           answer={answer}
                           setAnswer={setAnswer}
                           panelData={panelData}
                           panelIndex={i}
                           panelsCount={arr.length + 1}
        />);
    }));

    return (
        <View id={props.id}
              activePanel={props.nav.panel}
              history={props.nav.history}
              onSwipeBack={props.nav.goBack}
        >
            {testPanels[0]}
            {testPanels[1]}
            {testPanels[2]}
            <Panel id="submit">
                submit
            </Panel>
        </View>
    );
};

export default CheckInStory;

