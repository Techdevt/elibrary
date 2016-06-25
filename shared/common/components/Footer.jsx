import React, { Component } from 'react';
import { currentDate } from 'lib/date';
import moment from 'moment';
import Link from 'react-router/lib/Link';

export default class footer extends Component {
	render() {
        return (
		    <footer className="section section-footer">
	            <div className="container">
	            	<section className="section-content">
	            		<div className="container">
	            			<ul className="inline-list">
	            				<li><Link to="/contact">Contact us</Link></li>
	            				<small><span>{`©${moment(currentDate(), 'YYYY').format('YYYY')} TechDev Group`}</span></small>
	            				{' '}
	            				<li><Link to="/blog">Blog</Link></li>
	            			</ul>
	            		</div>
	            	</section>
	            </div>
			</footer>
        );
    }
}