import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar/src/Calendar';
import { getDate, getMonth, getYear, getHours, getMinutes } from '@wojtekmaj/date-utils';
import './calendar.css';

const CalendarPanel = (props) => {
    let [posts, setPosts] = useState(null);
    let [usersPosts, setUsersPosts] = useState(null);
    let [curDate, setCurDate] = useState(null);

    useEffect(() => {
        if (curDate === null || props.user === null) return;

        const fetchUsersPosts = async () => {
            let year = getYear(curDate);
            let month = (parseInt(getMonth(curDate)) + 1).toString();
            let day = getDate(curDate);

            let results = await api("GET", "/entries/", { userId: props.user[0].id, date: year + "-" + month + "-" + day });
            setUsersPosts(results);
        }
        fetchUsersPosts();
    },
        [curDate]
    );

    useEffect(() => {
        let temp = [];
        if (usersPosts != null) {
                temp = usersPosts.data.map((post, i) => <TextPost
                key = {i}
                user={{ photo_200: props.user[0].photo_100, first_name: props.user[0].first_name, last_name: props.user[0].last_name }}
                text={post.note}
                description={post.title}
                date={{ day: getDate(new Date(post.date)), month: getMonth(new Date(post.date)), hour: getHours(new Date(post.date)), minute: getMinutes(new Date(post.date)) }}
            />)
        }
        setPosts(temp);
        //console.log(temp);
    },
        [usersPosts]
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
                <Header mode="secondary"> Записи за этот день: </Header>
                {posts}        
            </Panel>
        </View>
    );
};

export default CalendarPanel;