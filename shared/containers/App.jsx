import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import NotificationComponent from 'common/components/NotificationComponent';
import classNames from 'classnames';
import AppLayout from 'containers/AppLayout';
import Footer from 'common/components/Footer';
import debug from 'debug';
import DevTools from 'common/middleware/DevTools';
import { initEnvironment } from 'common/actions/App';
import { RouteTransition } from 'react-router-transition';
import * as presets from 'lib/transitions';

if (process.env.BROWSER) {
  /* eslint global-require: "off" */
  require('react-mdl/extra/material');
  // in production change to cdn files
  require('material-design-icons/iconfont/material-icons.css');
  // require('react-mdl/extra/material.css');
  require('styles/mdl-styles/material-design-lite.scss');
  // material-design selectbox
  // require('getmdl-select/getmdl-select.min');
  // require('getmdl-select/getmdl-select.min.css');

  // require('react-select/dist/react-select.css');
  // require('quill/dist/quill.snow.css');

  // toastr
  // react datepicker
  // require('react-datepicker/dist/react-datepicker.css');

  // application styles
  require('styles/main.scss');
  window.debug = debug('app:error');
  window.log = debug('app:log');
}

class AppView extends Component {
  static propTypes = {
    routes: PropTypes.array,
    user: PropTypes.object,
    menu: PropTypes.object,
    environment: PropTypes.object.isRequired,
    dispatch: PropTypes.func,
    Account: PropTypes.object,
    children: PropTypes.object,
    location: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      active: false,
      message: '',
      dismissTimeout: 3000,
      label: 'ok',
    };
  }

  componentDidMount() {
    this.onMount();
  }

  onMount = () => {
    const { dispatch } = this.props;
    this.setState({ isMounted: true });
    dispatch(initEnvironment());
  };

  getNotificationStyles = () => {
    const bar = {
      background: '#263238',
      zIndex: '10000000000000',
    };
    let noteDimensions = { width: 0 };
    let note;
    let active;

    if (process.env.BROWSER) {
      note = document.querySelector('.notification-bar');
      if (note) {
        noteDimensions = note.getBoundingClientRect();
      }
      active = {
        left: `${(Math.floor(window.innerWidth - noteDimensions.width) / 2)}px`,
      };
    }

    const action = {
      color: '#FFCCBC',
    };

    return { bar, active, action };
  };

  getTransition = () => {
    const { location: { state } } = this.props;
    let transition;
    if (state && state.hasOwnProperty('transition')) {
      transition = presets[state.transition];
    } else {
      transition = presets.noTransition;
    }
    return transition;
  };

  notify = (message, action, dismissTimeout, label = 'ok') => {
    this.setState({
      active: true,
      message,
      dismissTimeout,
      label,
      nAction: action,
    });
  };

  action = () => {
    const { nAction } = this.state;
    this.setState({
      active: false,
    });
    if (typeof nAction === 'function') {
      nAction();
    }
  };

  render() {
    // this is where basic structure shud live
    const { user, menu, dispatch, Account, environment } = this.props;
    const { screenHeight, isMobile, screenWidth } = environment;
    const { message, dismissTimeout, label, active, isMounted } = this.state;
    const currentRoute = this.props.routes[this.props.routes.length - 1];
    const transition = this.getTransition();

    if (isMobile) {
      return (
        <div
          style={{ height: `${screenHeight}px`, width: `${screenWidth}px` }}
          id="app-view"
          className={classNames({ [`${currentRoute.name}page`]: true })}
        >
          <Helmet title={`${currentRoute.name} - Eworm`} />
          {isMounted && <DevTools />}
          {
            active &&
              <NotificationComponent
                message={message}
                active={active}
                styles={this.getNotificationStyles()}
                label={label}
                dismissTimeout={dismissTimeout}
                action={this.action}
              />
          }
          <AppLayout
            user={user}
            notify={this.notify}
            menu={menu}
            dispatch={dispatch}
            Account={Account}
          >
          {
            React.cloneElement(this.props.children, {
              notify: this.notify,
              user,
              menu,
              dispatch,
              Account,
            })
          }
          </AppLayout>
          <Footer />
        </div>
      );
    }

    return (
      <div id="app-view" className={classNames({ [`${currentRoute.name}page`]: true })}>
        <Helmet title={`${currentRoute.name} - Eworm`} />
         {isMounted && <DevTools />}
        {
          active &&
            <NotificationComponent
              message={message}
              active={active}
              styles={this.getNotificationStyles()}
              label={label}
              dismissTimeout={dismissTimeout}
              action={this.action}
            />
        }
        <AppLayout
          user={user}
          notify={this.notify}
          menu={menu}
          dispatch={dispatch}
          Account={Account}
        >
          <RouteTransition
            pathname={this.props.location.pathname}
            {...transition}
          >
          {
            React.cloneElement(this.props.children, {
              notify: this.notify,
              user,
              menu,
              dispatch,
              Account,
            })
          }
          </RouteTransition>
        </AppLayout>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.Account.toJSON().user,
  menu: state.Menu.toJSON(),
  environment: state.Environment.toJSON(),
  Account: state.Account,
});

export default connect(mapStateToProps)(AppView);
