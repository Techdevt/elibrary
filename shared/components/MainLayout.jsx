import React, {Component, PropTypes} from 'react';
import {Layout, Header, Navigation, Drawer, Content, HeaderRow, Textfield, FABButton, Icon, Grid, Cell, Menu, MenuItem, Button, IconButton} from 'react-mdl';
import {Link} from 'react-router';
//import AppBar      from './AppBar';
import Footer        from './Footer';
import TransitionGroup from 'react-addons-transition-group';
import { toggleMenu } from 'actions/MenuActions';
import MenuComponent from 'components/Menu';
import { logoutUser } from 'actions/AuthActions';
import { connect } from 'react-redux';

export default class MainLayout extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);
    }

	toggleDrawer = (e) => {
        document.querySelector('.mdl-layout__drawer').classList.remove('is-visible');
        let dimmer = document.querySelector('.mdl-layout__obfuscator');
        dimmer.classList.remove('is-visible');
    };

    goToUrl = (path) => {
        const { router } = this.context;
        router.push(path);
    };

    onClickMenu = (links, caption = '') => {
        window.scrollTo(0, 0);
        const { dispatch } = this.props;
        dispatch(toggleMenu(links));
    };

    onLogout = (evt) => {
        evt.preventDefault();
        const { dispatch } = this.props;

        dispatch(logoutUser());
    };

	render() {
        const { notify, menu, Auth } = this.props;

        return (
            <Layout fixedHeader style={{minHeight: '100%',height:"auto", position: 'relative'}} id="main">
                <Header className="header">
                    <HeaderRow className="container">
                      <Link to="/" className="brand">
                      <svg version="1.1" className="icon-gnaas" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 173.676 44">
                            <g id="XMLID_55_" className="icon-logo">
                                <path id="XMLID_56_" fill="#909090" d="M3.252,34.032V8.017h5.414v26.016H3.252z"/>
                                <path id="XMLID_58_" fill="#909090" d="M15.187,34.032V8.017h8.945c2.601,0,4.43,0.272,5.487,0.817
                                    c1.058,0.545,1.855,1.315,2.393,2.312c0.537,0.996,0.806,2.25,0.806,3.762c0,2.906-0.916,5.121-2.749,6.645
                                    c-1.832,1.523-4.288,2.285-7.367,2.285h-2.206v10.195H15.187z M20.496,20.269h1.018c1.99,0,3.452-0.478,4.385-1.433
                                    c0.933-0.955,1.399-2.077,1.399-3.366c0-0.727-0.147-1.386-0.441-1.978c-0.294-0.592-0.75-1.058-1.366-1.397s-1.603-0.51-2.96-0.51
                                    h-2.036V20.269z"/>
                                <path id="XMLID_61_" fill="#909090" d="M35.807,33.804v-4.466c2.031,0.853,3.548,1.362,4.552,1.528
                                    c1.004,0.166,1.927,0.249,2.771,0.249c1.521,0,2.655-0.34,3.403-1.021c0.748-0.68,1.123-1.495,1.123-2.445
                                    c0-0.727-0.21-1.384-0.629-1.971c-0.419-0.574-1.445-1.319-3.077-2.234l-1.756-0.967c-2.507-1.396-4.204-2.686-5.091-3.87
                                    c-0.899-1.185-1.348-2.557-1.348-4.116c0-1.958,0.749-3.635,2.246-5.03s3.649-2.093,6.454-2.093c2.095,0,4.457,0.299,7.085,0.896
                                    v4.167c-2.689-0.997-4.825-1.496-6.408-1.496c-1.309,0-2.306,0.285-2.99,0.854c-0.685,0.569-1.026,1.252-1.026,2.049
                                    c0,0.61,0.209,1.179,0.628,1.707c0.406,0.528,1.425,1.25,3.057,2.164l1.88,1.038c2.874,1.607,4.707,3.002,5.499,4.185
                                    c0.78,1.195,1.17,2.536,1.17,4.022c0,2.132-0.813,3.953-2.439,5.463c-1.626,1.511-4.213,2.266-7.76,2.266
                                    C41.045,34.683,38.597,34.39,35.807,33.804z"/>
                                <path id="XMLID_63_" fill="#909090" d="M57.832,34.032V8.017h16.207v3.586H63.246v7.893h8.842v3.586h-8.842v10.951H57.832z"/>
                                <path id="XMLID_65_" fill="#C1272D" d="M77.596,32.415c1.844-1.266,3.504-2.43,4.98-3.492s2.781-2.066,3.914-3.012
                                    s2.102-1.859,2.906-2.742s1.465-1.773,1.98-2.672s0.895-1.836,1.137-2.813s0.363-2.035,0.363-3.176c0-1.359-0.152-2.449-0.457-3.27
                                    s-0.703-1.453-1.195-1.898S90.178,8.599,89.56,8.45s-1.238-0.223-1.863-0.223c-1.047,0-2.02,0.148-2.918,0.445
                                    s-1.691,0.75-2.379,1.359c0.453,0.453,0.797,0.953,1.031,1.5s0.352,1.07,0.352,1.57c0,0.703-0.23,1.305-0.691,1.805
                                    s-1.129,0.75-2.004,0.75c-0.391,0-0.758-0.059-1.102-0.176s-0.641-0.293-0.891-0.527s-0.449-0.523-0.598-0.867
                                    s-0.223-0.742-0.223-1.195c0-0.813,0.234-1.609,0.703-2.391s1.137-1.477,2.004-2.086s1.91-1.098,3.129-1.465
                                    s2.586-0.551,4.102-0.551c1.469,0,2.789,0.184,3.961,0.551s2.164,0.891,2.977,1.57s1.434,1.504,1.863,2.473
                                    s0.645,2.055,0.645,3.258c0,1.031-0.156,2.012-0.469,2.941s-0.738,1.824-1.277,2.684s-1.18,1.68-1.922,2.461
                                    s-1.543,1.539-2.402,2.273s-1.758,1.449-2.695,2.145s-1.883,1.379-2.836,2.051l-2.086,1.477l0.047,0.117h7.688
                                    c1.063,0,1.906-0.051,2.531-0.152s1.117-0.324,1.477-0.668s0.633-0.848,0.82-1.512s0.375-1.566,0.563-2.707h1.781l-0.492,8.672
                                    H77.596V32.415z"/>
                                <path id="XMLID_67_" fill="#C1272D" d="M115.986,34.688c-1.813,0-3.422-0.324-4.828-0.973s-2.594-1.574-3.563-2.777
                                    s-1.707-2.66-2.215-4.371s-0.762-3.637-0.762-5.777c0-2.219,0.273-4.215,0.82-5.988s1.336-3.281,2.367-4.523
                                    s2.277-2.199,3.738-2.871s3.105-1.008,4.934-1.008c1.781,0,3.375,0.324,4.781,0.973s2.59,1.574,3.551,2.777s1.695,2.66,2.203,4.371
                                    s0.762,3.629,0.762,5.754c0,2.094-0.25,4.02-0.75,5.777s-1.242,3.277-2.227,4.559s-2.211,2.281-3.68,3
                                    S117.939,34.688,115.986,34.688z M116.103,32.86c0.688,0,1.332-0.066,1.934-0.199s1.156-0.371,1.664-0.715s0.965-0.813,1.371-1.406
                                    s0.746-1.352,1.02-2.273s0.484-2.027,0.633-3.316s0.223-2.801,0.223-4.535c0-2.547-0.156-4.613-0.469-6.199
                                    s-0.754-2.824-1.324-3.715s-1.266-1.492-2.086-1.805s-1.738-0.469-2.754-0.469c-1.031,0-1.973,0.16-2.824,0.48
                                    s-1.574,0.934-2.168,1.84s-1.055,2.172-1.383,3.797s-0.492,3.734-0.492,6.328c0,1.688,0.07,3.164,0.211,4.43
                                    s0.344,2.348,0.609,3.246s0.59,1.641,0.973,2.227s0.82,1.047,1.313,1.383s1.035,0.57,1.629,0.703S115.416,32.86,116.103,32.86z"/>
                                <path id="XMLID_70_" fill="#C1272D" d="M141.603,7.079v25.078h5.156v1.875h-14.648v-1.875h5.156V8.954h-5.625V7.079H141.603z"/>
                                <path id="XMLID_72_" fill="#C1272D" d="M169.541,7.079V8.72l-5.273,12.609c-0.703,1.672-1.289,3.172-1.758,4.5
                                    s-0.844,2.5-1.125,3.516s-0.48,1.898-0.598,2.648s-0.176,1.383-0.176,1.898c0,0.625,0.063,1.113,0.188,1.465s0.262,0.66,0.41,0.926
                                    s0.285,0.531,0.41,0.797s0.188,0.625,0.188,1.078c0,0.469-0.074,0.883-0.223,1.242s-0.348,0.66-0.598,0.902
                                    s-0.539,0.426-0.867,0.551s-0.664,0.188-1.008,0.188c-0.375,0-0.742-0.07-1.102-0.211s-0.684-0.352-0.973-0.633
                                    s-0.52-0.625-0.691-1.031s-0.258-0.867-0.258-1.383c0-0.578,0.102-1.25,0.305-2.016s0.48-1.613,0.832-2.543s0.762-1.938,1.23-3.023
                                    s0.961-2.238,1.477-3.457l6.68-15.773h-9.188c-1.109,0-1.992,0.047-2.648,0.141s-1.172,0.309-1.547,0.645s-0.656,0.832-0.844,1.488
                                    s-0.375,1.555-0.563,2.695h-1.781V7.079H169.541z"/>
                            </g>
                            </svg>
                      </Link>
                    <Navigation>
                        <li>
                            <Link to="/" activeClassName="active">Home</Link>
                        </li>
                        <li>
                            <Link to="/about" activeClassName="active">About</Link>
                        </li>
                        <li>
                            <Link to="/hotels" activeClassName="active">Hotels</Link>
                        </li>
                        <li>
                            <Link to="/contact" activeClassName="active">Contact</Link>
                        </li>
                        <li>
                            <Link to="/discover-ghana" activeClassName="active">Discover Ghana</Link>
                        </li>
                        <li>
                            <Link to="/blog" activeClassName="active">Blog</Link>
                        </li>
                        <li>
                            <a
                                className="vanish-blog" 
                                activeClassName="active"
                                style={{cursor: 'pointer'}}
                                onClick={this.onClickMenu.bind(this, [
                                        { path: '/documents', name: 'Documents', icon: 'file-text'},
                                        { path: '/gallery', name: 'Gallery', icon: 'file-image-o'}
                                    ], '')}
                                >Media</a>
                        </li>
                        <li>
                            {
                                Auth.get('isAuthenticated') &&
                                <div>
                                    <IconButton id="demo-menu-lower-right" name="account_circle" />
                                    <Menu target="demo-menu-lower-right" ripple className="mdl-shadow--3dp AppBar__menu-item-dropdown">
                                        <MenuItem onClick={this.goToUrl.bind(this,'/dashboard')}>Dashboard</MenuItem>
                                        <MenuItem onClick={this.onLogout}>Logout</MenuItem>
                                    </Menu>
                                </div>
                            }
                            {
                                !Auth.get('isAuthenticated') &&
                                <div>
                                    <IconButton id="demo-menu-lower-right" name="account_circle" onClick={this.goToUrl.bind(this,'/login')} />
                                </div>
                            }
                        </li>
                      </Navigation>
                    </HeaderRow>
                </Header>
                <Drawer onClick={this.toggleDrawer}>
                    <Navigation>
                        <li>
                            <Link to="/" className='MainLayout__drawer-nav-link' activeClassName="active">Home</Link>
                        </li>
                        <li>
                            <Link to="/about" className='MainLayout__drawer-nav-link' activeClassName="active">About</Link>
                        </li>
                        <li>
                            <Link to="/hotels" className='MainLayout__drawer-nav-link' activeClassName="active">Hotels</Link>
                        </li>
                        <li>
                            <Link to="/contact" className='MainLayout__drawer-nav-link' activeClassName="active">Contact</Link>
                        </li>
                        <li>
                            <Link to="/discover-ghana" className='MainLayout__drawer-nav-link' activeClassName="active">Discover Ghana</Link>
                        </li>
                        <li>
                            <Link to="/blog" className='MainLayout__drawer-nav-link' activeClassName="active">Blog</Link>
                        </li>
                        <li>
                            <Link to="/gallery" className='MainLayout__drawer-nav-link' activeClassName="active">Images</Link>
                        </li>
                        <li>
                            <Link to="/documents" className='MainLayout__drawer-nav-link' activeClassName="active">Documents</Link>
                        </li>
                    </Navigation>
                </Drawer>
                <div className="Content">
                    <TransitionGroup component="div">
                        {
                            menu.isActive &&
                            <MenuComponent links={menu.links} caption={menu.caption} toggleMenu={this.onClickMenu}></MenuComponent>
                        }
                    </TransitionGroup>
                    { 
                        this.props.children && React.cloneElement(this.props.children, {
                            notify
                        })
                    }
                     <Footer />
                </div>
            </Layout>
        );
    }
}