import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group, Spinner, CardGrid } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import moment from 'moment';
import Calendar from './Calendar/Calendar';
import states from '../../components/entryWrapper';
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';

let localState = {
    ...states.calendar, 
    calendarField: <Spinner size="large" style={{ marginTop: 20 }} />,
    curDate: null
};

const CalendarStory = (props) => {
    const [calendarField, setCalendarField] = useState(localState.calendarField);
    const [entriesField, setEntriesField] = useState(localState.renderedEntries);
    const [userStats, setUserStats] = useState(localState.userStats);
    const [curDate, setCurDate] = useState(moment(localState.curDate));
    const [popout, setPopout] = useState(null);
    const [fetching, setFetching] = useState(1);
    const [deletedEntryField, setDeletedEntryField] = useState(null);
    const [error, setError] = useState(null);

    const { userInfo } = props.state;

    useEffect(() => {
        if (!userInfo.id)
            return;

        localState = {
            ...localState,
            setDeletedEntryField: setDeletedEntryField,
            setPopout: setPopout,
            setDisplayEntries: setEntriesField,
            userInfo: userInfo,
            setFetching: setFetching,
            nav: props.nav,
            setUpdatingEntryData: props.state.setUpdatingEntryData,
            setUserStats: setUserStats,
            setError: setError,
        }

        localState.updateState();
    }, [userInfo]);


    //изменился выбранный день или загрузились записи пользователя
    useEffect(() => {
        if (!userInfo || !curDate || fetching)
            return;

        if (localState.entriesOfDate[curDate.format("YYYY-MM-DD")]) {
            let temp = [];
            let objs = [];
            localState.entriesOfDate[curDate.format("YYYY-MM-DD")].forEach((entry) => {
                const obj = {
                    user: userInfo,
                    post: entry,
                    currentUser: userInfo,
                    states: localState,
                };
                objs.push(obj);
            });
            localState.setEntries(1, objs);
        } else {
            localState.setEntries(1, null);
        }
    }, [userInfo, fetching, curDate]);

    useEffect(() => {
        let temp = <Calendar
            setPopout={setPopout}
            onDateChange={(date) => {
                setCurDate(moment(date));
                localState.curDate = moment(date);
            }}
            stats={userStats} />;
        setCalendarField(temp);
        localState.calendarField = temp;
    }, [userStats])

    return error ? <ErrorPlaceholder error={error} /> : (
        <View id={props.id}
            popout={popout}
            activePanel={props.nav.activePanel}
            history={props.nav.viewHistory}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{ paddingTop: "0px" }}>
                        {calendarField}
                    </Div>
                </Group>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>}>
                    <CardGrid className="grid">
                        {entriesField}
                    </CardGrid>
                </Group>
                {deletedEntryField}
            </Panel>
        </View>
    );
};

export default CalendarStory;