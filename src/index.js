import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import api from './utils/api';

ReactDOM.render(<App/>, document.getElementById("root"));

if (process.env.NODE_ENV === "development") {
    window.onerror = function (msg, url, line, columnNo, error) {
        api("POST", "/v1.1/logs/", {
            userAgent: window.navigator.userAgent,
            error: (`Message: ${error.message} \n Stack: ${error.stack}`)
        });
    }
}
