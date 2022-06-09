import rollbar from "rollbar"

let environment = function(){
    if (window && window.AppInfo) {
        return (window.AppInfo.realEnv || window.AppInfo.railsEnv)
    } else {
        return "unknown"
    }
}()


let rollbarConfig = {
    accessToken: '56ab6148f61c41c1abf33eb26daec59c',
    enabled: (environment!="test" && environment!="development"),
    verbose: true,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: environment
    }
};

window.Rollbar = new rollbar(rollbarConfig);

window.rollbarInfo = function rollbarInfo() {
    // Example log event using the rollbar object.
    Rollbar.info('webpack test log');
};

window.throwError = function throwError() {
    // Example error, which will be reported to rollbar when `captureUncaught`
    // is true in the config.
    throw new Error('webpack test error');
};

window.rollbarInfoWithExtra = function rollbarInfoWithExtra() {
    // Example log event with custom data.
    Rollbar.info('webpack test log', { storePayload: true });
};

window.sendJson = function sendJson() {
    // Example sending fully prepared json payload to Rollbar API.
    Rollbar.sendJsonPayload(window.jsonPayload);
};
