import React, { useState } from 'react';
import { Panel, PanelHeader, View, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar';
import { getDate, getMonth, getYear } from '@wojtekmaj/date-utils';
import './calendar.css';

import ava from '../../img/ava.jpg';

const user = {
    photo_200: ava,
    first_name: 'Albert',
    last_name: 'Skalt'
};
let date = {
    day: "15",
    month: "05",
    hour: "23",
    minute: "12"
};

const CalendarPanel = (props) => {
    let [usersInfo, setUsersInfo] = useState(null);
    let [curDate, setCurDate] = useState(null);

    const fetchUsersInfo = async () => {
        let year = getYear(curDate);
        let month = (parseInt(getMonth(curDate)) + 1).toString();
        let day = getDate(curDate);
       
        const Promise = await api("GET", "/entries/", {userId: 281105343, date: year + "-" + month + "-" + day });
        setUsersInfo(Promise.data);
    }
    if(curDate != null)
        fetchUsersInfo();
 
    return (
        <View id={props.id}
            activePanel={props.nav.panel}
            history={props.nav.history}
            onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Div style={{ paddingTop: "0px" }}>
                    <Calendar onClickDay = {(value, event) => setCurDate(value)}/>
                </ Div>
                {(usersInfo != null) ? (usersInfo.map((n, i) => (<TextPost user={user} text={n.note} description={n.title} date = {{day: "15", month: "05",hour: "23",minute: "12"}} />))) : null}
            </Panel>
        </View>
    );
};

export default CalendarPanel;