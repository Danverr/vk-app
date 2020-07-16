import React, {useEffect} from 'react';
import {View} from "@vkontakte/vkui";

import intro0 from "../../assets/introPhotos/intro0.jpg";
import intro0_placeholder from "../../assets/introPhotos/intro0.svg";
import intro1 from "../../assets/introPhotos/intro1.jpg";
import intro1_placeholder from "../../assets/introPhotos/intro1.svg";
import intro2 from "../../assets/introPhotos/intro2.jpg";
import intro2_placeholder from "../../assets/introPhotos/intro2.svg";

import SlidePanel from "./slidePanel";

const IntroView = (props) => {
    const {setNavbarVis} = props.nav;

    const slidesData = [
        {
            title: "Что такое mood?",
            text: "Это Mini App для трекинга настроения,  тревожности и стресса своих друзей",
            img: intro0,
            placeholder: intro0_placeholder
        },
        {
            title: "Как это работает?",
            text: "Проходите опросы, создавайте заметки и смотрите, как это делают ваши друзья!",
            img: intro1,
            placeholder: intro1_placeholder
        },
        {
            title: "Нужен доступ к друзьям",
            text: "Для того, чтобы вы могли поделится своим настроением с близкими, нам нужно знать," +
                "с кем вы дружите. Без доступа нельзя продолжить!",
            img: intro2,
            placeholder: intro2_placeholder,
            buttonText: "Дать доступ",
            action: () => {
                props.state.fetchUserToken(() => {
                    localStorage.setItem("showIntro", "false");
                    props.nav.clearStory(props.id, () => props.nav.goTo("settings"));
                });
            },
        }
    ];

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    // Заранее загружаем фотографии
    useEffect(() => {
        for (const slideData of slidesData) {
            new Image().src = slideData.img;
            new Image().src = slideData.placeholder;
        }
    }, [slidesData]);

    return (
        <View
            id={props.id}
            activePanel={props.nav.activePanel}
            history={props.nav.panelHistory[props.id]}
            onSwipeBack={props.nav.goBack}
        >
            {slidesData.map((slideData, index) => (
                <SlidePanel
                    id={index}
                    key={"introSlide_" + index}
                    index={index}
                    slideData={slideData}
                    nav={props.nav}
                    progress={(index + 1) * 100 / slidesData.length}
                />
            ))}
        </View>
    );
};

export default IntroView;