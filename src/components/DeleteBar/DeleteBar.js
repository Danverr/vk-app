
import React from 'react';
import Icon24Delete from '@vkontakte/icons/dist/24/delete';

import { Snackbar, Text } from '@vkontakte/vkui';

const DeleteBar = (props) => {
    return (
        <Snackbar
            layout="horizontal"
            onClose={() => { props.onClose(null); }}
            duration={5000}
            before={<Icon24Delete fill="var(--accent)" />}
        >
                <Text> Запись удалена </Text>
        </Snackbar>
    )
};

export default DeleteBar;

