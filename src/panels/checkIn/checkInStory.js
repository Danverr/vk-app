import React, {useState, useEffect} from 'react';
import {View, Panel} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import TestPanel from "./testPanel/testPanel";
import testPanelsData from "./testPanel/testPanelsData";

const CheckInStory = (props) => {
    const [testPanels] = useState(testPanelsData.map((panelData, i, arr) => {
        return (<TestPanel id={panelData.name}
                           goTo={() => {
                               props.nav.goTo(props.id, i + 1 < arr.length ? arr[i + 1].name : "submit");
                           }}
                           answer={props.answer}
                           setAnswer={props.setAnswer}
                           panelData={panelData}
                           panelIndex={i}
                           panelsCount={arr.length + 1}
        />);
    }));

    return (
        <View id={props.id}
              activePanel={props.nav.activePanel}
              history={props.nav.viewHistory}
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

