import React from 'react';
import { File, FormLayout } from '@vkontakte/vkui';
import s from './importEntriesPanel.module.css'
import '@vkontakte/vkui/dist/vkui.css';

import { platform, IOS } from '@vkontakte/vkui';

const osname = platform();

const Moodpath = (props) => {
    return (
        <div className={((osname === IOS) ? s.iosContainer : s.androidContainer)}>

        </div>
    );
}
export default Moodpath;