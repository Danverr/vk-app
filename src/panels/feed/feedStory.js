import React, { useState, useEffect } from 'react';

import { Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext, List, Cell, PanelHeaderContent, CardGrid, Spinner, Snackbar, Text } from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';

import s from './feedStory.module.css'
import states from '../../components/entryWrapper'
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';

let localState = { ...states.feed }

const Feed = (props) => {
    const [popout, setPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [wasUpdated, setWasUpdated] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(localState.mode);
    const [deletedEntryField, setDeletedEntryField] = useState(null);
    const [error, setError] = useState(null);

    const [displayEntries, setDisplayEntries] = useState(localState.renderedEntries);

    useEffect(() => {
        const pState = props.state;

        if (pState.entryAdded) {
            pState.setEntryAdded(null);
            setDeletedEntryField(
                <Snackbar
                    layout="horizontal"
                    onClose={() => { setDeletedEntryField(null); }}
                    duration={5000}
                    before={<Icon16CheckCircle fill="var(--accent)" height={24} width={24} />}
                >
                    <Text> Изменения сохранены </Text>
                </Snackbar>)
        }

        if (!pState.userInfo || !pState.userToken) return;

        localState = {
            ...localState,
            setDeletedEntryField: setDeletedEntryField,
            setPopout: setPopout,
            setDisplayEntries: setDisplayEntries,
            userInfo: pState.userInfo,
            userToken: pState.userToken,
            setFetching: setFetching,
            nav: props.nav,
            setUpdatingEntryData: pState.setUpdatingEntryData,
            setError: setError,
        }

        localState.updateState();
    }, [wasUpdated, mode, props.state]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) { toggleContext(); return; }
        setDisplayEntries(<Spinner size='large' />);
        localState.mode = e;
        setMode(e);
        toggleContext();
    };

    const toggleRefresh = () => {
        setFetching(1);
        setWasUpdated(!wasUpdated);
    };

    return error ? <ErrorPlaceholder error={error}/> : (
        <View
            id={props.id}
            popout={popout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id='main'>
                <PanelHeader separator={false} className={s.header}>
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
                            asideContent={mode === "feed" ? <Icon24Done fill="var(--accent)" /> : null}
                            description="Все записи"
                        >

                            Лента
                        </Cell>
                        <Cell before={<Icon28ArticleOutline />}
                            onClick={() => { select('diary') }}
                            asideContent={mode === "diary" ? <Icon24Done fill="var(--accent)" /> : null}
                            description="Только мои записи"
                        >
                            Мой дневник
                        </Cell>
                    </List>
                </PanelHeaderContext>

                <PullToRefresh onRefresh={toggleRefresh} isFetching={fetching}>
                    <CardGrid className={s.grid}>
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
