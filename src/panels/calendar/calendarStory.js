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
    curDate: null
};

const CalendarStory = (props) => {
    const [calendarField, setCalendarField] = useState(localState.calendarField);
    const [entriesField, setEntriesField] = useState(localState.entriesField);
    const [userEntries, setUserEntries] = useState(localState.userEntries);
    const [userStats, setUserStats] = useState(localState.userStats);
    const [curDate, setCurDate] = useState(moment(localState.curDate));
    const [popout, setPopout] = useState(null);
    const { userInfo } = props.state;

    useEffect(() => {
        if (!userInfo.id)
            return;

        const getUserEntries = async () => {
            let entriesPromise = await api("GET", "/entries/", {
                users: userInfo.id,
            });
            let entries = entriesPromise.data[userInfo.id], temp = {};
            entries.forEach(
                (entry) => {
                    let date = moment.utc(entry.date);
                    let now = date.local().format("YYYY-MM-DD");

                    if (temp[now] == null) temp[now] = [entry];
                    else temp[now] = [...temp[now], entry];
                });
            setUserEntries(temp);
            localState.userEntries = temp;

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
                stats[day] = { mood: mood, stress: stress, anxiety: anxiety };
            }
            
            setUserStats(stats);
            localState.userStats = stats;
        }
        getUserEntries();
    }, [userInfo]);

    //изменился выбранный день
    useEffect(() => {
        if (!userInfo || !curDate)
            return;

        if (userEntries[curDate.format("YYYY-MM-DD")]) {
            let temp = [];
            userEntries[curDate.format("YYYY-MM-DD")].forEach((entry) => {
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
        setPopout = {setPopout}
        onDateChange={(date) => { 
            setCurDate(moment(date)); 
            localState.curDate = moment(date); 
        }} 
        stats={userStats} />;
        setCalendarField(temp);
        localState.calendarField = temp;
    }, [userStats])
 
    return (
        <View id={props.id}
            popout = {popout}
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
