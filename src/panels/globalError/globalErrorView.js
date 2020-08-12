import React, {useEffect} from "react";
import {Panel, View, Button} from "@vkontakte/vkui";

import ErrorPlaceholder from "../../components/errorPlaceholder/errorPlaceholder";

const GlobalErrorView = (props) => {
    const {setNavbarVis} = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    return (
        <View id={props.id} activePanel={props.nav.activePanel}>
            <Panel id="main">
                <ErrorPlaceholder action = {<Button onClick = {() => window.location.reload()}> Перезагрузить приложение </Button>} error={props.error}/>
            </Panel>
        </View>
    );
};

export default GlobalErrorView;