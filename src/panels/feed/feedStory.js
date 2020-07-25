import React, { useState, useEffect } from 'react';

import { Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext } from '@vkontakte/vkui';
import { List, Cell, PanelHeaderContent, CardGrid, Spinner } from '@vkontakte/vkui';
import { Snackbar, Text, Placeholder, Title } from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import bridge from "@vkontakte/vk-bridge";
import api from '../../utils/api';
import moment from 'moment';
import s from './feedStory.module.css';
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';
import TextPost from '../../components/TextPost/TextPost';
import AccessEntry from '../../components/AccessEntry/AccessEntry';
import InfiniteScroll from 'react-infinite-scroll-component';
import entryWrapper from '../../components/entryWrapper';
import AccesEntry from '../../components/AccessEntry/AccessEntry';

const UPLOADED_QUANTITY = 1000;
const FIRST_BLOCK_SIZE = 15;

function back(ar) {
    return ar[ar.length - 1];
};

function cmp(l, r) {
    if (moment.utc(l.date).isBefore(moment.utc(r.date))) return 1;
    if (moment.utc(r.date).isBefore(moment.utc(l.date))) return -1;
    return 0;
}

let deleteEntryFromFeedList = (entryData) => {
    DAT.entries.splice(DAT.entries.findIndex((e) => { return e.entryId === entryData.post.entryId }), 1);
}

let DAT = {
    usersMap: {},
    entries: [],
    mode: 'feed',
    hasMore: 1,
    queue: [],
    accessEntries: [],
    accessEntriesPointer: 0,
    wantUpdate : 1,

    deleteEntryFromFeedList: deleteEntryFromFeedList,
    deleteEntryFromList : deleteEntryFromFeedList,

    Error: (error) => {
        DAT.setError(error);
    },

    addEntryToFeedList: (entryData) => {
        let entry = {};
        for (let key in entryData) {
            entry[key] = entryData[key].val;
        }
        entry.userId = DAT.userInfo.id;

        entry.date = entry.date.utc().format("YYYY-MM-DD HH:mm:ss");

        for (let key in DAT.entries) {
            if (cmp(entry, DAT.entries[key]) === -1) {
                DAT.entries.splice(key, 0, entry);
                return;
            }
        }

        if (!DAT.hasMore) {
            DAT.entries.push(entry);
        } else {
            for (let key in DAT.queue) {
                if (cmp(entry, DAT.queue[key]) === -1) {
                    DAT.queue.splice(key, 0, entry);
                    return;
                }
            }
        }
    },

    deleteEntryFromBase: (entryData) => {
        const Promise = api("DELETE", "/entries/", { entryId: entryData.post.entryId });
        Promise.catch(Error);
    },

    fetchFriendsInfo: async () => {
        if (DAT.mode === 'diary') return;
        const accessPromise = api("GET", "/statAccess", { type: 'fromId' });
        accessPromise.catch(Error);
        DAT.accessEntries = (await accessPromise).data;
        DAT.friends = [];
        DAT.accessEntries.forEach((accessEntry) => {
            accessEntry.systemFlag = 1; DAT.friends.push(accessEntry.id)
        });
        DAT.friends.push(DAT.userInfo.id);
        const newFriends = [];
        DAT.friends.forEach((friend) => {
            if (typeof DAT.usersMap[friend] === 'undefined') {
                newFriends.push(friend);
            }
        });
        if (newFriends.length) {
            const Promise = bridge.send("VKWebAppCallAPIMethod", {
                method: "users.get",
                params: {
                    access_token: DAT.userToken,
                    v: "5.103",
                    user_ids: newFriends.join(","),
                    fields: "photo_50, photo_100, sex"
                }
            });
            Promise.catch(Error);
            const newFriendsData = (await Promise).response;
            newFriendsData.forEach((friend) => { DAT.usersMap[friend.id] = friend; });
        }
    },

    fetchPseudoFriends: async () => {
        if (DAT.mode === 'diary') return;
        const Promise = api("GET", "/statAccess", { type: 'toId' });
        Promise.catch(Error);
        DAT.pseudoFriends = {};
        (await Promise).data.forEach((friend) => {
            DAT.pseudoFriends[friend.id] = 1;
        });
    },

    fetchEntriesPack: (PACK_SZ, lastDate) => {
        const queryData = {
            lastDate: lastDate,
            count: PACK_SZ,
            users: (DAT.mode === 'diary') ? DAT.userInfo.id : DAT.friends.join(',')
        };
        const Promise = api("GET", "/entries/", queryData);
        Promise.catch(Error);
        return Promise;
    },

    fetchEntries: async (isFirstTime = null, afterPull = null) => {
        const Pop = (POP_LIMIT = 2) => {
            let cur = Math.min(POP_LIMIT, DAT.queue.length);
            let obj = DAT.entries.slice(0);
            for (let i = 0; i < cur;) {
                if (DAT.accessEntriesPointer < DAT.accessEntries.length && cmp(DAT.accessEntries[DAT.accessEntriesPointer], DAT.queue[i]) === -1) {
                    let current = DAT.accessEntries[DAT.accessEntriesPointer++];
                    DAT.entries.push(current);
                    obj.push(current);
                    cur--;
                    continue;
                }
                obj.push(DAT.queue[i]);
                DAT.entries.push(DAT.queue[i]);
                i++;
            }
            DAT.setDisplayEntries(obj);
            if (afterPull && DAT.hasMore) {
                DAT.setLoading(<Spinner size='large' />);
            }
            DAT.queue.splice(0, cur);
        }

        if (isFirstTime) {
            [DAT.hasMore, DAT.entries, DAT.accessEntries, DAT.queue, DAT.wantUpdate, DAT.accessEntriesPointer]
                = [1, [], [], [], 0, 0]
            await DAT.fetchFriendsInfo();
            await DAT.fetchPseudoFriends();
        }

        if (DAT.queue.length) { Pop(); return }

        let lastDate = (DAT.entries.length) ? back(DAT.entries).date :
            moment.utc().add(1, 'day').format("YYYY-MM-DD HH:MM:SS");

        const Promise = DAT.fetchEntriesPack(UPLOADED_QUANTITY, lastDate, isFirstTime);

        Promise.then((result) => {
            let newEntries = result.data;
            DAT.queue = DAT.queue.concat(newEntries);
            if (!newEntries.length || (isFirstTime && newEntries.length < FIRST_BLOCK_SIZE)) {
                DAT.setLoading(null);
                DAT.hasMore = false;
                while (DAT.accessEntriesPointer < DAT.accessEntries.length) {
                    DAT.queue.push(DAT.accessEntries[DAT.accessEntriesPointer++]);
                }
                DAT.queue.sort(cmp);
            }
            if (!isFirstTime) {
                Pop();
            } else {
                Pop(FIRST_BLOCK_SIZE);
                DAT.setFetching(null);
            }
        });
    },

}

const Done = ({ onClose }) => {
    return (<Snackbar
        layout="horizontal"
        onClose={onClose}
        duration={5000}
        before={<Icon16CheckCircle fill="var(--accent)" height={24} width={24} />}
    >
        <Text> Изменения сохранены </Text>
    </Snackbar>);
};

const Feed = (props) => {
    const [popout, setPopout] = useState(null);
    const [fetching, setFetching] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(DAT.mode);
    const [deletedEntryField, setDeletedEntryField] = useState(null);
    const [loading, setLoading] = useState(DAT.hasMore ? <Spinner size='large' /> : null);
    const [displayEntries, setDisplayEntries] = useState(DAT.entries);
    const [error, setError] = useState(null);

    useEffect(() => {
        [DAT.setError, DAT.setDisplayEntries, DAT.setLoading] = [setError, setDisplayEntries, setLoading];
        [DAT.setFetching, entryWrapper.deleteEntryFromFeedList, entryWrapper.addEntryToFeedList] =
            [setFetching, DAT.deleteEntryFromFeedList, DAT.addEntryToFeedList];
    }, [])

    useEffect(() => {
        const pState = props.state;
        if (pState.entryAdded) {
            pState.setEntryAdded(null);
            setDeletedEntryField(<Done onClose={() => { setDeletedEntryField(null) }} />);
        }
        if (!pState.userInfo || !pState.userToken) return;
        [DAT.userInfo, DAT.userToken] = [pState.userInfo, pState.userToken];
    }, [props.state]);

    useEffect(() => {
        if (!DAT.userInfo || !DAT.userToken || !DAT.wantUpdate) return;
        setLoading(<Spinner size='large' />);
        DAT.fetchEntries(1);
    }, [props.state]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) {
            toggleContext();
            return;
        }
        DAT.mode = e;
        setDisplayEntries([]);
        setMode(e);
        toggleContext();
        setLoading(<Spinner size='large' />);
        DAT.fetchEntries(1);
    };

    const toggleRefresh = () => {
        setFetching(1);
        DAT.fetchEntries(1, 1);
    };

    const renderData = (entry, id) => {
        if (entry.systemFlag) {
            return <AccesEntry postData={{
                user: DAT.usersMap[entry.id],
                nav: props.nav,
                haveEdge: DAT.pseudoFriends[entry.id],
            }} key={id} />
        }
        return <TextPost postData={{
            post: entry,
            user: DAT.usersMap[entry.userId],
            currentUser: DAT.userInfo,
            setDeletedEntryField: setDeletedEntryField,
            setPopout: setPopout,
            setDisplayEntries: setDisplayEntries,
            setUpdatingEntryData: props.state.setUpdatingEntryData,
            wrapper: DAT,
            nav: props.nav,
            visible: 1,
        }} key={id} />
    };

    const Empty = () => {
        return <Placeholder
            icon={<Icon56WriteOutline fill='var(--text_secondary)' />}
            header={<Title level='2' weight='medium'> Нет записей </Title>}
            stretched={true}
        >
            {DAT.mode === 'feed' ?
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
                        next={DAT.fetchEntries}
                        scrollThreshold={1}
                    >
                        <CardGrid className="entriesGrid">
                            {displayEntries.map(renderData)}
                        </CardGrid>
                        {(!DAT.hasMore && !displayEntries.length) && Empty()}
                    </InfiniteScroll>
                </PullToRefresh>
                {loading}
                {deletedEntryField}
            </Panel>
        </View >

}

export default Feed;
