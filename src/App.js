import React, {useState} from 'react';
import {Root} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Profile from './panels/profile/profile';

const App = () => {
    let [activeView, setView] = useState("profile");

    return (
        <Root activeView={activeView}>
            <Profile id="profile"/>
        </Root>
    );
}

export default App;

