import {Controller} from "stimulus"
import refreshTradingScreen from "../channels/utils/refresh_trading_screen";

const classMap = {
    canceled: 'recently-canceled',
    published: 'recently-published',
    booked: 'recently-booked'
};
export default class StatusChange extends Controller {

    static requestTimeout = {};

    // We wanted to prevent overloading the server:
    // because many interest can be cancelled at the same time,
    // we don't send the request to refresh the screen immediately,
    // instead we set a timeout and only after it expires we send the request,
    // every new attempt to send a request before the timeout expires
    // clears the timeout of the precedent attempt. So for example, if  3 attempts happen
    // too close to each other only the last attempt will be able to send the request.
    static sendRequest(commodity){

        clearTimeout(this.requestTimeout[commodity]);
        this.requestTimeout[commodity] = setTimeout(() => {
            refreshTradingScreen({
                commodity,
                errorMessage: `Error on StatusChange stimulus controller, commodity: ${commodity}: while requesting refresh`,
            })
        }, 500)

    }

    initialize() {
        const dataSeconds = this.element.getAttribute("data-seconds")
        this.remainingSeconds = parseInt(dataSeconds);
        this.status = this.element.getAttribute("data-recent-status");
        this.commodity = this.element.getAttribute("data-commodity");

        if (!isNaN(this.remainingSeconds)) {

            this.element.classList.add(classMap[this.status]);
            this.interval = setTimeout(() => {

                if (['booked', 'canceled'].includes(this.status)) {
                    StatusChange.sendRequest(this.commodity);
                } else {
                    this.element.classList.remove(classMap[this.status])
                }

            }, this.remainingSeconds * 1000);

        }
    }


    disconnect(){
        if (!isNaN(this.remainingSeconds)) {
            clearTimeout(this.interval);
        }
    }
}