import { Controller } from "stimulus"
import { FormStore, DateOld, DatetimeOld } from 'k-form-js'
import tradingFormPlugin from '../forms/plugins/trading_form_plugin'
import MonthSelect from '../forms/components/month_select'
import ErrorMessage from '../forms/components/error_message'
import TextInputCount from '../forms/components/text_input_count'

export default class extends Controller {

  static values = {
    initialTouch: Boolean, // if true then all inputs are considered as touched (by default the value is false)
    disableValidation: Boolean, // if true then user inputs will not be revalidated on the fly
  }


  getHttpMethod(element) {
    let methodInput = element.querySelector("input[name='_method']");
    if (methodInput) {
      return methodInput.value
    } else {
      return null
    }

  }

  connect() {
    let { controller, values: serializedValues, validationUrl, ...others} = this.element.dataset
    let values = JSON.parse(serializedValues || {});

    let authenticityToken = this.element.querySelector("input[name='authenticity_token']")?.value
    let httpMethod = this.getHttpMethod(this.element) || 'POST'
    let globalauthenticityToken = document.querySelectorAll('meta[name=csrf-token]')[0].content

    const app = new FormStore(Object.assign( {
      authenticityToken: authenticityToken,
      additionalComponents: {
        'k-date': DateOld,
        'k-datetime': DatetimeOld,
        'k-month-select': MonthSelect,
        'k-error-message': ErrorMessage,
        'k-input-count': TextInputCount,
       },
      plugins:[tradingFormPlugin],
      element: this.element.firstElementChild,
      globalauthenticityToken: globalauthenticityToken,
      httpMethod: httpMethod,
      validationUrl: validationUrl,
      values: values,
      initialTouch: this.initialTouchValue,
      disableValidation: this.disableValidationValue,
    }, others)).app
  }
}