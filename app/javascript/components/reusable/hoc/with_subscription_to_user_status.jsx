import React, {Component} from 'react'

export default function withSubscriptionToUserStatus(WrappedComponent) {
    return class extends Component {

        constructor(props){
            super(props);
            this.state = {
                userStatus: "offline", //default value until we get the real value from the server
                randomId: Math.random().toString().substring(2,10)
            }
        }

      UNSAFE_componentWillMount(){
            const  { userId }   = this.props;
            const  { randomId } = this.state;

            // Only subscribe to updates if the userId is not null. As a superadmin impersonates a user, sends the impersonated
            // userId as the current user to the server, in this situation the TradingInterestSerializer will sent null as the userId
            // of trading interests that the current user is not allowed to see.

            if (userId) {
                App[`user_${userId}_rand_${randomId}`] = App.cable.subscriptions.create({
                    channel: "ActivitySupervisionChannel",
                    id: userId}, {
                    received: (userUpdate) => {
                        this.setState({userStatus: userUpdate.status})
                    }
                })
            }
        }
        
        componentWillUnmount(){
            const  { userId }   = this.props;
            const  { randomId } = this.state;
            if (userId) {
                App[`user_${userId}_rand_${randomId}`].unsubscribe();
            }
        }

        render() {
            let { ...other}  = this.props;
            let {userStatus} = this.state;

            return <WrappedComponent {...other} userStatus={userStatus} />;
        }

    }
}
