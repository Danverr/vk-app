import React, { useState, useEffect } from 'react';

import { Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext } from '@vkontakte/vkui';
import { List, Cell, PanelHeaderContent, CardGrid, Spinner } from '@vkontakte/vkui';
import { Snackbar, Placeholder } from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';

import s from './feedStory.module.css';
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';
import TextPost from '../../components/TextPost/textPost';
import InfiniteScroll from 'react-infinite-scroll-component';
import entryWrapper from '../../components/entryWrapper';
import AccesEntry from '../../components/AccessEntry/AccessEntry';

const Done = ({ onClose }) => {
    return <Snackbar
        layout="horizontal"
        onClose={onClose}
        duration={5000}
        before={<Icon16CheckCircle fill="var(--accent)" height={24} width={24} />}
    >
        Изменения сохранены
    </Snackbar>;
};

const ErrorSnackbar = ({onClose}) => {
    return <Snackbar
        before={<Icon28ErrorOutline fill="#E64646" height={24} width={24}/>}
        onClose={onClose} >
            Произошла ошибка
    </Snackbar >
};

const Feed = (props) => {
    const [popout, setPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(null);
    const [snackField, setSnackField] = useState(null);
    const [loading, setLoading] = useState(entryWrapper.hasMore ? <Spinner size='large' /> : null);
    const [displayEntries, setDisplayEntries] = useState(entryWrapper.entries);
    const [error, setError] = useState(null);

    const setErrorPlaceholder = (error) => {
        setError(error);
    };

    const setErrorSnackbar = (error) => {
        setSnackField(<ErrorSnackbar onClose={()=>{setSnackField(null);}}/>);
    }

    useEffect(() => {
        entryWrapper.setErrorSnackbar = setErrorSnackbar;
        entryWrapper.setErrorPlaceholder = setErrorPlaceholder;
        entryWrapper.setDisplayEntries = setDisplayEntries;
        entryWrapper.setLoading = setLoading;
        entryWrapper.setFetching = setFetching;
    }, [])

    useEffect(() => {
        const pState = props.state;
        if (pState.entryAdded) {
            pState.setEntryAdded(null);
            setSnackField(<Done onClose={() => { setSnackField(null) }} />);
        }
        if (!pState.userInfo || !pState.userToken || !entryWrapper.wantUpdate) return;
        entryWrapper.userInfo = pState.userInfo;
        entryWrapper.userToken = pState.userToken;
        setLoading(<Spinner size='large' />);
        entryWrapper.fetchEntries(1);
    }, [props.state]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) {
            toggleContext();
            return;
        }
        entryWrapper.mode = e;
        setDisplayEntries([]);
        setMode(e);
        toggleContext();
        setLoading(<Spinner size='large' />);
        entryWrapper.fetchEntries(1);
    };

    const toggleRefresh = () => {
        setFetching(1);
        entryWrapper.fetchEntries(1, 1);
    };

    const renderData = (entry, id) => {
        if (entry.systemFlag) {
            return <AccesEntry postData={{
                user: entryWrapper.usersMap[entry.id],
                nav: props.nav,
                haveEdge: entryWrapper.pseudoFriends[entry.id],
            }}  key={id}/>
        }
        return <TextPost postData={{
            post: entry,
            user: entryWrapper.usersMap[entry.userId],
            currentUser: entryWrapper.userInfo,
            setSnackField: setSnackField,
            setPopout: setPopout,
            setDisplayEntries: setDisplayEntries,
            setUpdatingEntryData: props.state.setUpdatingEntryData,
            wrapper: entryWrapper,
            nav: props.nav,
        }}  key={id}/>
    };

    const Empty = () => {
        return <Placeholder
            icon={<Icon56WriteOutline fill='var(--text_secondary)' />}
            header="Нет записей"
            stretched={true}
        >
            {entryWrapper.mode === 'feed' ?
                "Попросите друга дать вам доступ, импортируйте записи из Daylio или создайте их самостоятельно" :
                "Импортируйте записи из Daylio или создайте их самостоятельно"}
        </Placeholder>
    }

    return error ? <ErrorPlaceholder error={error} /> :
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
                    <InfiniteScroll
                        hasMore={true}
                        dataLength={displayEntries.length}
                        next={entryWrapper.fetchEntries}
                        scrollThreshold={1}
                    >
                        <CardGrid className="entriesGrid">
                            {displayEntries.map(renderData)}
                        </CardGrid>
                        {(!entryWrapper.hasMore && !displayEntries.length) && Empty()}
                    </InfiniteScroll>
                </PullToRefresh>
                {loading}
                {snackField}
            </Panel>
        </View >

}

export default Feed;
