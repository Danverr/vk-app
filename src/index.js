import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import api from './utils/api'

console.time();

// Инициализация VK Mini App
bridge.send("VKWebAppInit", {});

ReactDOM.render(<App />, document.getElementById("root"));

if (process.env.NODE_ENV === "development") {
    import("./eruda").then(({ default: eruda }) => {
    }); //runtime download
    window.onerror = function (msg, url, line, columnNo, error) {
        api("POST", "/v1.1/logs/", {
            userAgent: window.navigator.userAgent,
            error: (`Message: ${error.message} \n Stack: ${error.stack}`)
        });
    }
}

