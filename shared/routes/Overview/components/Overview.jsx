import React, { PropTypes, Component } from 'react';
import { Button } from 'react-mdl';
import { provideHooks } from 'redial';
import moment from 'moment';

class Overview extends Component {
	render() {
		const { notify, report, type } = this.props;
		
		return(
			<div className="Overview">
					<div className="Overview__inner">
						<div className="Overview__inner--row">
							<h3 className="Overview__inner--row-main_header">IPSF Custom CMS Backend</h3>
						</div>
						<div className="Overview__inner--row">
							<h3 className="Overview__inner--row-header">Developer:</h3>
							<span className="Overview__inner--row-data">Benjamin Appiah-Brobbey</span>
						</div>
						<div className="Overview__inner--row">
							<h3 className="Overview__inner--row-header">Contact:</h3>
							<span className="Overview__inner--row-data">fanky5g@gmail.com</span>
						</div>
					</div>		
			</div>
		);
	}
}


export default Overview;