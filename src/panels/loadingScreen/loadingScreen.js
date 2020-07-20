import React, {useEffect} from "react";
import {View, Panel} from "@vkontakte/vkui";
import styles from "./loadingScreen.module.css";

import logo from "../../assets/logo.png";

const LoadingScreen = (props) => {
    const {setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    return (
        <View id={props.id} activePanel="main">
            <Panel id="main" className={styles.loadingPanel}>
                <img className={styles.backgroundImg} src={logo} alt=""/>
            </Panel>
        </View>
    );
};

export default LoadingScreen;