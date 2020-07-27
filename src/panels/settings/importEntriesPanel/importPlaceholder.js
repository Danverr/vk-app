import React from 'react';
import {Placeholder, Button} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon56DownloadOutline from '@vkontakte/icons/dist/56/download_outline';

const ImportPlaceholder = (props) => {
    return (
        <Placeholder
            icon={<Icon56DownloadOutline/>}
            action={<Button href="https://m.vk.com/@vkapp_mood-import-zapisei" align="center" mode="tertiary">
                Подробнее об импорте записей
            </Button>}>
            Импортируйте записи из Daylio в виде .csv файла всего в один клик
        </Placeholder>
    );
};

export default ImportPlaceholder;