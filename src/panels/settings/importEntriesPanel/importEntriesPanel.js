import React, { useState, useRef } from 'react';
import { File, FormLayout, Panel, PanelHeader, PanelHeaderBack, PanelHeaderContent, PanelHeaderContext, List, Cell } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';

import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon24Done from '@vkontakte/icons/dist/24/done'

import Daylio from './daylio'
import Moodpath from './moodpath'

const ImportEntries = (props) => {
    const [contextOpened, setContextOpened] = useState(false);
    const [activeImport, setActiveImport] = useState("daylio");

    const select = (e) => {
        const mode = e.currentTarget.dataset.mode;
        setContextOpened(false);
        setActiveImport(mode);
    }

    return (
        <Panel id={props.id}>
            <PanelHeader separator={false} left={<PanelHeaderBack onClick={() => { props.nav.goBack(); }} />} >
                <PanelHeaderContent
                    aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
                    onClick={() => {setContextOpened(!contextOpened);}}>
                {activeImport}
                </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext
                opened={contextOpened}
                onClose={() => { setContextOpened(false); }}>
                <List>
                    <Cell
                        asideContent={activeImport === 'daylio' ? <Icon24Done fill="var(--accent)" /> : null}
                        onClick={select}
                        data-mode="daylio">
                        Daylio
                </Cell>
                    <Cell
                        asideContent={activeImport === 'moodpath' ? <Icon24Done fill="var(--accent)" /> : null}
                        onClick={select}
                        data-mode="moodpath">
                        Moodpath
                </Cell>
                </List>
            </PanelHeaderContext>
            {activeImport == "daylio" && <Daylio state = {props.state}/>}
            {activeImport == "moodpath" && <Moodpath state = {props.state}/>}
        </Panel>
    );
}
export default ImportEntries;