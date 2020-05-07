import React, { useState } from 'react';
import { Panel, PanelHeader, View } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { ResponsiveCalendar } from '@nivo/calendar'

const Calendar = (props) => {
    const [activePanel, setPanel] = useState("main");

    return (
        <View id={props.id} activePanel={activePanel}>
            <Panel id="main">
                <PanelHeader separator={false}>Календарь</PanelHeader>
                <div style={{ height: 300 }} >
                    <ResponsiveCalendar
                        data={
                            [
                                {
                                    "day": "2018-04-03",
                                    "value": 135
                                },
                                {
                                    "day": "2016-01-07",
                                    "value": 321
                                },
                                {
                                    "day": "2018-06-22",
                                    "value": 95
                                },
                                {
                                    "day": "2015-12-11",
                                    "value": 129
                                },
                                {
                                    "day": "2016-01-06",
                                    "value": 356
                                },
                                {
                                    "day": "2018-07-02",
                                    "value": 21
                                },
                                {
                                    "day": "2017-02-26",
                                    "value": 197
                                }
                            ]}
                        from="2015-03-01"
                        to="2016-07-12"
                        emptyColor="#eeeeee"
                        colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                        margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                        yearSpacing={40}
                        monthBorderColor="#ffffff"
                        dayBorderWidth={2}
                        dayBorderColor="#ffffff"
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'row',
                                translateY: 36,
                                itemCount: 4,
                                itemWidth: 42,
                                itemHeight: 36,
                                itemsSpacing: 14,
                                itemDirection: 'right-to-left'
                            }
                        ]}
                    />
                </div>
            </Panel>
        </View>
    );
}

export default Calendar;

