import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './Calendar/Calendar';
import { getDate, getMonthHuman, getYear, getMonth } from '@wojtekmaj/date-utils';

const CalendarPanel = (props) => {
    var [posts, setPosts] = useState(null);
    var [allPosts, setAllPosts] = useState(new Object());
    var [curDate, setCurDate] = useState(null);
    var [dataIsReady, setDataIsReady] = useState(false);

    useEffect(() => {
        if (curDate === null || props.user === null)
            return;
        setPosts(<Spinner size="large" style={{ marginTop: 20 }} />);
        const fetchUsersPosts = async () => {
            let year = getYear(curDate);
            let month = ('0' + getMonthHuman(curDate).toString()).slice(-2);
            let day = ('0' + getDate(curDate)).slice(-2);
            
            if (allPosts[year + "-" + month + "-" + day] != null) 
                setPosts(<TextPost postData={{ user: props.user[0], post: allPosts[year + "-" + month + "-" + day] }} />);
            else
                setPosts(null);
        }
        fetchUsersPosts();
    },
        [allPosts, curDate, props.user]
    );

    useEffect(() => {
        if (props.user === null)
            return;
        setDataIsReady(false);
        const getPosts = (obj, posts) => {
            let temp = { ...obj }
            posts.data.map(post => { temp[post.date.split(' ')[0]] = post; });
            return temp;
        }
        const fetchUsersPosts = async () => {
            let results = await api("GET", "/entries/", { userId: props.user[0].id });
            if (results != null)
                setAllPosts(obj => getPosts(obj, results));
            setDataIsReady(true);
        }
        fetchUsersPosts();
    },
        [props.user]
    );

    return (
        <View id={props.id}
            activePanel={props.nav.panel}
            history={props.nav.history}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Group separator="show">
                    <Div style={{ paddingTop: "0px" }}>
                        <Calendar onClickTile = {(date) => {setCurDate(date)}} userPosts = {allPosts}/>
                    </ Div>
                </Group>
                <Group header={<Header mode="secondary"> Записи за этот день: </Header>}>
                    {posts}
                </Group>
            </Panel>
        </View>
    );
};

export default CalendarPanel;