import React, { PropTypes, Component } from 'react';

export default class NotificationComponent extends Component {
	render() {
		const { message, label, dismissTimeout, styles, active, action } = this.props;
		
		return (
			<div isActive={ active }
	            message={ message }
	            action={ label }
	            onDismiss={ action }
	            onClick={ action }
	            dismissAfter={ dismissTimeout }
	            style={ true }
	            activeBarStyle={styles.active}
	            actionStyle={styles.action}
	            barStyle={styles.bar}
            >
            	message
            </div>
		);
	}
}