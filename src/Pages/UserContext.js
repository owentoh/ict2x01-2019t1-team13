import React from 'react'
const UserContext = React.createContext();



export class UserProvider extends React.Component {
    static contextType = UserProvider;

    state = {
        contextData: "tester2", //Default Value
        stepCount: "hello",
        journeyStarted: false,
        userDetails: {},
        totalDamage: 0
    };

    setTotalDamage = (damage) => {
        this.setState({totalDamage: damage})
    }

    setUserDetails = (user) => {
        this.setState({userDetails: user});
    }

    setContextData = (thing) => {
        this.setState({contextData: thing});
    }

    setJourneyStarted = (toggle) =>{
        this.setState({journeyStarted: toggle})
    }

    getValues = () => {
        return {
            contextData: this.state.contextData,
            stepCount: this.state.stepCount,
            journeyStarted: this.state.journeyStarted,
            userDetails: this.state.userDetails,
            totalDamage: this.state.totalDamage,

            setUserDetails : this.setUserDetails,
            setContextData : this.setContextData,
            setJourneyStarted : this.setJourneyStarted,
            setTotalDamage : this.setTotalDamage
        }
    }

    render() {
        return (
            <UserContext.Provider value={this.getValues()}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export function withUserContext(Component) {
    class ComponentWithContext extends React.Component {
        render() {
            return (
                <UserContext.Consumer>
                    {(value) => <Component {...this.props} userProvider={value} />}
                </UserContext.Consumer>
            );
        };
    }

    return ComponentWithContext;
}