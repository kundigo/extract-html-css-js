import { Controller } from "stimulus"
let Mousetrap = require('mousetrap');

export default class extends Controller {

    static targets = ["source", "filterable", "category"];
    static classes = ["notFound"];
    static values = {
        caseSensitive: Boolean
    }

    connect() {
        // set default value for caseSensitive
        if (!this.hasCaseSensitiveValue) {
            this.caseSensitiveValue = false
        }

        // keyboard shortcuts to start filtering
        Mousetrap.bind(['command+k', 'ctrl+k','shift+f'], function() {
            let inputCollection = document.getElementsByClassName("sidebar__search")
            if (inputCollection.length > 0) {
                inputCollection[0].focus()
            }

            return false;
        });
    }

    filter(_event) {
        let searchTerm = this.normalisedString(this.sourceTarget.value)

        // HIDE ITEMS IF NEITHER THEY OR THEIR CATEGORY MATCH
        this.filterableTargets.forEach((el) => {
            let parentcategory = el.parentElement.getElementsByClassName("sidebar__header-name")[0].textContent;
            this.normalisedString(parentcategory).includes(searchTerm) ? el.classList.remove(this.notFoundClass)
              : this.normalisedString(el.textContent).includes(searchTerm) ? el.classList.remove(this.notFoundClass)
              : el.classList.add(this.notFoundClass);
        });

        this.categoryTargets.forEach((el) => {
            let itemcollection = el.getElementsByTagName("li");
            let hidecount = 0;

            // HIDE EMPTY CATEGORIES
            for (let i = 0; i < itemcollection.length; i++) {
                if (this.hasNotFoundClass === true) {
                    hidecount++;
                }
            }
            hidecount === itemcollection.length ? el.classList.add(this.notFoundClass) : el.classList.remove(this.notFoundClass);

            // DISPLAY EMPTY CATEGORIES IF THEY MATCH
            if (this.normalisedString(el.textContent).includes(searchTerm)) {
                el.classList.remove(this.notFoundClass);
            }

            // DISPLAY EMPTY CATEGORIES WHEN SEARCH IS CANCELED
            if (searchTerm == "") {
                el.classList.remove(this.notFoundClass);
            }
        });
    }

    normalisedString(value){
        return ( this.caseSensitiveValue ? value : value.toLowerCase() )
    }
}