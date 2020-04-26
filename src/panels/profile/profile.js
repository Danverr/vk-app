import React from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfile from './chooseProfile/chooseProfile';
import UserProfile from "./userProfile/userProfile";

class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activePanel: "chooseProfile",
        }
    }

    route = (event) => {
        this.setState({
            activePanel: event.currentTarget.dataset.toPanel
        });
    }

    render() {
        return (
            <View id="profile" activePanel={this.state.activePanel}>
                <ChooseProfile id="chooseProfile" route={this.route}/>
                <UserProfile id="userProfile" route={this.route}/>
            </View>
        );
    }
}

export default Profile;

