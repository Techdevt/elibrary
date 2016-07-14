import React, { Component, PropTypes } from 'react';
import {
  Layout,
  Header,
  Navigation,
  Drawer,
  HeaderRow,
  Menu,
  MenuItem,
  IconButton,
} from 'react-mdl';
import Link from 'react-router/lib/Link';
import TransitionGroup from 'react-addons-transition-group';
import { toggleMenu } from 'common/actions/Menu';
import MenuComponent from 'common/components/Menu';
import { logout } from 'common/actions/Auth';

export default class MainLayout extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    menu: PropTypes.object,
    Account: PropTypes.object,
    notify: PropTypes.func,
    children: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  onClickMenu = (links) => {
    window.scrollTo(0, 0);
    const { dispatch } = this.props;
    dispatch(toggleMenu(links));
  };

  onLogout = (evt) => {
    evt.preventDefault();
    const { dispatch } = this.props;

    dispatch(logout());
  };

  goToUrl = (path) => {
    const { router } = this.context;
    router.push(path);
  };

  toggleDrawer = () => {
    document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
    const dimmer = document.querySelector('.mdl-layout__obfuscator');
    dimmer.classList.remove('is-visible');
  };

  render() {
    const { notify, menu, Account } = this.props;

    return (
      <Layout
        fixedHeader
        style={{
          minHeight: '100%',
          height: 'auto',
          position: 'relative',
          marginBottom: '-165px',
        }}
        id="main"
      >
        <Header className="header">
          <HeaderRow className="container">
            <Link to="/" className="brand">
              <img src="images/logo.svg" className="icon-logo" alt="bookworm" />
            </Link>
            <Navigation>
              <li>
              {
                Account.get('isAuthenticated') &&
                  <div>
                    <IconButton id="demo-menu-lower-right" name="account_circle" />
                    <Menu
                      target="demo-menu-lower-right"
                      ripple
                      className="mdl-shadow--3dp AppBar__menu-item-dropdown"
                    >
                      <MenuItem onClick={() => this.goToUrl('/dashboard')}>Dashboard</MenuItem>
                      <MenuItem onClick={() => this.onLogout}>Logout</MenuItem>
                    </Menu>
                  </div>
              }
              {
                !Account.get('isAuthenticated') &&
                  <div>
                    <IconButton
                      id="demo-menu-lower-right"
                      name="account_circle"
                      onClick={() => this.goToUrl('/login')}
                    />
                  </div>
              }
              </li>
            </Navigation>
          </HeaderRow>
        </Header>
        <Drawer onClick={this.toggleDrawer}>
          <Navigation>
            <li>
              <Link
                to="/"
                className="MainLayout__drawer-nav-link"
                activeClassName="active"
              >
                Home
              </Link>
            </li>
          </Navigation>
        </Drawer>
        <div className="Content">
          <TransitionGroup component="div">
            {
              menu.isActive &&
                <MenuComponent
                  links={menu.links}
                  caption={menu.caption}
                  toggleMenu={this.onClickMenu}
                />
            }
          </TransitionGroup>
          <div >
          {
            this.props.children && React.cloneElement(this.props.children, {
              notify,
            })
          }
          </div>
        </div>
      </Layout>
    );
  }
}
