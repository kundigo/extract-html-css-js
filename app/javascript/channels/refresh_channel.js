import jQuery from "jquery"
import consumer from "./consumer"

// This meta tag only is included in app/views/layouts/shared/_head.html.erb if there is a current_user from devise.
if (jQuery('meta[name=action-cable-url]').length){

    consumer.subscriptions.create( "RefreshChannel"  , {

        // Called once when the subscription is created.
        initialized() {
            //console.log("RefreshChannel initialized")
        },

        // Called when the subscription is ready for use on the server.
        connected() {
            //console.log("RefreshChannel connected")
        },

        // Called when the WebSocket connection is closed.
        disconnected() {
            //console.log("RefreshChannel disconnected")
        },

        // Called when the subscription is rejected by the server.
        rejected() {
           // console.log("RefreshChannel rejected")
        },

        received: function(data) {
            //Called when there's incoming data on the websocket for this channel.

            var path_should_be_reloaded = function(path, match_type) {
                if (match_type === 'broad') {
                    return location.pathname.startsWith(path)
                } else {
                    return path === location.pathname
                }
            };

            var message_is_already_displayed = function(message){
                return $('.refresh-message').text().includes(message)
            };

            var prepend_message = function(message) {
                $('#flash-messages').prepend(
                    [
                        '<div class="refresh-message text-center alert alert-warning alert-dismissible" role="alert">',
                        '<button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">',
                        '<span aria-hidden="true">&times;</span>',
                        '</button>',
                        message,
                        '</div>'
                    ].join('')
                );
            };

            if (path_should_be_reloaded(data.path, data.match_type)) {
                if (data.force === true) {
                    location.reload();
                } else {

                    if ( !message_is_already_displayed(data.message) &&
                        window.AppInfo.currentGitCommit !== data.git_commit ) {
                        prepend_message(data.message)
                    }
                }
            }
        }

    });

}
