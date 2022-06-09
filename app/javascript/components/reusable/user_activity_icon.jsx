import React from 'react'
import PropTypes from 'prop-types'

import green  from './user_presence_status/green_10px.png'
import orange from './user_presence_status/orange_10px.png'
import grey   from './user_presence_status/grey_10px.png'
import withSubscriptionToUserStatus from './hoc/with_subscription_to_user_status'
import withGracefulUnmount from 'react-graceful-unmount'

class UserActivityIcon extends React.Component {

    activityIcon = (status) => {
        if        (status === 'offline') {
            return grey
        } else if (status === 'idle')   {
            return orange
        } else if (status === 'online')   {
            return green
        } else if (status === null) {
            return null
        }
    }

    render() {
        const {userStatus} = this.props
        const activityIconStyles = {
            backgroundImage: `url(${this.activityIcon(userStatus)})`,
            display: 'inline-block'

        }
        return(
                <div className="user-activity-icon"
                    style={ userStatus ? activityIconStyles : {} }>
                </div>
            )
    }

}

UserActivityIcon.propTypes = {
    userId: PropTypes.string.isRequired,
    userStatus: PropTypes.string.isRequired
}

export default withGracefulUnmount(withSubscriptionToUserStatus(UserActivityIcon))