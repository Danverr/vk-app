import React, {useEffect} from 'react';
import {View} from "@vkontakte/vkui";

import intro0 from "../../assets/introPhotos/intro0.jpg";
import intro1 from "../../assets/introPhotos/intro1.jpg";
import intro2 from "../../assets/introPhotos/intro2.jpg";
import intro3 from "../../assets/introPhotos/intro3.jpg";

import SlidePanel from "./slidePanel";

const IntroView = (props) => {
    const {setNavbarVis} = props.nav;

    const slidesData = [
        {
            title: "Что такое mood?",
            text: "Это трекер настроения,  тревожности и стресса для тебя и твоих близких людей. Личный дневник и статистика настроения друзей теперь в одном приложении ВК.",
            img: intro0,
        },
        {
            title: "Наша цель",
            text: "У всех бывают трудные дни, но не всегда с ними легко справится в одиночку. mood поможет вам проявить поддержку, когда это крайне необходимо, без лиших слов.",
            img: intro1,
        },
        {
            title: "Как это работает?",
            text: "Проходите опросы, создавайте заметки и смотрите, как это делают ваши друзья! С помощью красочной статистики следить за прогрессом стало удобно, как никогда.",
            img: intro2,
        },
        {
            title: "Нужен доступ к друзьям",
            text: "Для того, чтобы вы могли поделится своим настроением с близкими, нам нужно знать, с кем вы дружите. Без доступа нельзя продолжить",
            img: intro3,
            textStyles: {color: "black"},
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