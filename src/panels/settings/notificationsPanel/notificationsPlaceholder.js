import React from 'react';
import { Button, Placeholder } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon56NotificationOutline from '@vkontakte/icons/dist/56/notification_outline';

let pressed = false;

const NotificationsPlaceholder = (props) => {

    const onClick = () => {
        if (pressed === true) return;
        pressed = true;
        setTimeout(() => { pressed = false }, 1000);
        props.allowNotifications();
    }

    return (
        <Placeholder
            stretched
            header="Уведомления отключены"
            icon={<Icon56NotificationOutline />}
            action={<Button align="center"
                mode="primary"
                onClick={onClick}> Дать разрешение </Button>}>
            Для продолжения нужно дать разрешение на отправку уведомлений.
        </Placeholder>
    );
}
export default NotificationsPlaceholder;