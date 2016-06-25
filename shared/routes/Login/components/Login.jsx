import React, { Component, PropTypes } from 'react';
import { Cell, Textfield, Checkbox, Button, FABButton, Icon } from 'react-mdl';
import { connect } from 'react-redux';
import login from '../actions';
import Link from 'react-router/lib/Link';
 
class Login extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			email: '',
			password: ''
		};
	}

	componentWillReceiveProps(nextProps) {
		const { notify, message } =  nextProps;
		if(message !== '') {
			notify(message, this.clearMessage, 5000, 'Ok');
		}
	}

	onSignupClick = (e) => {
		e.preventDefault();
		const { router } = this.context;
		router.push(`/signup`);
	};

	onFieldChanged = (evt) => {
		this.setState({[evt.target.name]: evt.target.value});
	};

	componentWillMount() {
		const { Account } = this.props;
		const { router } = this.context;

		if(Account.get('isAuthenticated')) {
			router.replace('/dashboard');
		}
	}

	componentWillUpdate = (nextProps, nextState) => {
		const { Account, location } = nextProps;
		const { router } = this.context;
		let returnTo = (location.query.hasOwnProperty('returnTo')) ? location.query.returnTo : '/dashboard';

		if(Account.get('isAuthenticated')) {
			let storage = window.localStorage;
			storage.setItem('token', JSON.stringify(Account.get('token')));
			router.replace(returnTo);
		}
	};

	onSubmit = (evt) => {
		evt.preventDefault();

		const { dispatch } = this.props;

		dispatch(login(this.state));
	};

	clearMessage = () => {
		const { dispatch } = this.props;
		// dispatch(cleanAuthMessage());
	};
	

	render() {
		const { Account } = this.props;
		const authSuccess = Account.get('authSuccess');
		const message = Account.get('message');

		return (
			<div className="Login grid">
				<Cell col={4} tablet={6} phone={8} className="Login__container mdl-shadow--6dp">
					<div className="Login__container--header">
						<h4>Login</h4>
					</div>
					<form className="Login__container--body" onSubmit={this.onSubmit}>
						<div className="Login__container--body-inputfield">
							<Textfield
							    label="Username/Email"
							    floatingLabel
							    onChange={this.onFieldChanged}
							    required={true}
							    name="email"
							/>
						</div>
						<div className="Login__container--body-inputfield">
							<Textfield
							    label="Password"
							    floatingLabel
							    type="password"
							    name="password"
							    onChange={this.onFieldChanged}
							    required={true}
							/>
						</div>
						<div className="Login__container--body-lockin">
							<Checkbox label="Keep me signed in" ripple accent />
						</div>
						<div className="Login__container--body-submit"> 
							<Button raised primary ripple>Sign In</Button>
						</div>
						<div className="Login__container--body-forgot">
							<Link to="/forgot" className="Login__container--body-forgot__link">Forgot Password</Link>
						</div>
						<FABButton ripple raised accent className="Login__container--body-signup-fav" onClick={this.onSignupClick}>
                            <Icon name="add" />
                        </FABButton>
					</form>
				</Cell>
			</div>
		);
	}
}

export default connect(state => ({Account: state.Account}))(Login);