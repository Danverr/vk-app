import React from "react";
import {Banner, Button, getClassName, usePlatform} from "@vkontakte/vkui";
import s from "./donatBanner.module.css";
import bannerCover from "../../assets/bannerCover.png";

const DonatBanner = (props) => {
    const platform = usePlatform();

    return (
        <Banner
            mode="image"
            className={`${getClassName("Card", platform)} Card--sz-l Card--md-shadow ${s.banner}`}
            header="Не будь равнодушным!"
            subheader={<>От твоих пожертвований зависит<br/>дальнейшая судьба сервиса!</>}
            imageTheme={props.isLightScheme ? "light" : "dark"}
            background={
                <div
                    className={s.bannerBackground}
                    style={{backgroundImage: `url(${bannerCover})`}}
                />
            }
            actions={
                <Button
                    mode="overlay_primary"
                    href="https://vk.com/vkappmood_group?w=donut_payment-197288604">
                    Поддержать
                </Button>
            }
        />
    );
};

export default DonatBanner;