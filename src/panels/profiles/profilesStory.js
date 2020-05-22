import React, {useState, useEffect} from 'react';
import {CardGrid, Spinner, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
import StatsModal from "./userProfile/statsModal";
import ProfileCardPanel from "./chooseProfile/profileCardPanel";
import petPlaceholder from "../../assets/robot.svg";

const ProfilesStory = (props) => {
    const [activeUserProfile, setUserProfile] = useState(null);
    const [activeModal, setModal] = useState(null);
    const [profiles, setProfiles] = useState(<Spinner size='large'/>);
    const modal = <StatsModal activeModal={activeModal} setModal={setModal} user={activeUserProfile}/>;

    // Преобразовываем данные в карточки
    useEffect(() => {
        let profileCards = props.usersInfo.map((info, i) =>
            (<ProfileCardPanel
                key={info.id}
                cardName={i === 0 ? "Мой профиль" : `${info.first_name} ${info.last_name}`}
                userInfo={info}
                petSrc={petPlaceholder}
                setUserProfile={setUserProfile}
                goTo={() => props.nav.goTo(props.id, "userProfile")}
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
    }, []);

    return (
        <View id={props.id}
              modal={modal}
              activePanel={props.nav.activePanel}
              history={props.nav.panelHistory[props.id]}
              onSwipeBack={props.nav.goBack}>
            <ChooseProfilePanel id="chooseProfile"
                                view={props.id}
                                profiles={profiles}/>
            <UserProfilePanel id="userProfile"
                              userInfo={activeUserProfile}
                              setModal={setModal}/>
        </View>
    );
};

export default ProfilesStory;

