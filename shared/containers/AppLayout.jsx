 import React, { Component, PropTypes } from 'react';
 import MainLayout from 'components/MainLayout';

export default class AppLayout extends React.Component {
  render() {
  	const { user, notify, menu, dispatch, Auth } = this.props;
  	//this is where basic structure shud live
    
    return (
	    <MainLayout
	        showFooter={true} style={{height: '100%'}} notify={notify} menu={menu} dispatch={dispatch} Auth={Auth}>
	        {this.props.children && React.cloneElement(this.props.children, {
              user
          })}
	    </MainLayout>
    );
  }
}