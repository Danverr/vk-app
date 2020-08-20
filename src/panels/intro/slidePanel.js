import React from 'react';
import styles from './slidePanel.module.css';
import {
    Button,
    FixedLayout,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,
    Progress,
    Text,
    Title,
    Div
} from "@vkontakte/vkui";

const SlidePanel = (props) => {
    const {slideData, progress, nav, index} = props;

    return (
        <Panel
            id={props.id}
            className={styles.slidePanel}
            style={{backgroundImage: `url(${slideData.img})`}}
        >
            <PanelHeader
                className={styles.panelHeader}
                separator={false}
                left={index ? <PanelHeaderBack onClick={() => window.history.back()}/> : null}
            />

            <Placeholder stretched className={styles.textContainer} style={slideData.textStyles}>
                <Div>
                    <Title level="1" weight="bold">{slideData.title}</Title>
                    <Text weight="regular">{slideData.text}</Text>
                </Div>
            </Placeholder>

            <FixedLayout vertical="bottom">
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
            </FixedLayout>
        </Panel>
    );
};

export default SlidePanel;