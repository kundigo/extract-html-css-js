import React, {Component} from 'react'
import PropTypes from 'prop-types'
import withSubscriptionToUserStatus from './hoc/with_subscription_to_user_status'
import withGracefulUnmount from 'react-graceful-unmount'

class UserActivityStatusString extends Component {

    render() {
        const {userStatus} = this.props
        const styles = {  display: 'inline-block'}
        return(
            <span className="user-activity-status-string" styles={styles}>
                {userStatus}
            </span>
        )
    }

}

UserActivityStatusString.propTypes = {
    userId: PropTypes.string.isRequired,
    userStatus: PropTypes.string.isRequired
}

export default withGracefulUnmount(withSubscriptionToUserStatus(UserActivityStatusString))