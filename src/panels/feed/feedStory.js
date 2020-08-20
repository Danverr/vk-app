import React, {useState, useEffect} from 'react';

import {Panel, PanelHeader, View, PullToRefresh, PanelHeaderContext} from '@vkontakte/vkui';
import {List, Cell, PanelHeaderContent, CardGrid, Spinner} from '@vkontakte/vkui';
import {Button, Placeholder, ModalRoot, ModalCard} from '@vkontakte/vkui';

import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import Icon16Dropdown from '@vkontakte/icons/dist/16/dropdown';
import Icon56WriteOutline from '@vkontakte/icons/dist/56/write_outline';

import s from './feedStory.module.css';
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';
import TextPost from '../../components/textPost/textPost';
import entryWrapper from '../../components/entryWrapper';
import AccessPost from '../../components/accessPost/accessPost';
import DoneSnackbar from '../../components/doneSnackbar/doneSnackbar';
import ErrorSnackbar from '../../components/errorSnackbar/errorSnackbar';

const Feed = (props) => {
    const [fetching, setFetching] = useState(null);
    const [contextOpened, setContextOpened] = useState(null);
    const [mode, setMode] = useState(entryWrapper.mode);
    const [snackField, setSnackField] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const {popout, setPopout} = props.nav;

    const ButtonHolder = () => (
        <Button size="m" mode="tertiary" onClick={() => {
            setLoading(<Spinner size='small'/>);
            entryWrapper.fetchEntries();
        }}>
            Загрузить записи
        </Button>
    );

    const [displayEntries, setDisplayEntries] = useState(entryWrapper.entries);
    const [loading, setLoading] = useState(entryWrapper.wasError ? <ButtonHolder/> : entryWrapper.hasMore ?
        (!displayEntries.length) ? <Spinner size="large"/> : <Spinner size="small"/> : null);
    const [error, setError] = useState(null);

    const modal = (
        <ModalRoot
            activeModal={activeModal}
            onClose={() => {
                setActiveModal(null)
            }}
        >
            <ModalCard
                header="Нужно разрешение"
                caption="Для редактирования доступа к статистике нам нужен список ваших друзей"
                actions={[
                    {
                        title: "Дать разрешение",
                        mode: 'primary',
                        action: () => {
                            props.state.fetchUserToken(entryWrapper.addEdge);
                            setActiveModal(null)
                        }
                    }
                ]}
                id="tokenQuery" onClose={() => {
                setActiveModal(null)
            }}>

            </ModalCard>
        </ModalRoot>
    );

    const setErrorPlaceholder = (error) => {
        setError(error);
    };

    const setErrorSnackbar = (error) => {
        setSnackField(<ErrorSnackbar onClose={() => {
            setSnackField(null);
        }}/>);
    };

    const isVisibleBot = (id) => {
        let elem = document.querySelector(`.TextPost:nth-child(${id + 1})`);
        if (!elem) return 0;
        const posBot = elem.getBoundingClientRect().bottom;
        return posBot <= window.innerHeight;
    };

    const handleScroll = () => {
        Detect();
        if (!entryWrapper.loading && entryWrapper.entries.length && entryWrapper.hasMore && isVisibleBot(entryWrapper.entries.length - 1)) {
            entryWrapper.loading = 1;
            setTimeout(entryWrapper.fetchEntries, 1000);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        entryWrapper.setErrorSnackbar = setErrorSnackbar;
        entryWrapper.setErrorPlaceholder = setErrorPlaceholder;
        entryWrapper.setDisplayEntries = setDisplayEntries;
        entryWrapper.setLoading = setLoading;
        entryWrapper.setFetching = setFetching;

        if (entryWrapper.currentToolTip !== -1) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'visible';
        }
    }, []);

    useEffect(() => {
        const pState = props.state;
        if (pState.entryAdded) {
            pState.setEntryAdded(null);
            setSnackField(<DoneSnackbar onClose={() => {
                setSnackField(null)
            }}/>);
        }
        if (!pState.userInfo || !entryWrapper.wantUpdate) return;
        entryWrapper.initToolTips(pState.vkStorage);
        entryWrapper.fetchEntries(1);
    }, [props.state]);

    useEffect(() => {
        if (!displayEntries) return;
        handleScroll();
        // eslint-disable-next-line
    }, [displayEntries]);

    const toggleContext = () => {
        setContextOpened(!contextOpened);
    };

    const select = (e) => {
        if (e === mode) {
            toggleContext();
            return;
        }
        entryWrapper.hasMore = 1;
        setDisplayEntries([]);
        entryWrapper.mode = e;
        setMode(e);
        toggleContext();
        setLoading(<Spinner size="large"/>);
        setTimeout(() => {
            entryWrapper.fetchEntries(1)
        }, 1000);
    };

    const toggleRefresh = () => {
        setFetching(1);
        setTimeout(() => {
            entryWrapper.fetchEntries(1)
        }, 1000);
    };

    const isVisible = (id) => {
        let elem = document.querySelector(`.TextPost:nth-child(${id + 1})`);
        if (!elem) return 0;
        const posTop = elem.getBoundingClientRect().top;
        return posTop + 200 <= window.innerHeight;
    };

    const Detect = () => {
        if (!entryWrapper.toolTips.length) return;
        let ers = [];
        for (let key of entryWrapper.toolTips) {
            let id = -1;
            if (key.systemFlag) {
                id = entryWrapper.entries.findIndex((e) => (e.systemFlag && e.id === key.id));
            } else {
                id = entryWrapper.entries.findIndex((e) => (e.entryId === key.entryId));
            }
            if (id === -1) continue;
            if (!isVisible(id)) continue;
            entryWrapper.tQueue.push(id);
            ers.push(key);
        }
        for (let key of ers) {
            entryWrapper.toolTips.splice(entryWrapper.toolTips.findIndex((e) => (e === key)), 1);
        }
        entryWrapper.goNextToolTip();
    };

    const buttonRefresh = () => {
        setLoading(<Spinner size='small'/>);
        entryWrapper.fetchEntries(1)
    };

    const renderData = (entry, id) => {
        if (entry.systemFlag) {
            return <AccessPost postData={{
                user: entryWrapper.usersMap[entry.id],
                haveEdge: entryWrapper.pseudoFriends[entry.id],
                postEdge: entryWrapper.postEdge,
                setSnackField: setSnackField,
                setPopout: setPopout,
                wrapper: entryWrapper,
                setActiveModal: setActiveModal,
                state: props.state,
                nav: props.nav,
            }} key={id}/>
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
        }} key={id}/>
    };

    const Empty = () => {
        return <Placeholder
            icon={<Icon56WriteOutline fill='var(--text_secondary)'/>}
            header="Нет записей"
            stretched={true}
            action={<Button
                onClick={buttonRefresh}> {(entryWrapper.mode === 'feed') ? "Обновить ленту" : "Обновить дневник"} </Button>}
        >
            {entryWrapper.mode === 'feed' ?
                "Попросите друга дать вам доступ, импортируйте записи или создайте их самостоятельно" :
                "Импортируйте записи или создайте их самостоятельно"}
        </Placeholder>
    }

    return error ?
        <ErrorPlaceholder
            error={error}
            action={<Button onClick={() => {
                setError(null);
                entryWrapper.fetchEntries(1)
            }}> Попробовать снова </Button>}/>
        :
        <View
            id={props.id}
            popout={popout}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
            modal={modal}
        >
            <Panel id='main'>
                <PanelHeader separator={false} className={s.header}>
                    <PanelHeaderContent
                        onClick={toggleContext}
                        aside={<Icon16Dropdown style={{transform: `rotate(${contextOpened ? '180deg' : '0'})`}}/>}>
                        {mode === "feed" ? 'Лента' : 'Мой дневник'}
                    </PanelHeaderContent>
                </PanelHeader>
                <PanelHeaderContext opened={contextOpened} onClose={toggleContext}>
                    <List>
                        <Cell before={<Icon28Newsfeed/>}
                              onClick={() => {
                                  select('feed')
                              }}
                              asideContent={mode === "feed" ? <Icon24Done fill="var(--accent)"/> : null}
                              description="Все записи"
                        >
                            Лента
                        </Cell>
                        <Cell before={<Icon28ArticleOutline/>}
                              onClick={() => {
                                  select('diary')
                              }}
                              asideContent={mode === "diary" ? <Icon24Done fill="var(--accent)"/> : null}
                              description="Только мои записи"
                        >
                            Мой дневник
                        </Cell>
                    </List>
                </PanelHeaderContext>
                {(entryWrapper.hasMore || displayEntries.length) ?
                    <PullToRefresh onRefresh={toggleRefresh} isFetching={fetching} onScroll={Detect}>
                        <CardGrid className="entriesGrid">
                            {displayEntries.map(renderData)}
                        </CardGrid>
                        {(!entryWrapper.hasMore && !displayEntries.length) && Empty()}
                    </PullToRefresh> : null
                }
                {(!entryWrapper.hasMore && !displayEntries.length) ?
                    Empty() : null
                }
                {loading ? <div className={s.loadingContainer}>{loading}</div> : null}
                {snackField}
            </Panel>
        </View>
};

export default Feed;
