import React, { PropTypes, Component} from 'react';
import { connect } from 'react-redux';

class DashBarUser extends Component {
	constructor(props) {
		super(props);
		const { user } = this.props;
		if(user) this.type = Object.keys(user.roles)[0];
	}

	render() {
		const { user, passedAvatar } = this.props;
		let avatar;
		if (!passedAvatar && !!user) avatar = user.roles[this.type].avatarUrl;
		let avatarUrl = passedAvatar || avatar[0];
		
		return (
			<div className="DashBarUser" style={{display: 'inline-block'}}>
				{
					avatarUrl && <img className={this.props.className || 'AppBarUser__avatar'} src={avatarUrl}/>
                }
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	user: state.Auth.toJSON().user
});

export default connect(mapStateToProps)(DashBarUser);