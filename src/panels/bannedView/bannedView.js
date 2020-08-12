import React, { useEffect } from "react";
import { Panel, View, Placeholder } from "@vkontakte/vkui";
import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const BannedView = (props) => {
    const { setNavbarVis } = props.nav;

    // Включаем и отключаем BottomNavBar (Epic)
    useEffect(() => {
        setNavbarVis(false);
        return () => setNavbarVis(true);
    }, [setNavbarVis]);

    return (
        <View id={props.id} activePanel={props.nav.activePanel}>
            <Panel id="main">
                <Placeholder
                    stretched
                    header="Аккаунт заблокирован"
                    icon={<Icon56ErrorOutline fill = "var(--destructive)"/>}>
                    {`Причина: ${props.state.banStatus.reason}`}
                </Placeholder>
            </Panel>
        </View>
    );
};

export default BannedView;