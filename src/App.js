import React, {useState} from 'react';
import {Epic, Tabbar, TabbarItem} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28SmileOutline from '@vkontakte/icons/dist/28/smile_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';
import Icon28CalendarOutline from '@vkontakte/icons/dist/28/calendar_outline';
import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';

import Profiles from './panels/profiles/profiles';
import Feed from "./panels/feed/feed";
import CheckIn from "./panels/checkIn/checkIn";
import Calendar from "./panels/calendar/calendar";
import Settings from "./panels/settings/settings";

const App = () => {
    let [activeStory, setStory] = useState("profiles");

    return (
        <Epic activeStory={activeStory} tabbar={
            <Tabbar>
                <TabbarItem
                    onClick={() => setStory("feed")}
                    selected={activeStory === "feed"}
                ><Icon28NewsfeedOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("profiles")}
                    selected={activeStory === "profiles"}
                ><Icon28SmileOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("checkIn")}
                    selected={activeStory === "checkIn"}
                ><Icon28AddCircleOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("calendar")}
                    selected={activeStory === "calendar"}
                ><Icon28CalendarOutline/></TabbarItem>
                <TabbarItem
                    onClick={() => setStory("settings")}
                    selected={activeStory === "settings"}
                ><Icon28SettingsOutline/></TabbarItem>
            </Tabbar>
        }>
            <Feed id="feed"/>
            <Profiles id="profiles"/>
            <CheckIn id="checkIn"/>
            <Calendar id="calendar"/>
            <Settings id="settings"/>
        </Epic>
    );
}

export default App;

