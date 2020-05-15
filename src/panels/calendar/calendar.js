import React, { useState } from 'react';
import { Panel, PanelHeader, View, Div } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import api from '../../utils/api';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar';
import './calendar.css';

import ava from '../../img/ava.jpg';

const user = {
    photo_200: ava,
    first_name: 'Albert',
    last_name: 'Skalt'
};
let date = {
    day: "15",
    month: "5",
    hour: "1",
    minute: "12"
};

const CalendarPanel = (props) => {
    let [usersInfo, setUsersInfo] = useState(null);
    let [PostInfo, setPostInfo] = useState(null);

    const sendPost = async () => {
        let data = {
            userId: 281105343,
            mood: 1,
            stress: 1,
            anxiety: 1,
            isPublic: 1,
            title: "MYFIRSTPOST",
            note: "Я скажу то, что для тебя не новость: мир не такой уж солнечный и приветливый. Это очень опасное, жесткое место, и если только дашь слабину, он опрокинет с такой силой тебя, что больше уже не встанешь. Ни ты, ни я, никто на свете, не бьёт так сильно, как жизнь! Совсем не важно, как ты ударишь, а важно, какой держишь удар, как двигаешься вперёд. Будешь идти — ИДИ! Если с испугу не свернёшь... Только так побеждают! Если знаешь, чего ты стоишь — иди и бери своё! Но будь готов удары держать, а не забрасывай кф на 2 месяца"
        };
        const Promise = await api("POST", "/entries/", data);
        setPostInfo(Promise.data);
    }
    const fetchUsersInfo = async () => {
        let data = {
            userId: 281105343,
            date: "2020-05-15"
        };
        const Promise = await api("GET", "/entries/", data);
        setUsersInfo(Promise.data);
    }
    //sendPost();
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
                    <Calendar />
                </ Div>

                {(usersInfo != null) ? (usersInfo.map((n, i) => (<TextPost user={user} text={n.note} description={n.title} date = {date} />))) : (<div />)}
            </Panel>
        </View>
    );
};

export default CalendarPanel;