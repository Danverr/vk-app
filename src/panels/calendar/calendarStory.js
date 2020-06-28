import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import api from "../../utils/api";
import moment from 'moment';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './Calendar/Calendar';

let localState = {
    calendarField: <Spinner size="large" style={{ marginTop: 20 }} />,
    entriesField: null,
    userEntries: {},
    userStats: {},
    minMonth: moment().startOf('month'),
    maxMonth: moment().startOf('month'),
    curMonth: moment().startOf('month'),
    curDate: moment()
};

const CalendarStory = (props) => {
    const [calendarField, setCalendarField] = useState(localState.calendarField);
    const [entriesField, setEntriesField] = useState(localState.entriesField);
    const [userEntries, setUserEntries] = useState(localState.userEntries);
    const [userStats, setUserStats] = useState(localState.userStats);
    const [minMonth, setMinMonth] = useState(localState.minMonth);
    const [maxMonth, setMaxMonth] = useState(localState.maxMonth);
    const [curMonth, setCurMonth] = useState(localState.curMonth);
    const [curDate, setCurDate] = useState(localState.curDate);

    const { userInfo } = props.state;

    useEffect(() => {
        if (!userInfo.id)
            return;

        const getUserEntries = async () => {
            let entriesPromise = await api("GET", "/entries/", {
                users: userInfo.id,
            });
            let entries = entriesPromise.data[userInfo.id], temp = {};
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
                if(date < l) l = date;
                if(date > r) r = date;

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
        if (!userInfo)
            return;

        if (userEntries[curDate.format("YYYY-MM-DD")]) {
            let temp = [];
            userEntries[curDate.format("YYYY-MM-DD")].map((entry) => {
                temp.push(<TextPost key = {entry.entryId} postData={{ user: userInfo, post: entry }} />);
            });
            setEntriesField(temp);
            localState.entriesField = temp;
        } else {
            setEntriesField(null);
            localState.entriesField = null;
        }
    }, [userInfo, userEntries, curDate]);

    useEffect(() => {
        let temp = <Calendar 
        minMonth = {minMonth}
        maxMonth = {maxMonth}
        curMonth={curMonth}
        curDate={curDate} 
        onClickPrev = {(date) => {setCurMonth(date); localState.curMonth = date;}}
        onClickNext = {(date) => {setCurMonth(date); localState.curMonth = date;}}
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
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{ paddingTop: "0px" }}>
                        {calendarField}
                    </Div>
                </Group>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>}>
                    {entriesField}
                </Group>
            </Panel>
        </View>
    );
};

export default CalendarStory;
