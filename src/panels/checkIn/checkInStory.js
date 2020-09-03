import React, {useState, useEffect} from "react";
import {View, Gallery, Panel, PanelHeaderBack, PanelHeader, FixedLayout} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import styles from "./checkInStory.module.css";
import moment from "moment";

import getAnswer from "../../utils/getAnswer";
import questionPanelsData from "./questionPanelsData";

import QuestionPanel from "./questionPanel/questionPanel";
import SubmitPanel from "./submitPanel/submitPanel";

const getBullets = (questionPanels, index) => {
    let bullets = [];

    for (let i = 0; i < questionPanels.length + 1; i++) {
        let bulletStyles = styles.bullet;

        if (i === index) {
            bulletStyles += " " + styles.bulletSelected;
        }

        bullets.push(<div key={i} className={bulletStyles}/>);
    }

    return <div className={styles.bulletsContainer}>{bullets}</div>;
};

const localState = {
    answer: getAnswer(),
    activeSlideIndex: 0,
};

const CheckInStory = (props) => {
    const {updatingEntryData, setUpdatingEntryData} = props.state;
    const isEntryUpdate = updatingEntryData !== null;

    const [answer, setAnswer] = useState(
        isEntryUpdate ? getAnswer(updatingEntryData) : localState.answer
    );
    const [activeSlideIndex, setActiveSlideIndex] = useState(
        isEntryUpdate ? 0 : localState.activeSlideIndex
    );
    const {popout, setPopout, setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        if (isEntryUpdate) {
            setNavbarVis(false);
            return () => setNavbarVis(true);
        }
    }, [setNavbarVis, isEntryUpdate]);

    useEffect(() => {
        if (!isEntryUpdate) {
            let newAnswer = {...answer};
            newAnswer.date.val = moment();
            setAnswer(newAnswer);
        }
        // eslint-disable-next-line
    }, []);

    // Обновляем ответ в localState
    useEffect(() => {
        if (!isEntryUpdate) {
            localState.answer = answer;
            localState.activeSlideIndex = activeSlideIndex;
        }
    }, [answer, activeSlideIndex, isEntryUpdate]);

    // Если редактировали пост, сбросим его при уходе
    useEffect(() => {
        return () => {
            if (isEntryUpdate) setUpdatingEntryData(null);
        };
    }, [isEntryUpdate, setUpdatingEntryData]);

    const questionPanels = questionPanelsData.filter((panel) => {
        return !(isEntryUpdate && panel.param === "date");
    });

    return (
        <View id={props.id} activePanel={props.nav.activePanel} popout={popout}>
            <Panel id="main" className={styles.checkInPanel}>
                <PanelHeader
                    separator={false}
                    left={
                        isEntryUpdate ? (
                            <PanelHeaderBack onClick={() => window.history.back()}/>
                        ) : null
                    }
                >
                    Опрос
                </PanelHeader>

                <Gallery
                    className={styles.panelsGallery}
                    slideIndex={activeSlideIndex}
                    align="center"
                    onChange={(slideIndex) => setActiveSlideIndex(slideIndex)}
                >
                    {questionPanels.map((slideData, i) => {
                        return (
                            <QuestionPanel
                                key={i}
                                goToNext={() => setActiveSlideIndex(i + 1)}
                                answer={answer}
                                setAnswer={setAnswer}
                                setPopout={setPopout}
                                slideData={slideData}
                            />
                        );
                    })}

                    <SubmitPanel
                        nav={props.nav}
                        answer={answer}
                        setPopout={setPopout}
                        setAnswer={setAnswer}
                        isSlideActive={activeSlideIndex === questionPanels.length}
                        setActiveSlideIndex={setActiveSlideIndex}
                        setEntryAdded={props.state.setEntryAdded}
                        isEntryUpdate={isEntryUpdate}
                    />
                </Gallery>

                <FixedLayout vertical="bottom">
                    {getBullets(questionPanels, activeSlideIndex)}
                </FixedLayout>
            </Panel>
        </View>
    );
};

export default CheckInStory;
