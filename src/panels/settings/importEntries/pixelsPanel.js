  
import React from 'react';
import { Panel, PanelHeader, PanelHeaderBack, Button, Placeholder } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon56DoNotDisturbOutline from '@vkontakte/icons/dist/56/do_not_disturb_outline';

const PixelsPanel = (props) => {
    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                Импорт
            </PanelHeader>  
            <Placeholder stretched 
                icon = {<Icon56DoNotDisturbOutline/>}
                header = "Раздел находится в разработке"
                action = {<Button onClick = {() => props.nav.goBack()}> Вернуться обратно </Button>}/>     
        </Panel>
    );
}
export default PixelsPanel;