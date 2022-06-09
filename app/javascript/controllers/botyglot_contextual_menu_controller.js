// Visit The Stimulus Handbook for more details
// https://stimulusjs.org/handbook/introduction

// This controller builds the contextual menu in the generated apps
// * the items in the menu are dynamically fetched from the botyglot instance
import { Api } from 'k-utils-js'
import { Controller } from "stimulus"

export default class extends Controller {

  static values = {
    loaded:  { type: Boolean, default: false },  // if true this means that we
                                                 // already fetched the menu items from the
                                                 // botyglot instance
    items: Array,     // [botyglot instance] the menu items (fetched from the botyglot instance)
    domain: String,   // [botyglot instance] domain for the current app
    port: String,     // [botyglot instance] port for the current app
    protocol: String, // [botyglot instance] protocol for the current app
    type: String,     // [botyglot instance] object type
    id: String,       // [botyglot instance] object id
  }

  static targets = ['items'] // the HTML target that needs to be populated with the menu items

  connect() {
  }

  // this method expects window.MicroModal to be defined
  show(event) {

    // executed when the menu items have been successfully fetched from the botyglot instance
    let onSuccess = (response) => {
      this.itemsValue = response.data.items
      this.loadedValue = true
      this.populateItemsTarget()
    };

    // executed when the menu items have NOT been successfully fetched from the botyglot instance
    let onError = (response) => {
      console.log('There was a getting the menu items');
      console.log(response)
      //This exclusively to be able to see this in CI console reports (instead of '[object Object]'):
      //console.log(JSON.stringify(response, null, 2))
    }

    if (!this.loadedValue) {
      // this is the first time the show method is called
      // => we need to fetch the menu items and populate the items HTML target
      Api.sendRequest({
        url: this.endpoint(),
        method: 'get',
        onSuccess: onSuccess,
        onError: onError,
        delay: false
      });
    }
  }

  // the endpoints from where the menu items can be fetched
  endpoint() {
    return this.protocolValue + '://' + this.domainValue + ':' + this.portValue + '/contextual/menu/' + this.typeValue + '/' + this.idValue
  }

  // populate the items HTML target
  populateItemsTarget() {
    let itemsHTML = ''

    for (const item of this.itemsValue) {
      itemsHTML += this.itemHtmlTemplate(item)
    }
    this.itemsTarget.innerHTML = itemsHTML
  }

  // *** private methots ****
  itemHtmlTemplate(item) {
    if (item.type === 'divider') {
      return `<li><hr class="dropdown-divider"></li>`
    }

    if (item.type === 'header') {
      return `<li><h6 class="dropdown-header"> ${item.text} </h6></li>`
    }

    return `<li class="dropdown-item"><a ${this.dataAttributesTemplate(item.data)} href="${item.url}"> ${item.text} </a></li>`
  }


  dataAttributesTemplate(data) {
    let result = ''

    if (data) {
      for (const [key, value] of Object.entries(data)) {
        let normalized_key = key.replaceAll('_', '-')
        result += `data-${normalized_key}="${value}" ` // leave one extra space at the end
      }
    }

    return result
  }
}
