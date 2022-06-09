// This meta tag only is included in app/views/layouts/shared/_head.html.erb if there is a current_user from devise.
if ($('meta[name=action-cable-url]').length){

    App.RefreshChannelSubscription = App.cable.subscriptions.create( "RefreshChannel"  , {

        connected: function() {},    //Called when subscription has been established.
        disconnected: function() {}, //Called when the subscription has been terminated by the server.

        received: function(data) {
            //Called when there's incoming data on the websocket for this channel.

            var path_should_be_reloaded = function(path, match_type) {
                if (match_type === 'broad') {
                    return location.pathname.startsWith(path)
                } else {
                    return path === location.pathname
                }
            };

            if (path_should_be_reloaded(data.path, data.match_type)) {
                location.reload();
            }
        }

    });

}
