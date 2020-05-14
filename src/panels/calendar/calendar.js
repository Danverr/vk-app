import React from 'react';
import {Panel, PanelHeader, View, Div} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import TextPost from '../../components/TextPost/TextPost'
import Calendar from './react-calendar';
import './calendar.css';

import ava from '../../img/ava.jpg';

const user = {
    photo_200: ava,
    first_name: 'Albert',
    last_name: 'Skalt'
};

const CalendarPanel = (props) => {
    return (
        <View id={props.id}
              activePanel={props.nav.panel}
              history={props.nav.history}
              onSwipeBack={props.nav.goBack}
        >
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <Div style = {{paddingTop: "0px"}}> 
                <Calendar/>
                <TextPost user={user} text='Я скажу то, что для тебя не новость: мир не такой уж солнечный и приветливый. Это очень опасное, жесткое место, и если только дашь слабину, он опрокинет с такой силой тебя, что больше уже не встанешь. Ни ты, ни я, никто на свете, не бьёт так сильно, как жизнь! Совсем не важно, как ты ударишь, а важно, какой держишь удар, как двигаешься вперёд. Будешь идти — ИДИ! Если с испугу не свернёшь... Только так побеждают! Если знаешь, чего ты стоишь — иди и бери своё! Но будь готов удары держать, а не забрасывай кф на 2 месяца ' description='обычный день' />
                </ Div>
            </Panel>
        </View>
    );
};

export default CalendarPanel;