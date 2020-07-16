import React from "react";
import {Placeholder} from "@vkontakte/vkui";

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const ErrorPlaceholder = (props) => {
    const {error} = props;
    let header = "Упс, что-то пошло не так!";
    let text = error.message;
    let action = null;

    return (
        <Placeholder
            header={header}
            stretched={true}
            icon={<Icon56ErrorOutline/>}
            action={action}
        >
            {text}
        </Placeholder>
    );
};

export default ErrorPlaceholder;