// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction
import { Api } from 'k-utils-js'
import { Controller } from "stimulus"

export default class extends Controller {

  static values = { target: String, contextualHref: String }

  connect() {
  }

  // this method expects window.MicroModal to be defined
  show(event) {

    // todo : test this
    // early exit: if the user wants to open in a new window, then let him do it
    if (event.metaKey || event.ctrlKey) return;

    // open in contectual panel
    event.preventDefault()

    let href;

    if (this.hasContextualHrefValue) {
      href = this.contextualHrefValue
    } else {
      href = this.element.getAttribute("href")
    }

    let viewportwidth = document.documentElement.clientWidth;
    let height = window.outerHeight

    window.open(href,
      "" + this.targetValue + "_panel",
      "location=yes,toolbar=yes,width=600,height=" + height + ",left=" + (viewportwidth - 600) + ",top=0");
  }
}