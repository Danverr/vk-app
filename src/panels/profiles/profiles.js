import React, {useState, useEffect} from 'react';
import {CardGrid, Spinner, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfile from './chooseProfile/chooseProfile';
import UserProfile from "./userProfile/userProfile";
import StatsModal from "./userProfile/statsModal";
import ProfileCard from "./chooseProfile/profileCard";
import petPlaceholder from "../../img/robot.svg";

const Profiles = (props) => {
    const [activePanel, setPanel] = useState("chooseProfile");
    const [activeUserProfile, setUserProfile] = useState(null);
    const [activeModal, setModal] = useState(null);
    const [profiles, setProfiles] = useState(<Spinner size='large'/>);
    const [isLoading, setLoading] = useState(true);
    const modal = <StatsModal activeModal={activeModal} user={activeUserProfile} setModal={setModal}/>;

    // Преобразовываем данные в карточки
    useEffect(() => {
        if (!isLoading || !props.usersInfo) return;

        let profileCards = props.usersInfo.map((info, i) =>
            (<ProfileCard
                key={info.id}
                cardName={i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                userInfo={info}
                petSrc={petPlaceholder}
                setUserProfile={setUserProfile}
                setPanel={setPanel}
            />)
        );

        let cardGrids = [];
        for (let i = 0; i < profileCards.length; i += 2) {
            cardGrids.push(<CardGrid key={i}>{[
                profileCards[i],
                i + 1 < profileCards.length ? profileCards[i + 1] : null,
            ]}</CardGrid>);
        }

        setProfiles(cardGrids);
        setLoading(false);
    }, [isLoading, props.usersInfo]);

    return (
        <View id={props.id} activePanel={activePanel} modal={modal}>
            <ChooseProfile id="chooseProfile" profiles={profiles}/>
            <UserProfile id="userProfile" userInfo={activeUserProfile} setPanel={setPanel} setModal={setModal}/>
        </View>
    );
};

export default Profiles;

