import React, {Component, PropTypes} from 'react';
import {Header, Textfield, Badge, Icon, IconButton, Menu, MenuItem} from 'react-mdl';
import {Link} from 'react-router';
import { connect } from 'react-redux';

export default class DashBar extends Component {

	render() {
        const { type, messageCount, goToUrl } = this.props;
        
		return (
            <Header className="DashBar" title={<span><strong>#</strong>{this.props.title}</span>} scroll>
                 <div className="DashBar__right">
                	<Badge text={messageCount || '0'}>
					    <Icon name="announcement" style={{cursor: 'pointer'}} onClick={this.props.goToUrl.bind(this, '/dashboard/messages')}/>
					</Badge>         
                    <IconButton id="account-menu-toggle" name="account_circle" style={{marginTop: '-15px'}}/>
                    <Menu target="account-menu-toggle" ripple className="mdl-shadow--3dp" valign="bottom" align="right" style={{marginLeft: 0}}>
                        <MenuItem onClick={goToUrl.bind(this,'/')}>Home</MenuItem>
                        <MenuItem onClick={goToUrl.bind(this,'/dashboard')}>Dashboard</MenuItem>
                    </Menu>
                 </div>
            </Header>
        );
	}
}