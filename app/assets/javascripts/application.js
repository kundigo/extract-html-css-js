// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
// -------> from folder lib/assets
//= require security
// ------->  from gems
//= require jquery3
//= require jquery.datetimepicker.full
// -------> from folder app/assets
// ------- please add manually application JS files from app/assets/javascript
// ------- avoid `require_tree` for performance reasons
//= require admin/settings
//= require cable


// various stuff
$(document).on('ready turbolinks:load', function () {

    // auto-dismissible flash messages.
    $(".alert-dismissible").delay(5000).slideUp(500, function(){
        $(".alert-dismissible").alert('close');
    });

    $('#interest-modal').on('show.bs.modal', function (e) {
        // rest the content of the modal
        let html = $("#initial-interest-modal-content").html();
        $(this).find('.modal-content').html(html)

        // this is similar to app/views/interests/confirm_to_publish.js.erb, maybe we can dry
        // * using axios would be a plus (especially for tracking ajax requests in features texts (wait_for_ajax)
        // * using stimulus could also help to trigger the load
        // get content from remote
        $(this).find('.modal-content').load(e.relatedTarget.dataset.modalHref);
    });

    $('#interest-modal-large').on('show.bs.modal', function (e) {
        // rest the content of the modal
        let html = $("#initial-interest-modal-content").html();
        $(this).find('.modal-content').html(html)

        // this is similar to app/views/interests/confirm_to_publish.js.erb, maybe we can dry
        // * using axios would be a plus (especially for tracking ajax requests in features texts (wait_for_ajax)
        // * using stimulus could also help to trigger the load
        // get content from remote
        $(this).find('.modal-content').load(e.relatedTarget.dataset.modalHref);
    });
});