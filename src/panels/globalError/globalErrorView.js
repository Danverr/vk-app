import React, {useEffect} from "react";
import {Panel, View} from "@vkontakte/vkui";

import ErrorPlaceholder from "../../components/errorPlaceholder/errorPlaceholder";

const GlobalErrorView = (props) => {
    const {setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    return (
        <View id={props.id} activePanel="main">
            <Panel id="main">
                <ErrorPlaceholder error={props.error}/>
            </Panel>
        </View>
    );
};

export default GlobalErrorView;