import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Helmet from "react-helmet";
import { connect } from 'react-redux';
import NotificationComponent from 'common/components/NotificationComponent';
import classNames from 'classnames';
import AppLayout from 'containers/AppLayout';
import Footer        from 'common/components/Footer';

if(process.env.BROWSER) {
  require('react-mdl/extra/material');
  //in production change to cdn files
  require('material-design-icons/iconfont/material-icons.css');
  //require('react-mdl/extra/material.css');
  require('styles/mdl-styles/material-design-lite.scss');
  //material-design selectbox
  //require('getmdl-select/getmdl-select.min');
  //require('getmdl-select/getmdl-select.min.css');

  //require('react-select/dist/react-select.css');
  //require('quill/dist/quill.snow.css');

  //toastr
  //react datepicker
  //require('react-datepicker/dist/react-datepicker.css');

  //application styles
	require('styles/main.scss');
}

class AppView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      message: '',
      dismissTimeout: 3000,
      label: 'ok'
    };
  }
  
  getNotificationStyles = () => {
    let bar = {
      background: '#263238',
      zIndex: '10000000000000'
    };
    let noteDimensions = {width: 0};
    let note, active;

    if(process.env.BROWSER) {
      note = document.querySelector('.notification-bar');
      if(note) {
        noteDimensions = note.getBoundingClientRect();
      }
      active = {
          left: (Math.floor(window.innerWidth - noteDimensions.width ) / 2) + 'px'
      };
    }

    let action = {
      color: '#FFCCBC'
    };

    return { bar, active, action };
  };

  notify = (message, action, dismissTimeout, label = "ok") => {
      this.setState({
        active: true,
        message: message,
        dismissTimeout: dismissTimeout,
        label: label,
        nAction: action
      });
  };

  action = () => {
      const { nAction } = this.state;
      this.setState({
        active: false
      });
      if(typeof nAction === "function") {
        nAction();
      }
  };

  render() {
  	//this is where basic structure shud live
    const { user, menu, dispatch, Account } = this.props;
    const { message, dismissTimeout, label, active } = this.state;
    const currentRoute =  this.props.routes[this.props.routes.length-1];
    
    return (
      <div id="app-view" className={classNames({[`${currentRoute.name}page`]: true})}>
        <Helmet title={`${currentRoute.name} - Eworm` } />
        {
            active &&
            <NotificationComponent 
            message={ message }
            active={ active }
            styles={ this.getNotificationStyles() } 
            label={ label }
            dismissTimeout={ dismissTimeout }
            action={ this.action }/>
        }
        <AppLayout user={user} notify={this.notify} menu={menu} dispatch={dispatch} Account={Account}>
          {
            React.cloneElement(this.props.children, {
              notify: this.notify,
              user,
              menu,
              dispatch,
              Account
            })
          }
        </AppLayout>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
   user: state.Account.toJSON().user,
   menu: state.Menu.toJSON(),
   Account: state.Account
});

export default connect(mapStateToProps)(AppView);