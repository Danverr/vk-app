import React, {useEffect} from "react";
import {View, Panel, PanelSpinner, FixedLayout} from "@vkontakte/vkui";
import styles from "./loadingScreen.module.css";

import logo from "../../assets/logo.png";
import logoDark from "../../assets/logoDark.png";

const LoadingScreen = (props) => {
    const {setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    return (
        <View id={props.id} activePanel="main">
            <Panel id="main">
                <img className={styles.backgroundImg} src={props.state.isLightScheme ? logo : logoDark} alt=""/>
                <FixedLayout vertical="bottom">
                    <PanelSpinner/>
                </FixedLayout>
            </Panel>
        </View>
    );
};

export default LoadingScreen;