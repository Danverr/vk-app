import React, {useState, useEffect} from 'react';
import {View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
import StatsModal from "./userProfile/statsModal";

const ProfilesStory = (props) => {
    const [activeUserProfile, setActiveUserProfile] = useState(null);
    const [activeModal, setModal] = useState(null);
    const modal = <StatsModal activeModal={activeModal}
                              setModal={setModal}
                              usersInfo={props.usersInfo}
                              user={activeUserProfile}/>;

    return (
        <View id={props.id}
              modal={modal}
              activePanel={props.nav.activePanel}
              history={props.nav.panelHistory[props.id]}
              onSwipeBack={props.nav.goBack}>
            <ChooseProfilePanel id="chooseProfile"
                                setActiveUserProfile={setActiveUserProfile}
                                goTo={() => props.nav.goTo(props.id, "userProfile")}
                                usersInfo={props.usersInfo}/>
            <UserProfilePanel id="userProfile"
                              userInfo={activeUserProfile}
                              setModal={setModal}/>
        </View>
    );
};

export default ProfilesStory;

