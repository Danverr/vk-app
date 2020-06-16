import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

const DaylioPanel = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Уведомления
            </PanelHeader>
        </Panel>
    );
}
export default DaylioPanel;