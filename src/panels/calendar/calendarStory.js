import React, {useState, useEffect} from 'react';
import {Panel, PanelHeader, View, Div, Header, Group, Spinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {getDate, getMonthHuman, getYear} from '@wojtekmaj/date-utils';
import api from "../../utils/api";

import TextPost from '../../components/TextPost/TextPost'
import Calendar from './Calendar/Calendar';

const getEntries = (entries) => {
    let temp = {};

    entries.map(
        (entry) => {
            let now = entry.date.split(' ')[0];

            if (temp[now] == null) temp[now] = [entry];
            else temp[now] = [...temp[now], entry];
        }
    );

    return temp;
};

const CalendarStory = (props) => {
    const [userEntries, setUserEntries] = useState(null);
    const [calendarField, setCalendarField] = useState(null);
    const [entriesField, setEntriesField] = useState(null);
    const [curDate, setCurDate] = useState(null);
    const [userEntriesMap, setUserEntriesMap] = useState({});
    const {userInfo} = props.state;

    useEffect(() => {
        if (!userInfo.id) return;

        api("GET", "/entries/", {
            users: userInfo.id,
        }).then((promise) => {
            setUserEntries(promise.data[userInfo.id]);
        });
    }, [userInfo]);

    useEffect(() => {
        if (!userInfo || !userEntries || !curDate) return;

        setEntriesField(<Spinner size="large" style={{marginTop: 20}}/>);

        let year = getYear(curDate);
        let month = ('0' + getMonthHuman(curDate).toString()).slice(-2);
        let day = ('0' + getDate(curDate)).slice(-2);

        if (userEntriesMap[year + "-" + month + "-" + day]) {
            let temp = [];
            userEntriesMap[year + "-" + month + "-" + day].map((entries) => {
                temp.push(<TextPost postData={{user: userInfo, post: entries}}/>);
            });
            setEntriesField(temp);
        } else {
            setEntriesField(null);
        }
    }, [userInfo, userEntriesMap, curDate]);

    useEffect(() => {
            setCalendarField(<Spinner size="large" style={{marginTop: 20}}/>);
            if (!userEntries) return;

            let result = getEntries(userEntries);
            setUserEntriesMap(result);
            let daysColorsMap = {};

            for (let day in result) {
                let mood = 0, stress = 0, anxiety = 0;

                result[day].map((entry) => {
                    mood += entry.mood;
                    stress += entry.stress;
                    anxiety += entry.anxiety;
                });

                mood /= result[day].length;
                stress /= result[day].length;
                anxiety /= result[day].length;
                mood = Math.floor(mood + 0.5);
                stress = Math.floor(stress + 0.5);
                anxiety = Math.floor(anxiety + 0.5);
                daysColorsMap[day] = {mood: mood, stress: stress, anxiety: anxiety};
            }

            setCalendarField(<Calendar onClickTile={(date) => {
                setCurDate(date)
            }} daysColors={daysColorsMap}/>);
        },
        [userEntries]
    );

    return (
        <View id={props.id}
              activePanel={props.nav.activePanel}
              history={props.nav.viewHistory}
              onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{paddingTop: "0px"}}>
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
