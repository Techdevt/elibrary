import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from 'containers/App';
import AppLayout from 'containers/AppLayout';
import requireAuthentication from 'components/AuthenticatedComponent';
import Login from 'components/Login';
import Home from 'components/Home';
import Signup from 'components/Signup';
import Contact from 'components/Contact';
import UnauthorizedComponent from 'components/UnauthorizedComponent';
import DashLayout from 'containers/DashLayout';
import Dashboard from 'components/Dashboard';
import Overview from 'components/Overview';
import Settings from 'components/Settings';
import Profile from 'components/Profile';
import ContactDetails from 'components/ContactDetails';
import Users from 'components/Users';

export default (
  <Route name="App" component={App}>
    <Route component={AppLayout}> 
      <Route path="/" name="Home" component={Home} />
      <Route name="Login" component={Login} path="login" />
      <Route name="Signup" component={Signup} path="signup" />
      <Route name="Contact" component={Contact} path="contact" />
      <Route name="Unauthorized" component={UnauthorizedComponent} path="unauthorized" />
    </Route>
    <Route component={DashLayout} path="dashboard">
      <IndexRoute name="Dashboard" component={Dashboard} />
      <Route name="Overview" component={Overview} path="overview" />
      <Route name="Settings" component={Settings} path="settings">
          <IndexRoute name="Profile" component={Profile} />
          <Route name="Contact Details" path="contact-details" component={ContactDetails}/>
      </Route>
      <Route name="Users" component={Users} path="users" />
    </Route>
  </Route>
);