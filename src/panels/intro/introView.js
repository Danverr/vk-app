import React, {useEffect} from "react";
import {View} from "@vkontakte/vkui";

import intro0 from "../../assets/introPhotos/intro0.jpg";
import intro1 from "../../assets/introPhotos/intro1.jpg";
import intro2 from "../../assets/introPhotos/intro2.jpg";

import SlidePanel from "./slidePanel";

const IntroView = (props) => {
    const {setNavbarVis} = props.nav;

    const slidesData = [
        {
            title: "Что такое mood?",
            text: "Это трекер настроения, тревожности и стресса, в котором можно делиться своими записями и статистикой с близкими друзьями.",
            img: intro0,
        },
        {
            title: "Наша цель",
            text: "У всех бывают трудные дни, но не всегда с ними легко справиться в одиночку. Mood без лишних слов даст Вам знать, когда близкому человеку потребуется поддержка.",
            img: intro1,
        },
        {
            title: "Как это работает?",
            text: (
                <>
                    Откройте доступ к своей статистике, проходите опросы, создавайте заметки и
                    смотрите, как это делают ваши друзья! Продолжая, вы принимаете{" "}
                    <a href="https://m.vk.com/@vkapp_mood-polzovatelskoe-soglashenie">
                        пользовательское соглашение
                    </a>
                    .
                </>
            ),
            buttonText: "Приступим!",
            img: intro2,
            action: () => {
                props.state.vkStorage.setValue("showIntro", false);
                window["yaCounter65896372"].reachGoal("introCompleted");
                props.nav.clearStory(props.id);
            },
        },
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
            onSwipeBack={() => props.nav.goBack(true)}
        >
            {slidesData.map((slideData, index) => (
                <SlidePanel
                    id={index}
                    key={"introSlide_" + index}
                    index={index}
                    slideData={slideData}
                    nav={props.nav}
                    progress={((index + 1) * 100) / slidesData.length}
                />
            ))}
        </View>
    );
};

export default IntroView;
