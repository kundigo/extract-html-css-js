import { Controller } from "stimulus"
import Sortable from 'sortablejs';
import { Api } from 'k-utils-js'


export default class extends Controller {

  connect() {
    const table = document.getElementById("table_content-sortable");

    let options = {
      animation: 150,
      handle: ".table_handle",
    }

    Sortable.create(table, options);
  }

  moved(event) {
    let itemHandle = document.getElementsByClassName("table_handle");
    let itemArray = Array.prototype.slice.call(itemHandle);
    let itemNewPosition = itemArray.indexOf(event.target) +1 ;

    // Todo check if we need all these declarations
    let itemId = event.target.dataset.id; // No longer needed ? Remove ?
    let itemPosition = event.target.dataset.position; // Not up to date
    let itemPath = event.target.dataset.path;
    let itemSid = event.target.dataset.sid;


    let onSuccess = response => {
      //console.log("Item order updated successfully")
    };

    let onError = (response) => {
      console.log('There was a problem with validating the data');
      console.log(response)
      //This exclusively to be able to see this in CI console reports (instead of '[object Object]'):
      console.log(JSON.stringify(response, null, 2))

    };

    let data = Object.assign({
      utf8: '✓',
    }, {[itemSid]: {'position': itemNewPosition}} )

    Api.sendRequest(
      {
        url: itemPath,
        data: data,
        method: 'PUT',
        onSuccess: onSuccess,
        onError: onError,
        delay: false
      }
    )
  }
}
