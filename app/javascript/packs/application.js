/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start();
require("turbolinks").start()
//require("@rails/activestorage").start()
require("../channels")

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

import 'es6-shim'
import "core-js";
import "../controllers"
import '../src/application.scss';
import '../utils/rollbar';
import "../pagy.js.erb";
import 'selectize'
require.context('../stylesheets/default-theme/20-static/', true)
require.context('../static', true)
import "bootstrap";
import Tooltip from 'bootstrap/js/src/tooltip';
import Popover from 'bootstrap/js/src/popover';
import Slider from 'bootstrap-slider';

import * as Routes from '../routes.js.erb';
window.Routes = Routes;


['DOMContentLoaded', 'turbolinks:load'].forEach(function(eventName) {
  window.addEventListener(eventName, function() {
    // tooltip
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new Tooltip(tooltipTriggerEl)
    })

    // popover
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl, {
        delay: { "show": 200, "hide": 1000 },
        sanitize: false
      })
    })
  });
});


['turbolinks:load'].forEach(function(eventName) {
  window.addEventListener(eventName, function() {
    var element = document.getElementById("company_min_role");


    //If it isn't "undefined" and it isn't "null", then it exists.
    if(typeof(element) != 'undefined' && element != null){
      let mySlider = new Slider("#company_min_role", {
        ticks: [5, 10, 15],  // Do not change values because the backend relies on this values
        ticks_labels: ['No one', 'Managers', 'Managers & Traders'], //samme as above
        ticks_snap_bounds: 15,
        step: 5,
        ticks_tooltip: 'hide',   // hidden because I cannot find an easy way to style the tooltip
        value: parseInt(element.value),
        formatter: function(value) {
          // tooltip formatter
          switch(value) {
            case 5:
              return 'Traders can only update / delete their own interests';
            case 10:
              return 'Managers can update / delete other traders interests';
            case 15:
              return 'Traders can update / delete other traders interests';
          }
        },
        id: 'company_min_role_slider'  // used in css
      });
    }
  });
});


// impersonate
let impersonate = {
  label: function(item){
    return item.first_name + ' ' + item.last_name + ' (' + item.role + ')';
  },
  caption: function(item){
    return item.company_name;
  },
  renderItem: function(item){
    var label = impersonate.label(item);
    var caption = impersonate.caption(item);
    return '<div>' +
        '<span class="impersonate_name">' + Security.escapeText(label) + '</span>' +
        (caption ? '<span class="impersonate_company"> - ' + Security.escapeText(caption) + '</span>' : '') +
        '</div>';
  }
}
$(document).on('ready turbolinks:load', function () {
  $('#impersonate-input').selectize({
    persist: false,
    create: false,
    maxItems: 1,
    valueField: 'id',
    labelField: 'first_name',
    searchField: ['first_name', 'last_name', 'email', 'company_name'],
    options: [],
    allowEmptyOption: true,
    preload: true,
    openOnFocus: true,
    load: function(query, callback){
      $.getJSON("/admin/users/search/"+query, function( data ) {
        callback(data);
      });
    },
    render: {
      item: impersonate.renderItem,
      option: impersonate.renderItem
    },
    onChange: function(value) {
      $("#impersonate-form").attr("action", Routes.impersonate_admin_user_path(value))
      $("#impersonate-form").submit();
    }
  });
});

// pages CKEDITOR
$(document).on('ready turbolinks:load', function () {

  if ($('[name="page[content]"]').length > 0) {

    // make ckeditor work with turbolinks
    // -> manually remove any instance that has been created previously for page content
    var instance = CKEDITOR.instances['page_content'];
    if (instance) { instance.destroy(); }

    // create a new instance of ckeditor
    CKEDITOR.replace('page[content]');
  }
});





