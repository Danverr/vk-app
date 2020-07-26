import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, View, Div, Header, Group, Spinner, CardGrid} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import moment from 'moment';
import Calendar from './Calendar/Calendar';
import ErrorPlaceholder from '../../components/errorPlaceholder/errorPlaceholder';
import TextPost from '../../components/textPost/textPost';
import api from '../../utils/api.js'
import entryWrapper from '../../components/entryWrapper'
function calendarStateUpdate() {
    const temp = {};
    localState.allEntries.forEach((entry) => {
        let date = moment.utc(entry.date);
        let now = date.local().format("YYYY-MM-DD");

        if (temp[now] == null) temp[now] = [entry];
        else temp[now] = [...temp[now], entry];
    });
    localState.entriesOfDate = temp;

    let stats = {};

    for (let day in temp) {
        let mood = 0, stress = 0, anxiety = 0;

        temp[day].forEach((entry) => {
            mood += entry.mood;
            stress += entry.stress;
            anxiety += entry.anxiety;
        });

        mood /= temp[day].length;
        stress /= temp[day].length;
        anxiety /= temp[day].length;
        mood = Math.floor(mood + 0.5);
        stress = Math.floor(stress + 0.5);
        anxiety = Math.floor(anxiety + 0.5);
        stats[day] = {mood: mood, stress: stress, anxiety: anxiety};
    }
    localState.userStats = stats;
    localState.setUserStats(stats);
    localState.setFetching(0);
}

function fetchCalendar() {
    localState.usersMap[localState.userInfo.id] = localState.userInfo;
    api("GET", "/entries/", {users: localState.userInfo.id}).catch((error) => {
        localState.setError(error)
    }).then((result) => {
        localState.allEntries = result.data;
        localState.calendarStateUpdate();
    });
}

function deleteEntryFromBase(entryData) {
    api("DELETE", "/entries/", {entryId: entryData.post.entryId}).catch((error) => {
        localState.setError(error)
    });
}

function deleteEntryFromList(entryData) {
    localState.entries.splice(localState.entries.findIndex((e) => {
        return e === entryData.post
    }), 1);
    localState.allEntries.splice(localState.allEntries.findIndex((e) => {
        return e === entryData.post
    }), 1);
    localState.calendarStateUpdate();
}

let localState = {
    mode: 'calendar',
    usersMap: {},
    entries: [],
    calendarStateUpdate: calendarStateUpdate,
    deleteEntryFromBase: deleteEntryFromBase,
    deleteEntryFromList: deleteEntryFromList,
    fetchCalendar: fetchCalendar,
    calendarField: <Spinner size="large" style={{marginTop: 20}}/>,
    curDate: null
};

const CalendarStory = (props) => {
    const [calendarField, setCalendarField] = useState(localState.calendarField);
    const [entriesField, setEntriesField] = useState(localState.entries);
    const [userStats, setUserStats] = useState(localState.userStats);
    const [curDate, setCurDate] = useState(moment(localState.curDate));
    const [popout, setPopout] = useState(null);
    const [fetching, setFetching] = useState(1);
    const [deletedEntryField, setDeletedEntryField] = useState(null);
    const [error, setError] = useState(null);

    const {userInfo} = props.state;

    useEffect(() => {
        if (!userInfo.id)
            return;

        localState = {
            ...localState,
            userInfo: userInfo,
            setFetching: setFetching,
            setUserStats: setUserStats,
            setError: setError,
        }

        localState.fetchCalendar();
    }, [userInfo]);


    //изменился выбранный день или загрузились записи пользователя
    useEffect(() => {
        if (!userInfo || !curDate || fetching)
            return;
        setEntriesField(<Spinner size="large"/>);

        localState.entries = []

        if (localState.entriesOfDate[curDate.format("YYYY-MM-DD")]) {
            localState.entries = localState.entriesOfDate[curDate.format("YYYY-MM-DD")].slice(0);
        }

        setEntriesField(localState.entries);

    }, [userInfo, fetching, curDate]);

    useEffect(() => {
        let temp = <Calendar
            setPopout={setPopout}
            onDateChange={(date) => {
                setCurDate(moment(date));
                localState.curDate = moment(date);
            }}
            stats={userStats}/>;
        setCalendarField(temp);
        localState.calendarField = temp;
    }, [userStats])

    const renderData = (entry) => {
        const dat = {
            post: entry, user: localState.usersMap[entry.userId],
            currentUser: localState.userInfo,
            setDeletedEntryField: setDeletedEntryField,
            setPopout: setPopout,
            setDisplayEntries: setEntriesField,
            setUpdatingEntryData: props.state.setUpdatingEntryData,
            wrapper: localState,
            nav: props.nav,
            deleteEntryFromFeedList: entryWrapper.deleteEntryFromFeedList,
            visible: 1,
        };
        return <TextPost postData={dat} key={entry.entryId}/>
    };

    return error ? <ErrorPlaceholder error={error}/> : (
        <View id={props.id}
              popout={popout}
              activePanel={props.nav.activePanel}
              history={props.nav.viewHistory}
              onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{paddingTop: "0", paddingBottom: "0"}}>
                        {calendarField}
                    </Div>
                </Group>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>}>
                    <CardGrid className="entriesGrid">
                        {entriesField.map(renderData)}
                    </CardGrid>
                </Group>
                {deletedEntryField}
            </Panel>
        </View>
    );
};

export default CalendarStory;