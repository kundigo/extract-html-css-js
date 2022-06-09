import { Controller } from "stimulus"

export default class extends Controller {

    static targets = ["toggle"];
    static values = {
        devbot: Boolean
    }

    connect() {
        this.devbotValue === true ? this.toggleTarget.checked = true
            : this.toggleTarget.checked = false;
    }

    changeParam(mode, status) {
        let queryParams = new URLSearchParams(window.location.search);

        queryParams.set("devbot_mode", mode);
        history.pushState(null, null, "?" + queryParams.toString());
        this.devbotValue = status;
        location.reload();
    }

    toggleDm(_event) {
        let dmParams = window.location.href;

        // If param already exist
        dmParams.indexOf("devbot_mode") > -1 ? this.toggleTarget.checked
         ? this.changeParam("1", true) // url.set("devbot_mode", "1")
         : this.changeParam("0", false)
        // If param does not exist
         : this.toggleTarget.checked
         ? window.location.search += "devbot_mode=1"
         : window.location.search += "devbot_mode=0";        
    }
}