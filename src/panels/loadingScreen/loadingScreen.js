import React, {useEffect} from "react";
import {View, Panel, PanelSpinner} from "@vkontakte/vkui";

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
                <PanelSpinner/>
            </Panel>
        </View>
    );
};

export default LoadingScreen;