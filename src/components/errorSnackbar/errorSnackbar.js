import React from 'react';
import {Snackbar} from '@vkontakte/vkui';
import Icon28ErrorOutline from '@vkontakte/icons/dist/28/error_outline';

const ErrorSnackbar = ({onClose}) => {
    return <Snackbar
        before={<Icon28ErrorOutline fill="#E64646" height={24} width={24}/>}
        onClose={onClose} >
            Произошла ошибка
    </Snackbar >
};

export default ErrorSnackbar;
