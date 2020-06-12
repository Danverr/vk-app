import React, {useState, useEffect} from 'react';
import {View, Panel, Spinner} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";

const ProfilesStory = (props) => {
    useEffect(() => {
        props.state.fetchFriendsInfo();
    }, [props.userInfo]);

    return (
        <View
            id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >

            <ChooseProfilePanel
                id="chooseProfile"
                setActiveUserProfile={props.state.setActiveUserProfile}
                goToUserProfile={() => props.nav.goTo(props.id, "userProfile")}
                usersInfo={props.state.usersInfo}
            />

            <UserProfilePanel
                id="userProfile"
                now={props.state.now}
                timezone={props.state.timezone}
                userInfo={props.state.activeUserProfile}
            />

        </View>
    );
};

export default ProfilesStory;

