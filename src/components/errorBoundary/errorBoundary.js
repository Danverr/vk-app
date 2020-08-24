import React from "react";
import * as Sentry from "@sentry/react";
import {Button} from "@vkontakte/vkui";

import ErrorPlaceholder from "../errorPlaceholder/errorPlaceholder";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: props.error ? props.error : null
        };
    }

    // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
    static getDerivedStateFromError(error) {
        Sentry.captureException(error);
        return {error: error};
    }

    render() {
        if (this.state.error) {
            return (
                <ErrorPlaceholder error={this.state.error} action={
                    <Button onClick={() => {
                        if (window.navigator.onLine) {
                            window.location.reload();
                        }
                    }}>
                        Перезагрузить приложение
                    </Button>
                }/>
            );
        } else {
            return this.props.children;
        }
    }
}

export default ErrorBoundary;