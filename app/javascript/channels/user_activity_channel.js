import jQuery from "jquery"
import consumer from "./consumer"

let perform
let onMouseMoveTimeoutId

const subscription = {

    initialized() {
        perform = this.perform.bind(this)
    },
    connected() {
        console.log('UserActivityChannel connected')
        perform('report_browser_as_active')
        perform('report_browser_as_open')
    },

    disconnected() {
        //Called when the subscription has been terminated by the server.
    },

    received(data) {
        //Called when there's incoming data on the websocket for this channel.
    },

    report_browser_as_active() {
        perform('report_browser_as_active');
    },

    report_browser_as_open() {
        perform('report_browser_as_open');
    }

}


// This meta tag only is included in app/views/layouts/shared/_head.html.erb if there is a current_user from devise.
if (jQuery('meta[name=action-cable-url]').length){



    consumer.subscriptions.create({
        channel: "UserActivityChannel" }, subscription);

    //!App.userActivitySubscription.consumer.connection.disconnected means that the user is not disconnected (logged out).

    function reportBrowserAsActive(){

        if (!consumer.connection.disconnected) {
            subscription.report_browser_as_active();
        }

    };



    document.onclick = function() {
        return reportBrowserAsActive();
    };

    document.onkeypress = function() {
        return reportBrowserAsActive();
    };

    document.onmousemove = function() {
        // We wanted to prevent overloading the server,
        // so, instead of sending the signal to the server immediately
        // we hold it for a bit of time. Since the 'onmousemove'
        // fire so often the the mouse is moving.
        clearTimeout(onMouseMoveTimeoutId);
        onMouseMoveTimeoutId = setTimeout(() => {
            reportBrowserAsActive();
        }, 750)

    };


    setInterval(function () {
        if (!consumer.connection.disconnected) {
            subscription.report_browser_as_open();
        }
    }, 20000);

}


