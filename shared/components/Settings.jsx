import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Cell, Button, IconButton, Tabs, Tab} from 'react-mdl';
import User from 'components/DashBarUser';
import Confirm from 'components/Confirm';
import { setAddressEditable, changeAddress, toggleAddressActive, revertAddress, cleanAuthMessage, addAddress } from 'actions/AuthActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Settings extends Component{
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) { 
		super(props, context);
		this.state = {
			selectedTab: 0,
			tabs: ['', 'contact-details', 'billing'],
			$dirty: false
		};

		this.registeredHook = undefined;
	}

	componentWillMount() {
		const { location } = this.props;
		let activeState = location.pathname.split('/')[3] || '';
		this.setState({
			selectedTab: this.state.tabs.indexOf(activeState)
		});
	}

	selectTab = (tabId) => {
		if(this.state.selectedTab === tabId) return;
		this.navigate(tabId);
	};

	shouldSave = (isDirty, acceptAction, cancelAction) => {
		return new Promise((resolve, reject) => {
			if(isDirty) {
				let wrapper = document.body.appendChild(document.createElement('div'));
				let modalComponent = ReactDOM.render(<Confirm description="You have unsaved data. Leave without saving?"/>, wrapper);

				function cleanup() {
					ReactDOM.unmountComponentAtNode(wrapper)
		    		setTimeout(() => wrapper.remove());
				}

				modalComponent.$promise.promise.always(cleanup);

				modalComponent.$promise
					.promise
					.then(() => {
						reject(cancelAction);
					})
					.catch(() => {
						resolve(acceptAction);
					});
			} else {
				resolve(this.go.bind(tabId));
			}
		});
	};

	navigate = (tabId) => {
		if(typeof this.registeredHook === "function") {
			this.registeredHook().then((action) => {
				if(typeof action === "function") action();
			}, (action) => {
				if(typeof action === "function") action();
				this.go(tabId);
			});
		} else {
			this.go(tabId);
		}
	};

	go = (tabId) => {
		this.setState({
			selectedTab: tabId
		});
		const { router } = this.context;
		const route = `/dashboard/settings/${this.state.tabs[tabId]}`;
		router.push(route);
	};

	registerHook = (action) => {
		this.registeredHook = action;
	};

	render() {
		const { type, dispatch, user: address, notify, message } = this.props;
		const _this = this;
		
		return (
			<div className="Settings">	
				{
					( type === 'shopper' || type === 'admin' || type === 'delegate') &&
					<Tabs activeTab={this.state.selectedTab} onChange={this.selectTab} ripple className="Settings__tabs">
				        <Tab>Profile</Tab>
				        <Tab>Contact Details</Tab>
				    </Tabs>
				}
				{
					( type === 'merchant' ) &&
					<Tabs activeTab={this.state.selectedTab} onChange={this.selectTab} ripple className="Settings__tabs">
				        <Tab>Profile</Tab>
				        <Tab>Contact Details</Tab>
				        <Tab>Merchant Account</Tab>
				    </Tabs>
				}
			    <section className="Settings__Content grid">
			    	{
			    		this.props.children && React.cloneElement( this.props.children, {
				    		handleAddressEditToggle: bindActionCreators(setAddressEditable, dispatch),
				    		handleAddressEdit: bindActionCreators(changeAddress, dispatch),
				    		revertAddress: bindActionCreators(revertAddress, dispatch),
				    		address: address,
				    		checkDirtyBeforeUnmount: this.shouldSave,
				    		registerHook: this.registerHook,
				    		toggleAddressActive: bindActionCreators(toggleAddressActive, dispatch),
				    		cleanAuthMessage: bindActionCreators(cleanAuthMessage, dispatch),
				    		message: message,
				    		notify: notify,
				    		addAddress: bindActionCreators(addAddress, dispatch)
				    	})
			    	}
			    </section>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	message: state.Auth.get('message')
});

export default connect(mapStateToProps)(Settings);