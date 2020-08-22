import "core-js/features/map";
import "core-js/features/set";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as Sentry from "@sentry/react";
import {RewriteFrames} from "@sentry/integrations";
import {Integrations} from "@sentry/apm";

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: "https://c14de9f4ce724354bea8aa49804f92f2@o437613.ingest.sentry.io/5400421",
        integrations: [
            new Integrations.Tracing(),
            new RewriteFrames(),
        ],
        release: process.env.REACT_APP_VERSION,
        tracesSampleRate: 1.0,
    });
}

ReactDOM.render(<App/>, document.getElementById("root"));