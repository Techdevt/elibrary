import React, { Component, PropTypes } from 'react';
import { Cell } from 'react-mdl';
import steps from 'components/Signup/index';
import Multistep from 'components/Signup/Multistep';
import { createUser } from 'actions/AuthActions';
import { connect } from 'react-redux';

class Signup extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) {
		super(props, context);
		this.state = {
			title: '',
			lastName: '',
			firstName: '',
			email: '',
			username: '',
			password: '',
			fullName: '',
			addressLine1: '',
			addressLine2: '',
			postcode: '',
			country: '',
			zip: '',
			state: '',
			city: '',
			phone: ''
		};
	}

	componentWillMount() {
		const { Auth } = this.props;

		if(Auth.get('isAuthenticated')) {
			this.context.router.replace('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		const { notify } = this.props;
		if(nextProps.message) {
			let submit = document.querySelector('.Signup__container--body-fieldrow_submit');
			 if(nextProps.Auth.get('shouldRedirect')) {
			 	submit.classList.add('success');
			 }

			notify(nextProps.message, this.redirect, 2000, 'Ok');
		}
	}

	redirect = () => {
		const { Auth } = this.props;
		let submit = document.querySelector('.Signup__container--body-fieldrow_submit');

		if(Auth.get('shouldRedirect')) {
			submit.classList.remove('success');
			setTimeout(function() {
				this.context.router.replace(`/${Auth.get('redirectLocation')}`);
			}, 2000);
		}
	};

	saveData = (fields, callback, evt) => {
		evt.preventDefault();
		if (fields !== null && typeof fields !== 'undefined') {
			this.setState(fields, function() {
				callback();
			});
		}else {
			callback();
		}
	};

	onSignup = (finishForm) => {
		finishForm();
		//clear passMatchError propagated from password checking
		delete this.state.passMatchError;

		const { dispatch } = this.props;
		dispatch(createUser({...this.state, action: {
            type: 'CREATE_SHOPPER'
        }}));
	};

	render() {
		const { Auth } = this.props;
		return (
			<div className="Signup">
				<Cell col={6} tablet={6} phone={4} className="Signup__container mdl-shadow--6dp">
					<div className="Signup__container--header">
						<h4>Create an Account</h4>
					</div>
					<div className="Signup__container--body">
						<Multistep steps={steps} onCallbackParent={this.saveData} fieldValues={this.state} onSignup={this.onSignup} isWaiting={Auth.get('isWaiting')}/>
					</div>
				</Cell>
			</div>
		);
	}
}

export default connect(state => ({ Auth: state.Auth, message: state.Auth.get('message') }))(Signup);