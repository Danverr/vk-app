import React from 'react';
import {Snackbar} from '@vkontakte/vkui';

import Icon24Delete from '@vkontakte/icons/dist/24/delete';

const DeleteSnackbar = (props) => {
    return (
        <Snackbar
            layout="horizontal"
            onClose={() => {
                props.onClose(null);
            }}
            duration={5000}
            before={<Icon24Delete fill="#E64646"/>}
        >
            Запись удалена
        </Snackbar>
    )
};

export default DeleteSnackbar;

