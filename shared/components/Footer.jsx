import React, { Component, PropTypes } from 'react';
import { currentDate } from 'lib/date';
import moment from 'moment';
import {Link} from 'react-router';
import { Icon } from 'react-mdl';

export default class footer extends Component {
	render() {
        return (
		    <footer className="section section-footer">
	            <div className="container">
	            	<section className="section-content">
	            		<div className="container">
	            			<nav className="grid__col--4">
	            				<article>
	            					<h4>Information</h4>
	            					<ul className="unstyled-list">
	            						<li><Link to="/blog">News</Link></li>
	            						<li><Link to="/hotels">Hotels & Accomodation</Link></li>
	            						<li><Link to="/discover-ghana">Discover Ghana</Link></li>
	            						<li><Link to="/gallery">Gallery</Link></li>
	            					</ul>
	            				</article>
	            			</nav>
	            			<nav className="grid__col--4">
	            				<article>
	            					<h4>Our Network</h4>
	            					<ul className="unstyled-list">
	            						<li><Link to="/about/ipsf">IPSF</Link></li>
	            						<li><Link to="/about/gpsa">GPSA</Link></li>
	            						<li><Link to="/about/reception-team">Organizing Team</Link></li>
	            						<li><Link to="/about/visa">Visa Requirements</Link></li>
	            					</ul>
	            				</article>
	            			</nav>
	            			<nav className="grid__col--4">
	            				<article>
	            					<h4>Registration</h4>
	            					<ul className="unstyled-list">
	            						<li><Link to="/#register">Book your participation</Link></li>
	            					</ul>
	            				</article>
	            				<article>
	            					<h4>Social</h4>
	            					<ul className="inline-list">
	            						<li><Link to="/" target="_blank"><i className="fa fa-2x fa-facebook-official"/></Link></li>
	            						<li><Link to="/" target="_blank"><i className="fa fa-2x fa-twitter-square"/></Link></li>
	            						<li><Link to="/" target="_blank"><i className="fa fa-2x fa-linkedin-square"/></Link></li>
	            					</ul>
	            				</article>
	            			</nav>
	            		</div>
	            		<br/>
	            		<hr/>
	            		<br/>
	            		<div className="container">
	            			<ul className="inline-list">
	            				<li><Link to="/contact">Contact us</Link></li>
	            				<small><span>{`©${moment(currentDate(), 'YYYY').format('YYYY')} IPSF`}</span></small>	
	            			</ul>
	            		</div>
	            	</section>
	            </div>
			</footer>
        );
    }
}