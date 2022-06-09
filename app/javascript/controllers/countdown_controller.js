const SHOW_NOTHING = "<span>&nbsp;</span>";
const SIX_HOURS_IN_SECS = 21600;

import {Controller} from "stimulus"

export default class extends Controller {

    initialize() {
        this.time = parseInt(this.element.getAttribute("data-remaining-time"));
        this.timeSincePageLoaded = 0;
        this.interval = setInterval(() => {
            this.timeSincePageLoaded = this.timeSincePageLoaded + 5;
            this.update()
        }, 5000);
        this.update()
    }

    update() {
        const {time, timeSincePageLoaded} = this;

        // we send nothing 'nil' in the server, so parsing result in NaN.
        if (isNaN(time)) {
            // in this case we don't need the interval anymore.
            this.set(SHOW_NOTHING);
            clearInterval(this.interval);
            return
        }

        const timeRemainingToCancel = time - timeSincePageLoaded;

        if ( timeRemainingToCancel < 59) {
            // in this case we don't need the interval anymore.
            // for some reason the interest is not yet cancelled,
            // we continue to show the zeros to show there is not time left until cancellation.
            this.set("<span>00:00</span>");
            clearInterval(this.interval);
            return
        }

        if ((timeRemainingToCancel) > SIX_HOURS_IN_SECS) {
            this.set(SHOW_NOTHING);
            return
        }
        if ((timeRemainingToCancel) < SIX_HOURS_IN_SECS){
            const  timeFormatted = this.timeRemainingFormatted(timeRemainingToCancel);
            this.set(`<span>${timeFormatted}</span>`);
        }
    }

    timeRemainingFormatted(seconds){
        return `${this.getHours(seconds)}:${this.getMinutes(seconds)}`
    }

    twoDigits(n) {
        return (n < 10 ? '0' : '') + n;
    }

    getHours(seconds) {
        let hours = Math.floor(seconds / 3600);
        return this.twoDigits(hours);
    }

    getMinutes(seconds) {
        let minutes = Math.floor((seconds % 3600) / 60);
        return this.twoDigits(minutes);
    }

    set(value) {
        this.element.innerHTML = value
    }

    disconnect() {
        clearInterval(this.interval)
    }
}