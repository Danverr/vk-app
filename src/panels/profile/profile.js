import React, {useState} from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfile from './chooseProfile/chooseProfile';
import UserProfile from "./userProfile/userProfile";
import StatsModal from "./userProfile/statsModal";

const Profile = (props) => {
    let [activePanel, setPanel] = useState("chooseProfile");
    let [activeModal, setModal] = useState(null);
    const modal = <StatsModal activeModal={activeModal} setModal={setModal}/>;

    return (
        <View id="profile" activePanel={activePanel} modal={modal}>
            <ChooseProfile id="chooseProfile" setPanel={setPanel}/>
            <UserProfile id="userProfile" setPanel={setPanel} setModal={setModal}/>
        </View>
    );
}

export default Profile;

