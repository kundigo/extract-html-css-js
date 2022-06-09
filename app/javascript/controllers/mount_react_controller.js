import { Controller } from "stimulus"
import React from 'react'
import ReactDOM from 'react-dom'
import UserActivityIcon from '../components/reusable/user_activity_icon'
import UserActivityStatusString from '../components/reusable/user_activity_status_string'



export default class extends Controller {
  static values = { componentName: String, props: Object}

  connect() {
    const components = {
      'UserActivityIcon': UserActivityIcon,
      'UserActivityStatusString': UserActivityStatusString
    }
    
    const component = components[this.componentNameValue]
    if (!component) {
      console.error(`Component ${this.componentNameValue} not found!`)
    } else {
      ReactDOM.render(
        React.createElement(component, this.propsValue),
        this.element
      )
    }
  }

}
