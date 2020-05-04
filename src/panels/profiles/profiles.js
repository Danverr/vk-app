import React, {useState, useEffect} from 'react';
import bridge from "@vkontakte/vk-bridge";
import axios from "../../utils/api";
import {CardGrid, Spinner, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfile from './chooseProfile/chooseProfile';
import UserProfile from "./userProfile/userProfile";
import StatsModal from "./userProfile/statsModal";
import ProfileCard from "./chooseProfile/profileCard";
import petPlaceholder from "../../img/robot.png";

const Profiles = (props) => {
    const [activePanel, setPanel] = useState("chooseProfile");
    const [activeUserProfile, setUserProfile] = useState(null);
    const [activeModal, setModal] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [profiles, setProfiles] = useState(<Spinner size='large'/>);
    const [isLoading, setLoading] = useState(true);
    const modal = <StatsModal activeModal={activeModal} setModal={setModal}/>;

    async function fetchUserInfo() {
        const userInfo = await bridge.send('VKWebAppGetUserInfo');
        setUserInfo(userInfo);
    }

    if (userInfo == null) fetchUserInfo();

    useEffect(() => {
        if (isLoading === true && userInfo && userInfo.id) {
            axios
                .get(`/statAccess/${userInfo.id}`)
                .then(res => {
                    res.data.unshift(userInfo);

                    let profileCards = res.data.map(friendInfo =>
                        (<ProfileCard
                            cardName={userInfo.id === friendInfo.id ? "Мой профиль" : `${friendInfo.first_name} ${friendInfo.last_name}`}
                            userInfo={friendInfo}
                            petSrc={petPlaceholder}
                            setUserProfile={setUserProfile}
                            setPanel={setPanel}
                        />)
                    );

                    let cardGrids = [];
                    for (let i = 0; i < profileCards.length; i += 2) {
                        cardGrids.push(<CardGrid>{[
                            profileCards[i],
                            i + 1 < profileCards.length ? profileCards[i + 1] : null,
                        ]}</CardGrid>);
                    }

                    setProfiles(cardGrids);
                    setLoading(false);
                });
        }
    });

    return (
        <View id={props.id} activePanel={activePanel} modal={modal}>
            <ChooseProfile id="chooseProfile" profiles={profiles}/>
            <UserProfile id="userProfile" userInfo={activeUserProfile} setPanel={setPanel} setModal={setModal}/>
        </View>
    );
}

export default Profiles;

