import React from 'react';
import {Card, CardGrid, Caption} from "@vkontakte/vkui";
import styles from "./paramSelector.module.css";
import emoji from "../../../../assets/emoji/emojiList";

const ParamSelector = (props) => {
    const params = ["mood", "stress", "anxiety"];
    const paramName = {
        mood: "Настроение",
        stress: "Стресс",
        anxiety: "Тревожность",
    };

    return (
        <CardGrid>
            {
                params.map((param) =>
                    <Card
                        size="s"
                        className={styles.paramButton}
                        mode={props.activeParam == param ? "tint" : "outline"}
                        onClick={() => props.setActiveParam(param)}
                    >
                        <img src={emoji[param][4]}/>
                        <Caption level="2" weight="semibold">
                            {paramName[param]}
                        </Caption>
                    </Card>
                )
            }
        </CardGrid>
    );
};

export default ParamSelector;