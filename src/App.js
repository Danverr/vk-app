import React from 'react';
import {Root} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Profile from './panels/profile/profile';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeView: "profile",
        }
    }

    render() {
        return (
            <Root activeView={this.state.activeView}>
                <Profile id="profile"/>
            </Root>
        );
    }
}

export default App;

