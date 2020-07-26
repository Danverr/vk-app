import React, {useState, useEffect} from 'react';
import {View, Gallery, Panel, PanelHeaderBack, PanelHeader} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import {platform, IOS} from '@vkontakte/vkui';
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

    return (<div className={styles.bulletsContainer}>{bullets}</div>);
};

const localState = {
    answer: getAnswer(),
};

const osname = platform();

const CheckInStory = (props) => {
    const {updatingEntryData, setUpdatingEntryData} = props.state;
    const isEntryUpdate = updatingEntryData !== null;

    const [answer, setAnswer] = useState(isEntryUpdate ? getAnswer(updatingEntryData) : localState.answer);
    const [popout, setPopout] = useState(null);
    const activeSlideIndex = props.nav.activePanel;
    const {setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    useEffect(() => {
        let newAnswer = {...answer};
        newAnswer.date.val = moment();
        setAnswer(newAnswer);
    }, []);

    // Обновляем ответ в localState
    useEffect(() => {
        if (!isEntryUpdate) localState.answer = answer;
    }, [answer, isEntryUpdate]);

    // Если редактировали пост, сбросим его при уходе
    useEffect(() => {
        return () => {
            if (isEntryUpdate) setUpdatingEntryData(null);
        }
    }, [isEntryUpdate, setUpdatingEntryData]);

    const goToSlideIndex = (index) => {
        for (let i = activeSlideIndex; i !== index;) {
            if (activeSlideIndex >= index) {
                props.nav.goBack();
                i--;
            } else {
                props.nav.goTo(props.id, i + 1);
                i++;
            }
        }
    };

    const questionPanels = questionPanelsData.filter((panel) => {
        return !(isEntryUpdate && panel.param === "date");
    });

    return (
        <View id={props.id}
              activePanel={"mainCheckInPanel"}
              popout={popout}
        >
            <Panel id="mainCheckInPanel">
                <PanelHeader
                    separator={false}
                    left={<PanelHeaderBack onClick={() => window.history.back()}/>}
                >
                    {getBullets(questionPanels, activeSlideIndex)}
                </PanelHeader>

                <Gallery
                    className={((osname === IOS) ? styles.iosGallery : styles.androidGallery)}
                    slideIndex={activeSlideIndex}
                    align="center"
                    onChange={slideIndex => goToSlideIndex(slideIndex)}
                >

                    {questionPanels.map((slideData, i) => {
                        return (
                            <QuestionPanel
                                key={i}
                                goToNext={() => goToSlideIndex(i + 1)}
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
                        setEntryAdded={props.state.setEntryAdded}
                        isEntryUpdate={isEntryUpdate}
                    />

                </Gallery>

            </Panel>
        </View>
    );
};

export default CheckInStory;

