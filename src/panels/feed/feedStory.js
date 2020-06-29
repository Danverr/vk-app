import React, { useState, useEffect } from 'react';

import {
    Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent,
    CardGrid, Spinner
} from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ListOutline from '@vkontakte/icons/dist/28/list_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import './feedStory.css'

import states from '../../components/entryConvex.js'

import api from '../../utils/api'

const Feed = (props) => {
    const [curPopout, setCurPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(states.feed.currentMode);
    const [deletedEntryField, setDeletedEntryField] = useState(null);

    const [displayEntries, setDisplayEntries] = useState(
        (states.feed.renderedEntries) ? states.feed.getRenderedEntries() : < Spinner size='large' />);

    useEffect(() => {
        if (!props.state.userInfo || !props.state.userToken) return;

        states.feed.init(setDeletedEntryField, setCurPopout, setDisplayEntries,
            props.state.userInfo, 
            props.state.userToken, setFetching);

        if (!states.feed.needUpdate) return;

        states.feed.setNeedUpdate(0);
        states.feed.updateState();
    }, [wasUpdated, mode, props.state]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) { toggleContext(); return; }
        setDisplayEntries(<Spinner size='large' />);
        states.feed.setMode(e);
        states.feed.setNeedUpdate(1);
        setMode(e);
        toggleContext();
    };

    const toggleRefresh = () => {
        setFetching(1);
        states.feed.setNeedUpdate(1);
        setWasUpdated(!wasUpdated);
    };

    return (
        <View
            id={props.id}
            popout={curPopout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id='main'>
                <PanelHeader separator={false}>
                    <PanelHeaderContent
                        onClick={toggleContext}
                        aside={<Icon16Dropdown style={{ transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}>
                        {mode === "feed" ? 'Лента' : 'Мой дневник'}
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={contextOpened} onClose={toggleContext} >
                    <List>
                        <Cell before={<Icon28Newsfeed />}
                            onClick={() => { select('feed') }}
                            asideContent={mode === "feed" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Лента
                        </Cell>
                        <Cell before={<Icon28ListOutline />}
                            onClick={() => { select('diary') }}
                            asideContent={mode === "diary" ? <Icon24Done fill="var(--accent)" /> : null}>
                            Мой дневник
                        </Cell>
                    </List>
                </PanelHeaderContext>
                <PullToRefresh onRefresh={toggleRefresh} isFetching={fetching}>
                    <CardGrid className="grid">
                        {displayEntries}
                    </CardGrid>
                </PullToRefresh>
                {deletedEntryField}
            </Panel>
        </View>
    )


}

export default Feed;

/*
 *  <button onClick={toggleRefresh}> Обновить страничку (кнопка для дебага) </button>
 */
