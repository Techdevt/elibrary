import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';

export default class Menu extends Component {
	static propTypes = {
		links: PropTypes.array.isRequired
	};

	componentWillEnter(callback) {
		const DOMNode = ReactDOM.findDOMNode(this);
		if(!DOMNode) return callback();
		const height = DOMNode.getBoundingClientRect().height;
		DOMNode.style.maxHeight = 0;
		const TWEEN = require('tween.js');
		const tFrom = { maxHeight: 0 };
		const tTo = { maxHeight: height };
		const tween = new TWEEN.Tween(tFrom)
				 .to(tTo, 500)
				 .onUpdate(function() {
				 	DOMNode.style.maxHeight = this.maxHeight + 'px';
				 }).start()
				 .onComplete(callback);

		requestAnimationFrame(animate);

		function animate(time) {
		    requestAnimationFrame(animate);
		    TWEEN.update(time);
		}
	}

	componentWillLeave(callback) {
		const DOMNode = ReactDOM.findDOMNode(this);
		if(!DOMNode) return callback();
		const height = DOMNode.getBoundingClientRect().height;
		const TWEEN = require('tween.js');
		const tFrom = { maxHeight: height };
		const tTo = { maxHeight: 0 };
		const tween = new TWEEN.Tween(tFrom)
				 .to(tTo, 500)
				 .onUpdate(function() {
				 	DOMNode.style.maxHeight = this.maxHeight + 'px';
				 	DOMNode.style.height = this.maxHeight + 'px';
				 }).start()
				 .onComplete(callback);

		requestAnimationFrame(animate);

		function animate(time) {
		    requestAnimationFrame(animate);
		    TWEEN.update(time);
		}
	}

	render() {
		const { links, caption } = this.props;
		return (
			<div className="Menu">
				<div className="container">
					<div className="section-content">
						{
							caption &&
							<h5 className="menu-heading"></h5>
						}
						<ul className="menu-list">
							{
								links.length > 0 &&
								links.map((link, index) => {
									return (
										<li key={index} onClick={this.props.toggleMenu.bind(this, undefined, '')}>
											<Link to={link.path}>
												<span>
													<i className={`fa fa-${link.icon}`}></i>
													<br />
													{ link.name }
												</span>
											</Link>
										</li>
									);
								})
							}
						</ul>
					</div>
				</div>
			</div>
		);
	}
}