
//settings form
$(document).on('ready turbolinks:load', function () {
    $('.hour-field-with-datetimepicker').datetimepicker({
        datepicker:false,
        format:'H:i',
        step:30
    });
});
