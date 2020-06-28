import React, {useState, useEffect} from 'react';
import {View, Gallery, Panel, PanelHeaderBack, PanelHeader} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import styles from "./checkInStory.module.css";

import questionPanelsData from "./questionPanelsData";
import QuestionPanel from "./questionPanel/questionPanel";
import SubmitPanel from "./submitPanel/submitPanel";

const getBullets = (index = questionPanelsData.length) => {
    let bullets = [];

    for (let i = 0; i < questionPanelsData.length + 1; i++) {
        let bulletStyles = styles.bullet;

        if (i === index) {
            bulletStyles += " " + styles.bulletSelected;
        }

        bullets.push(<div key={i} className={bulletStyles}/>);
    }

    return (<div className={styles.bulletsContainer}>{bullets}</div>);
};

const CheckInStory = (props) => {
    const {answer, setAnswer} = props.state;
    const [popout, setPopout] = useState(null);
    const activeSlideIndex = props.nav.activePanel;
    const {setNavbarVis} = props.nav;

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

    useEffect(() => {
        setNavbarVis(false);
        return () => {
            setNavbarVis(true);
        };
    }, [setNavbarVis]);

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
                    {getBullets(activeSlideIndex)}
                </PanelHeader>

                <Gallery
                    className={styles.panelsGallery}
                    slideIndex={activeSlideIndex}
                    align="center"
                    onChange={slideIndex => goToSlideIndex(slideIndex)}
                >

                    {questionPanelsData.map((slideData, i) => {
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
                    />

                </Gallery>

            </Panel>
        </View>
    );
};

export default CheckInStory;

