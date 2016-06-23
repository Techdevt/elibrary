import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

export default class Dashboard extends React.Component{
	static contextTypes = {
		router: PropTypes.object.isRequired
	};

	constructor(props, context) {
		super(props, context);
	}

	componentWillMount() {
		const { type } = this.props;
		const { router } = this.context;
		if(type === 'admin') {
			router.replace('/dashboard/overview');
		}
	}

	render() {
		const { user, type, notify } = this.props;
		
		return (
			<div style={{height: '100%'}} className="Dashboard">
				dashboard
			</div>
		);
	}
}
/*
	check user type and render dashboard, if user is merchant or delegate render shop view
	if user is shopper render shopper dashboard::yet to be thought of
	if user is admin render system reporting stuff::yet to be implemented

*/
// @todo::move bannerloading to shop reducer