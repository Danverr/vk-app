import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar';
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
            let temp = new Array();

            const fetchUserPosts = async (user) => {
                const Promise = await api("GET", "/entries/", { userId: user.id, date: year + "-" + month + "-" + day });
                temp.push(Promise.data);
            }

            props.user.map(user => {
                fetchUserPosts(user);
            });

            setUsersPosts(temp);

            let temp1 = [];
            if (usersPosts != null && props.user.length == usersPosts.length) {
                props.user.map((user, i) => {
                    usersPosts[i].map(post => temp1.push((<TextPost
                        user={{ photo_200: user.photo_200, first_name: user.first_name, last_name: user.last_name }}
                        text={post.note}
                        description={post.title}
                        date={{ day: getDate(new Date(post.date)), month: getMonth(new Date(post.date)), hour: getHours(new Date(post.date)), minute: getMinutes(new Date(post.date)) }}
                    />)))
                })
            }          
            setPosts(temp1);
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
                <div>{posts}</div>
            </Panel>
        </View>
    );
};

export default CalendarPanel;