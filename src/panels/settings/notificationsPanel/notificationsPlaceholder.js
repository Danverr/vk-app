import React from 'react';
import { Button, Placeholder } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Icon56NotificationOutline from '@vkontakte/icons/dist/56/notification_outline';

const NotificationsPlaceholder = (props) => {
    return (
        <Placeholder
            stretched
            header="Уведомления отключены"
            icon={<Icon56NotificationOutline />}
            action={<Button align="center"
            mode="primary"
            onClick={props.allowNotifications}> Дать разрешение </Button>}> 
            Для продолжения нужно дать разрешение на отправку уведомлений
        </Placeholder>
    );
}
export default NotificationsPlaceholder;