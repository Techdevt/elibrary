import React, { Component, PropTypes } from 'react';
import {
  Layout,
  Header,
  Navigation,
  Drawer,
  Content,
  Icon,
} from 'react-mdl';
import Link from 'react-router/lib/Link';
import DashBar from 'common/components/DashBar';
import User from 'common/components/DashBarUser';

export default class DashLayout extends Component {
  static propTypes = {
    type: PropTypes.string,
    routes: PropTypes.array,
    notify: PropTypes.func,
    dispatch: PropTypes.func,
    user: PropTypes.object,
    children: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    dimmer.classList.remove('is-visible');
  };

  generateLinks() {
    const { type } = this.props;
    const navLinks = [{
      to: '/dashboard/overview',
      name: 'Overview',
      allow: ['merchant', 'delegate', 'shopper', 'admin'],
      icon: 'note',
    }, {
      to: '/dashboard/settings',
      name: 'Settings',
      allow: ['merchant', 'delegate', 'shopper', 'admin'],
      icon: 'settings',
    }, {
      to: '/dashboard/users',
      name: 'Users',
      allow: ['admin'],
      icon: 'event',
    }];

    const links = navLinks.filter((link) => link.allow.indexOf(type) !== -1);
    return links;
  }

  goToUrl = (path, evt) => {
    evt.preventDefault();
    const { router } = this.context;
    router.push(path);
  };

  render() {
    const { user, type, notify } = this.props;
    const passedAvatar = user.roles[type].avatarUrl[1];
    const fullName = `${user.roles[type].firstName} ${user.roles[type].lastName}`;
    const companyName = user.roles[type].companyName;
    const links = this.generateLinks();
    const currentRoute = this.props.routes[this.props.routes.length - 1];

    return (
      <div style={{ minHeight: '100%', height: '100%', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>
          <DashBar title={currentRoute.name} goToUrl={this.goToUrl} type={type} />
          <Drawer onClick={this.toggleDrawer}>
            <Header className="Drawer__Header">
              <User className="Drawer__Header_avatar" passedAvatar={passedAvatar} />
              <span
                className="Drawer__Header_title"
              >
                {(type === 'merchant') ? companyName : fullName}
              </span>
            </Header>
            <Navigation className="sideNav">
            {
              links.map((link, index) => (
                <Link
                  to={link.to}
                  key={index}
                  activeClassName="active"
                >
                  {link.name}
                  <Icon name={link.icon} className="link-icon" />
                </Link>
                )
              )
            }
            </Navigation>
          </Drawer>
          <Content className="DashContent">
            <div>
            {
              this.props.children && React.cloneElement(this.props.children, {
                user,
                type,
                notify,
              })
            }
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
