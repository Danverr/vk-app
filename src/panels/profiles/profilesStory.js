import React, {useState, useEffect} from 'react';
import {CardGrid, Spinner, View} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import ChooseProfilePanel from './chooseProfile/chooseProfilePanel';
import UserProfilePanel from "./userProfile/userProfilePanel";
import StatsModal from "./userProfile/statsModal";
import ProfileCardPanel from "./chooseProfile/profileCardPanel";
import petPlaceholder from "../../img/robot.svg";

const ProfilesStory = (props) => {
    const [activeUserProfile, setUserProfile] = useState(null);
    const [activeModal, setModal] = useState(null);
    const [profiles, setProfiles] = useState(<Spinner size='large'/>);
    const [isLoading, setLoading] = useState(true);
    const modal = <StatsModal activeModal={props.nav.panel === "userProfile" ? activeModal : null}
                              user={activeUserProfile}
                              setModal={setModal}/>;

    // Преобразовываем данные в карточки
    useEffect(() => {
        if (!isLoading || !props.usersInfo) return;

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
        setLoading(false);
    }, [isLoading, props.usersInfo]);

    return (
        <View id={props.id}
              modal={modal}
              activePanel={props.nav.panel}
              history={props.nav.history}
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

