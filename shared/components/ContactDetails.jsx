import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import {Cell, IconButton, Button, Header, Layout, Content, Icon, Grid, Tooltip } from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { connect } from 'react-redux';
import AuthenticatedComponent from 'components/AuthenticatedComponent';
import AutosizeInput from 'react-input-autosize';
import Address from 'components/Address';
import async from 'async';
import TransitionGroup from 'react-addons-transition-group';
import { editUser } from 'actions/AuthActions';
import _ from 'lodash';

class ContactDetails extends Component {
	static self = this;
	constructor(props) {
		super(props);
		const { user } = this.props;
		this.state = {
			addresses: user.address,
			$dirty: false
		};
		this.addresses = user.address;
	}

	componentWillReceiveProps(nextProps) {
		const { registerHook, checkDirtyBeforeUnmount, revertAddress, notify, cleanAuthMessage } = this.props;
		if(nextProps.message) {
			notify(nextProps.message, cleanAuthMessage, 5000, 'Ok');
		}
		this.setState({
			addresses: nextProps.user.address,
			$dirty: this.checkChanged(nextProps)
		});
		
		registerHook(checkDirtyBeforeUnmount.bind(this, this.state.$dirty, null, revertAddress.bind(this, this.addresses)));
	}

	checkChanged(nextProps) {
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

		      if (prop1 !== prop2 && ( n !== 'isActive' && n !== 'editable') && !_.deepEquals(prop1, prop2)) {
		        _fail();
		      }
		    });
		    return still_matches;
		  }
		});

		if(!_.deepEquals(nextProps.user.address, this.addresses)) {
			return true;
		} else {
			return false;
		}
	}

	onFieldChange = (index, evt) => {
		this.props.handleAddressEdit(index, evt.target.name, evt.target.value);
	};

	handleSubmit = () => {
		if(!this.state.$dirty) return;

		const { addresses } = this.state;
		const { dispatch } = this.props;
		
		let formData = new FormData();
		formData.append("address", JSON.stringify(addresses));

		dispatch(editUser(formData));
		this.setState({
			$dirty: false
		});
		this.addresses = addresses;
		//reregister hooks
	};

	toggleAddressEdit = (index, state) => {
		const { handleAddressEditToggle } = this.props;
		handleAddressEditToggle(index, state);
	};
	
	handleAddressDelete = (index, evt) => {
		this.setState({
			address: [
						...this.state.address.slice(0, index),
						...this.state.address.slice(index + 1)
					]
		});
	};

	render() {
		const { addresses } = this.state;
		const { toggleAddressActive, handleAddressEditToggle, handleAddressEdit } = this.props;

		return (
			<div>
			{
				<div className="DashContent__inner">
		    		<Cell className="Settings__main" col={10} phone={4} tablet={8}>
		    			<h2 className="dash_title">Contact Information</h2>
	    				{
	    					addresses.map((address, index) => {
	    						return (
	    							<div className="Address-container" key={index}>
	    								<div className="Header">
	    									<h3>Addresses</h3>
	    									<IconButton onClick={() => {}} name="add" className="add_address-btn" />
	    								</div>
	    								<Grid className="compact">
	    									<Cell col={10}  className="title">
	    										<span>{`${address.fullName}, ${address.addressLine1}`}</span>
	    									</Cell>
	    									<Cell col={2} className="actions">
	    										<Tooltip label={!address.isActive ? "Show Address": "Hide Address"} position="top">
	    											<IconButton 
	    												name={!address.isActive ? "keyboard_arrow_down": "keyboard_arrow_up"}
	    												onClick={toggleAddressActive.bind(this, index, !address.isActive)}  />
	    										</Tooltip>
	    										{
	    											address.isActive &&
	    											<Tooltip label={!address.editable ? "Edit Address": "Done Editing Address"} position="top">
		    											<IconButton name="edit" onClick={handleAddressEditToggle.bind(this, index, !address.editable)}/>
		    										</Tooltip>
	    										}
	    									</Cell>
	    								</Grid>
	    								<TransitionGroup component="div">
	    									{
	    										address.isActive &&
	    										<Address editable={true}
				    							key={index}
				    							address={address}
				    							editable={address.editable}
				    							handleAddressEdit={this.toggleAddressEdit.bind(this, index, !address.editable)}
				    							handleAddressDelete={this.handleAddressDelete.bind(this, index)}
				    							onFieldChange={this.onFieldChange.bind(this, index)} />
	    									}
	    								</TransitionGroup>
	    							</div>
	    						);
	    					})
	    				}
		    			<Button raised accent className="Settings__action-btn" disabled={!this.state.$dirty} onClick={this.handleSubmit}>Update Contact</Button>
		    		</Cell>
		    	</div>
			}
		</div>	
		);
	}
}

export default AuthenticatedComponent(ContactDetails);


// <div>
// 	<div className="inner-div full">
// 		<h2 className="dash_title">Bio</h2>
// 		<textarea className="small-text" name="bio" value={this.state.bio} onChange={this.onFieldChange} readOnly={true} onClick={this.onInputClick} rows="2"></textarea>
// 	</div>
// </div>