import React, {useState, useEffect} from 'react';
import styles from './slidePanel.module.css';
import {Button, Div, Panel, PanelHeader, PanelHeaderBack, Progress, Text, Title} from "@vkontakte/vkui";

const SlidePanel = (props) => {
    const {slideData, progress, nav, index} = props;
    const [image, setImage] = useState(slideData.placeholder);

    useEffect(() => {
        const imageLoader = new Image();
        imageLoader.src = slideData.img;
        imageLoader.onload = () => setImage(slideData.img);
    }, [slideData.img]);

    return (
        <Panel
            id={props.id}
            className={styles.slidePanel}
            style={{backgroundImage: `url(${image})`}}
        >
            <PanelHeader
                className={styles.panelHeader}
                separator={false}
                left={index ? <PanelHeaderBack onClick={() => window.history.back()}/> : null}
            />

            <Div className={styles.textContainer}>
                <Title level="1" weight="bold">{slideData.title}</Title>
                <Text weight="regular">{slideData.text}</Text>
            </Div>

            <Div>
                <Button
                    size="xl"
                    mode="overlay_primary"
                    onClick={slideData.action ? slideData.action : () => nav.goTo(props.id, index + 1)}
                >
                    {slideData.buttonText ? slideData.buttonText : "Далее"}
                </Button>
                <Progress className={styles.slideProgress} value={progress}/>
            </Div>
        </Panel>
    );
};

export default SlidePanel;