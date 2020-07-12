import React from "react";
import {Placeholder} from "@vkontakte/vkui";

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const ErrorPlaceholder = ({error}) => {
    let errorText = "Ошибка";

    if (error.response) {
        errorText += " " + error.response.status;
    }

    return (
        <Placeholder
            header={errorText}
            stretched={true}
            icon={<Icon56ErrorOutline/>}
        >
            Упс, что-то пошло не так! Попробуйте еще раз
        </Placeholder>
    );
};

export default ErrorPlaceholder;