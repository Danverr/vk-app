import React from 'react';
import {Snackbar} from '@vkontakte/vkui';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';

const DoneSnackbar = ({ onClose, text = null }) => {
    return <Snackbar
        layout="horizontal"
        onClose={onClose}
        duration={5000}
        before={<Icon16CheckCircle fill="var(--accent)" height={24} width={24}/>}
    >
        {text ? text : "Изменения сохранены"}
    </Snackbar>;
};

export default DoneSnackbar;