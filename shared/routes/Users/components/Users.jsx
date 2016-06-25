import React, { PropTypes, Component } from 'react';
import { getUsers } from '../actions';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import UserList from './UserList';
import { Spinner } from 'react-mdl';

class Users extends Component {
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) {
		super(props, context);
	}

	render() {
		const { users, loading } = this.props;
		
		return (
			<div>
				{
					loading &&
					<div style={{background: '#fafafa', textAlign: 'center'}}>
						<Spinner singleColor={true} />
					</div>
				}
				{
					!loading && users.length > 0 && 
					<UserList users={users} history={this.props.history} loading={loading}/>
				}
				{
					!loading && !users.length > 0 && 
					<div>
						<span>No Users Registered</span>
					</div>
				}
			</div>
		);
	}
}

const hooks = {
  fetch: ({dispatch, store: {getState}}) => {
  	const { isLoaded } = getState().users.toJSON();
  	
  	if(!isLoaded) {
		return dispatch(UserActions.getUsers());
	} else {
		return Promise.resolve();
	}
  }
};

mapStateToProps = (state) => ({
	users: state.users.toJSON().data,
	loading: state.users.toJSON().actionWaiting
});

export default provideHooks(hooks)(connect(mapStateToProps)(Users));