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

const CheckInStory = (props) => {
    const [loading, setLoading] = useState(null);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    useEffect(() => {
        props.nav.setNavbarVis(false);
        return () => {
            props.nav.setNavbarVis(true);
        };
    }, []);

    return (
        <View id={props.id}
              popout={loading}
              activePanel={props.nav.activePanel}
              history={props.nav.panelHistory[props.id]}
              onSwipeBack={props.nav.goBack}
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
                    {testSlideData.map((slideData, i) => {
                        return (<TestSlide
                            key={i}
                            goToNext={() => setActiveSlideIndex(i + 1)}
                            answer={props.answer}
                            setAnswer={props.setAnswer}
                            slideData={slideData}
                        />);
                    })}
                    <SubmitPanel
                        answer={props.answer}
                        setAnswer={props.setAnswer}
                        nav={props.nav}
                        setLoading={setLoading}
                    />
                </Gallery>

            </Panel>
        </View>
    );
};

export default CheckInStory;

