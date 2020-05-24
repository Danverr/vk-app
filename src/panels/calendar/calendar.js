import React, { useState, useEffect } from 'react';
import { Panel, PanelHeader, View, Div, Header, Group, Spinner } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar/src/Calendar';
import { getDate, getMonthHuman, getYear, getMonth } from '@wojtekmaj/date-utils';
import './Calendar.css';

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

    const getNavTitle = ({ date, label, locale, view }) => {
        let months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        if(view == 'month')
            return months[getMonth(date)];
        else if(view == 'year')
            return getYear(date);
        else if(view == 'decade')
            return 'Год';
        else
            return 'Десятилетие';
    }

    let calendarProps = { 
        onClickDay: (value, event) => setCurDate(value), 
        navigationLabel: ({ date, label, locale, view }) => getNavTitle({ date, label, locale, view }), 
        allPosts: allPosts, 
        dataIsReady: dataIsReady
    };

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
                        <Calendar {...calendarProps} />
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