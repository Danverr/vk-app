import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group, Spinner, CardGrid } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import api from "../../utils/api";
import moment from 'moment';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './Calendar/Calendar';

import states from '../../components/entryConvex.js'

let localState = {
    calendarField: <Spinner size="large" style={{ marginTop: 20 }} />,
    userStats: {},
    minMonth: moment().startOf('month'),
    maxMonth: moment().startOf('month'),
    curMonth: moment().startOf('month'),
    curDate: moment()
};

const CalendarStory = (props) => {
    const [calendarField, setCalendarField] = useState(localState.calendarField);
    const [userEntries, setUserEntries] = useState(localState.userEntries);
    const [userStats, setUserStats] = useState(localState.userStats);
    const [minMonth, setMinMonth] = useState(localState.minMonth);
    const [maxMonth, setMaxMonth] = useState(localState.maxMonth);
    const [curMonth, setCurMonth] = useState(localState.curMonth);
    const [curDate, setCurDate] = useState(localState.curDate);

    // функции, нужные для работы оболочки постов
    const [deletedEntryField, setDeletedEntryField] = useState(null);
    const [displayEntries, setDisplayEntries] = useState(
        (states.feed.renderedEntries) ? states.feed.getRenderedEntries() : < Spinner size='large' />);
    const [curPopout, setCurPopout] = useState(null);

    const { userInfo } = props.state;

    useEffect(() => {
        if (!userInfo.id)
            return;

        states.calendar.init(setDeletedEntryField, setCurPopout, setDisplayEntries, userInfo, null, null);

        const getUserEntries = async () => {
            let entriesPromise = await api("GET", "/entries/", {
                users: userInfo.id,
            });
            let entries = entriesPromise.data, temp = {};
            entries.map(
                (entry) => {
                    let date = moment.utc(entry.date);
                    let now = date.local().format("YYYY-MM-DD");

                    if (temp[now] == null) temp[now] = [entry];
                    else temp[now] = [...temp[now], entry];
                });

            setUserEntries(temp);
            localState.userEntries = temp;

            let stats = {}, l = moment().startOf('month'), r = moment().startOf('month');

            for (let day in temp) {
                let mood = 0, stress = 0, anxiety = 0;

                let date = moment(day);
                if (date < l) l = date;
                if (date > r) r = date;

                temp[day].map((entry) => {
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
                stats[day] = { mood: mood, stress: stress, anxiety: anxiety };
            }
            l.startOf('month');
            r.startOf('month');
            setMinMonth(l);
            localState.minMonth = l;
            setMaxMonth(r);
            localState.maxMonth = r;
            setUserStats(stats);
            localState.userStats = stats;
        }
        getUserEntries();
    }, [userInfo]);

    //изменился выбранный день
    useEffect(() => {
        if (!userInfo || !userEntries)
            return;

        if (userEntries[curDate.format("YYYY-MM-DD")]) {
            let temp = [];
            let objs = [];
            userEntries[curDate.format("YYYY-MM-DD")].map((entry) => {
                const obj = {
                    user: userInfo,
                    post: entry,
                    currentUser: userInfo,
                    states: states.calendar,
                };
                temp.push(
                    <TextPost key={entry.entryId}
                        postData={obj} />);
                objs.push(obj);
            });
            states.calendar.setRenderedEntries(objs);
            setDisplayEntries(temp);
        } else {
            states.calendar.setRenderedEntries(null);
            setDisplayEntries(null);
        }
    }, [userInfo, userEntries, curDate]);

    useEffect(() => {
        let temp = <Calendar
            minMonth={minMonth}
            maxMonth={maxMonth}
            curMonth={curMonth}
            curDate={curDate}
            onClickPrev={(date) => { setCurMonth(date); localState.curMonth = date; }}
            onClickNext={(date) => { setCurMonth(date); localState.curMonth = date; }}
            onClickTile={(date) => { setCurDate(date); localState.curDate = date; }}
            stats={userStats} />;
        setCalendarField(temp);
        localState.calendarField = temp;
    }, [userStats, curMonth, curDate])

    return (
        <View id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.viewHistory}
            onSwipeBack={props.nav.goBack}
            popout={curPopout}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{ paddingTop: "0px" }}>
                        {calendarField}
                    </Div>
                </Group>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>}>
                    <CardGrid style={{ 'padding': '15px' }}>
                        {displayEntries}
                    </CardGrid>
                </Group>
                {deletedEntryField}
            </Panel>
        </View>
    );
};

export default CalendarStory;
