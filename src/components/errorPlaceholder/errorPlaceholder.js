import React from "react";
import {Placeholder} from "@vkontakte/vkui";
import styles from "./errorPlaceholder.module.css";
import getErrorMessage from "../../utils/getErrorMessage";

import Icon56ErrorOutline from '@vkontakte/icons/dist/56/error_outline';

const ErrorPlaceholder = (props) => {
    const {error} = props;
    let header = "Упс, что-то пошло не так!";
    let action = props.action;
    let text = getErrorMessage(error);

    return (
        <Placeholder
            className={styles.errorPlaceholder}
            header={header}
            stretched={true}
            icon={<Icon56ErrorOutline fill="var(--destructive)"/>}
            action={action}
        >
            {text}
        </Placeholder>
    );
};

export default ErrorPlaceholder;