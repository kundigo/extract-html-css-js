// Action Cable provides the framework to deal with WebSockets in Rails.
// You can generate new channels where WebSocket features live using the `rails generate channel` command.
//
//= require action_cable
//= require_self
//= require_tree ./channels

// This meta tag only is included in app/views/layouts/shared/_head.html.erb if there is a current_user from devise.
if ($('meta[name=action-cable-url]').length){
    (function() {
      this.App || (this.App = {});

      App.cable = ActionCable.createConsumer($('meta[name=action-cable-url]').attr('content'));

    }).call(this);
}
