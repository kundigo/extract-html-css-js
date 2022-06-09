// Visit The Stimulus Handbook for more details 
// https://stimulusjs.org/handbook/introduction
////
// This example controller works with specially annotated HTML like:
//
// <div data-controller="hello">
//   <h1 data-target="hello.output"></h1>
// </div>

import { Controller } from "stimulus"

export default class extends Controller {
  connect() {
    //console.log(this.element.dataset);
    //console.log(this.element.dataset.toggleClasses);
  }

  toggle() {
    // Assumptions
    // * the element provides a list of 2 classes to toggle via data-toggle-classes attribute
    // * that one of the classes is already present in the html

    // TODO: store expanded state between refresh
    const toggleClasses = JSON.parse(this.element.dataset.toggleClasses);

    toggleClasses.forEach(function(toggleClass){
      this.element.classList.toggle(toggleClass)
    }, this);
  }
}
