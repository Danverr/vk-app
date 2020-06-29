import React, { useState } from 'react';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

import Daylio from './daylio'

const ImportEntries = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Импорт из Daylio
            </PanelHeader>
            <Daylio state = {props.state}/>
        </Panel>
    );
}
export default ImportEntries;