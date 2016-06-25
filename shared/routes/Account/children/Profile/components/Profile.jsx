import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Cell, IconButton, Button, Textfield, Header, Layout, Content, Icon, Spinner } from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import * as profileActions from '../actions';
import AutosizeInput from 'react-input-autosize';
import async from 'async';
import _ from 'lodash';

class Profile extends Component {
	constructor(props) {
		super(props);
		const { user, type } = this.props;
		this.state = {
			firstName: user.roles[type].firstName,
			lastName: user.roles[type].lastName,
			username: user.username,
			email: user.email,
			title: user.roles[type].title,
			gender: user.roles[type].gender,
			modalIsOpen: false
		};

		this.currValues = {
			firstName: user.roles[type].firstName,
			lastName: user.roles[type].lastName,
			username: user.username,
			email: user.email,
			title: user.roles[type].title,
			gender: user.roles[type].gender,
		};

		this.$dirty = false;
	}

	componentWillMount() {
		const { registerHook, checkDirtyBeforeUnmount } = this.props;
		registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
	}

	componentWillUpdate(nextProps, nextState) {
		const originalValues = this.currValues;
		if(this.checkChanged(originalValues, nextState)) {
			this.$dirty = true;
			const { registerHook, checkDirtyBeforeUnmount } = this.props;
			registerHook(checkDirtyBeforeUnmount.bind(this, this.$dirty));
			return true;
		}
		return true
	}

	componentWillReceiveProps(nextProps) {
		const { notify, cleanAuthMessage } = this.props;
		if(nextProps.message) {
			notify(nextProps.message, cleanAuthMessage, 5000, 'Ok');
		}
	}

	checkChanged(obj1, obj2) {
		_.mixin({
	  		deepEquals: function(ar1, ar2) {
		    var still_matches, _fail,
		      _this = this;
		    if (!((_.isArray(ar1) && _.isArray(ar2)) || (_.isObject(ar1) && _.isObject(ar2)))) {
		      return false;
		    }
		    if (ar1.length !== ar2.length) {
		      return false;
		    }
		    still_matches = true;
		    _fail = function() {
		      still_matches = false;
		    };
		    _.each(ar1, function(prop1, n) {
		      var prop2;
		      prop2 = ar2[n];

		      if (prop1 !== prop2 && ( n !== '$dirty' && n !== 'modalIsOpen') && !_.deepEquals(prop1, prop2)) {
		        _fail();
		      }
		    });
		    return still_matches;
		  }
		});

		if(!_.deepEquals(obj1, obj2)) {
			return true;
		} else {
			return false;
		}
	}

	onInputClick = (evt) => {
		evt.target.readOnly = false;
		evt.target.onblur = this.onLoseFocus.bind(this);
	};

	onLoseFocus = (evt) => {
		evt.target.readOnly = true;
	};

	onFieldChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	};

	editImageClicked = (evt) => {
		const avatarReader = this.refs['avatarInput'];
		avatarReader.addEventListener('change', this.handleFiles, false);
		avatarReader.click();
	};

	deleteImageClicked = (evt) => {
		const { dispatch } = this.props;
		dispatch(profileActions.deleteImage());
	};

	handleFiles = (evt) => {
		evt.preventDefault();
		let fileReader = new FileReader();
		const avatar = evt.target.files[0];
		let displayedImage = ReactDOM.findDOMNode(this.refs['avatarImg']).children[0];

		displayedImage.file = avatar;
		let _this = this;
		fileReader.onload = (function(aImg){
			return function(e) { 
				aImg.src = e.target.result;
				_this.setState({
					avatar: avatar
				});
			};
		})(displayedImage);
		fileReader.readAsDataURL(avatar);
		this.$dirty = true;
	};

	handleSubmit = () => {
		if(!this.$dirty) return;

		const { state, currValues } = this;
		const { dispatch } = this.props;
		
		let formData = new FormData();
		Object.keys(state).forEach(function(key) {
			if((state[key] !== undefined) && (currValues[key] !== state[key]) && key !== 'modalIsOpen') {
				if(key === 'avatar') {
					formData.append(key, state[key]);
				} else {
					formData.append(key, JSON.stringify(state[key]));
				}
			} else if(!currValues.hasOwnProperty(key)) {
				if(key === 'avatar') {
					formData.append(key, state[key]);
				} else {
					formData.append(key, JSON.stringify(state[key]));
				}
			}
		});

		dispatch(profileActions.editAccount(formData));
		this.$dirty = false;
	};

	render() {
		const { type, user } = this.props;
		const passedAvatar = user.roles[type].avatarUrl[1] || user.roles[type].avatarUrl[0];
		
		return (
			<div>
			{
				( type === 'admin' ) &&
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={10} phone={4} tablet={8}>
		    			<h2 className="dash_title">Basic Info</h2>
		    			<div className="Settings__main--big">
		    				<div>
		    					<div className="Settings--profile_avatar inner-div">
		    						<User className="avatar-icon" ref="avatarImg" passedAvatar={passedAvatar}/>
		    						<input type="file" ref="avatarInput" style={{display: 'none'}} accept="image/*"/>
		    						<div className="actions">
			    						<IconButton name="edit" onClick={this.editImageClicked} />
			    						<IconButton name="delete" onClick={this.deleteImageClicked}/>
		    						</div>
		    					</div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Name</h2>
		    						<AutosizeInput type="text" name="firstName" value={this.state.firstName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    						<AutosizeInput type="text" name="lastName" value={this.state.lastName} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    				<div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Username</h2>
		    						<AutosizeInput type="text" name="username" value={this.state.username} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    					<div className="inner-div">
		    						<h2 className="dash_title">Email Id</h2>
		    						<AutosizeInput type="email" name="email" value={this.state.email} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick}/>
		    					</div>
		    				</div>
		    			</div>
		    			<Button raised accent className="Settings__action-btn" disabled={!this.$dirty} onClick={this.handleSubmit}>Update Admin 
		    			<Spinner singleColor={true} style={{
		    				display: this.props.isWaiting ? 'inline-block' : 'none'
		    			}}/></Button>
		    		</Cell>
		    	</div>
			}
		</div>	
		);
	}
}

const mapStateToProps = (state) => ({
	isWaiting: state.Account.get('isWaiting')
});

export default AuthenticatedComponent(connect(mapStateToProps)(Profile));