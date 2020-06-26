import React, {useState, useEffect} from 'react';
import {View, Gallery, Panel, PanelHeaderBack, PanelHeader} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import TestSlide from "./testPanel/testSlide";
import SubmitPanel from "./submitPanel/submitPanel";
import testSlideData from "./testPanel/testSlideData";
import style from "./checkInStory.module.css";

const getBullets = (index = testSlideData.length) => {
    let bullets = [];

    for (let i = 0; i < testSlideData.length + 1; i++) {
        let bulletStyles = style.bullet;

        if (i === index) {
            bulletStyles += " " + style.bulletSelected;
        }

        bullets.push(<div key={i} className={bulletStyles}/>);
    }

    return (<div className={style.bulletsContainer}>{bullets}</div>);
};

let localState = {
    mood: null,
    stress: null,
    anxiety: null,
    title: "",
    note: "",
    isPublic: 0
};

const CheckInStory = (props) => {
    const [answer, setAnswer] = useState(localState);
    const [loading, setLoading] = useState(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        localState = answer;
    }, [answer]);

    useEffect(() => {
        props.nav.setNavbarVis(false);
        return () => {
            props.nav.setNavbarVis(true);
        };
    }, []);

    return (
        <View id={props.id}
              activePanel={props.nav.activePanel}
              history={props.nav.viewHistory}
              onSwipeBack={props.nav.goBack}
              popout={loading}
        >
            <Panel id="main">
                <PanelHeader
                    separator={false}
                    left={<PanelHeaderBack onClick={() => {
                        if (activeSlideIndex == 0) window.history.back();
                        else setActiveSlideIndex(activeSlideIndex - 1);
                    }}/>}
                >
                    {getBullets(activeSlideIndex)}
                </PanelHeader>

                <Gallery
                    slideIndex={activeSlideIndex}
                    style={{height: "auto"}}
                    align="center"
                    onChange={slideIndex => setActiveSlideIndex(slideIndex)}
                >
                    {
                        testSlideData.map((slideData, i) => {
                            return (<TestSlide
                                key={i}
                                goToNext={() => setActiveSlideIndex(i + 1)}
                                answer={answer}
                                setAnswer={setAnswer}
                                slideData={slideData}
                            />);
                        })
                    }
                    <SubmitPanel
                        answer={answer}
                        setAnswer={setAnswer}
                        nav={props.nav}
                        setLoading={setLoading}
                    />
                </Gallery>

            </Panel>
        </View>
    );
};

export default CheckInStory;

