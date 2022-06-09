// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
import { Api } from 'k-utils-js'
import { Controller } from "stimulus"
import MicroModal from 'micromodal';

export default class extends Controller {

  connect() {

  }

  show(event) {
    const target = this.data.get("target")
    const $target = $(`#${target}`)
    const href = this.element.getAttribute("href")
    const preloader = document.getElementById("preloader")
    let displayPreloader

    function preloading () {
      displayPreloader = setTimeout(function(){
        preloader.removeAttribute('hidden')
      }, 500);
    }

    // todo : test this
    // early exit: if the user wants to open in a new window, then let him do it
    if (event.metaKey || event.ctrlKey) return;
    // early exit: modal not found => let the click continue
    if ($target.length === 0) return

    event.preventDefault()
    preloading ()

    const onSuccess = function( response  ) {
      clearTimeout(displayPreloader);
      preloader.setAttribute('hidden', '');
      $target.find('.modal__container').html(response.data);
      MicroModal.show(target, {disableFocus: true});
    };

    const onError = function(data) {
      console.log(data);
    };


    Api.sendRequest({
      url: href,
      params: { variant: "modal" },
      method: 'GET',
      onSuccess: onSuccess,
      onError: onError,
      delay: false,
      headers: {"Accept": 'text/html'}
    });
  }
}