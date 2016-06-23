import React, { PropTypes, Component } from 'react';
import * as UserActions from 'actions/UserActions';
import { connect } from 'react-redux';
import { provideHooks } from 'redial';
import UserList from 'components/UserList';
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
		
		return(
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

export default provideHooks(hooks)(connect(state => ({users: state.users.toJSON().data, loading: state.users.toJSON().actionWaiting}))(Users));