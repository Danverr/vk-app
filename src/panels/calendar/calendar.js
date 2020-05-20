import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar/src/Calendar';
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';
import './Calendar.css';

const CalendarPanel = (props) => {
    let [posts, setPosts] = useState(null);
    let [curDate, setCurDate] = useState(null);

    useEffect(() => {
        if (curDate === null || props.user === null) return;

        const fetchUsersPosts = async () => {
            let year = getYear(curDate);
            let month = (parseInt(getMonth(curDate)) + 1).toString();
            let day = getDate(curDate);

            let results = await api("GET", "/entries/", { userId: props.user[0].id, day: year + "-" + month + "-" + day });

            if (results != null) {
                setPosts(results.data.map((post, i) => <TextPost
                    key={i}
                    postData={{ user: props.user[0], post: post }}
                />));
            }
        }
        fetchUsersPosts();
    },
        [curDate]
    );

    return (
        <View id={props.id}
            activePanel={props.nav.panel}
            history={props.nav.history}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Div style={{ paddingTop: "0px" }}>
                    <Calendar onClickDay={(value, event) => setCurDate(value)} />
                </ Div>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>} separator="show">
                    {posts}
                </Group>
            </Panel>
        </View>
    );
};

export default CalendarPanel;