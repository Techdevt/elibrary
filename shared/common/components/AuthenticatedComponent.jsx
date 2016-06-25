import React from 'react';
import {connect} from 'react-redux';

export default function requireAuthentication(Component, predicate) {
    class AuthenticatedComponent extends React.Component {
        static __redial_handlers__ = Component.__redial_handlers__;
        
        static contextTypes = {
            router: React.PropTypes.object.isRequired
        };

        constructor(props, context) {
            super(props, context);
        }
        
        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {
            this.checkAuth();
        }

        checkAuth() {
            const { user } = this.props;
            const { router } = this.context;
            
            if(user) {
                this.type = Object.keys(user.roles)[0];
            }
            if(predicate && !this.props.user.roles[predicate]) {
                router.replace('/unauthorized');
            }else if (!this.props.isAuthenticated) {
                let redirectAfterLogin = this.props.location.pathname;
                router.replace(`/login?returnTo=${redirectAfterLogin}`);
            }
        }

        render() {
            return (
                <div style={{height: '100%'}}>
                    {this.props.isAuthenticated === true
                        ? <Component {...this.props} type={this.type}/>
                        : null
                    }
                </div>
            )

        }
    }

    const mapStateToProps = (state) => ({
        user: state.Account.toJSON().user,
        isAuthenticated: state.Account.get('isAuthenticated')
    });

    return connect(mapStateToProps)(AuthenticatedComponent);
}
