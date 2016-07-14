import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import Link from 'react-router/lib/Link';
/* eslint global-require: "off" */
export default class Menu extends Component {
  static propTypes = {
    links: PropTypes.array,
    toggleMenu: PropTypes.func,
    caption: PropTypes.string,
  };

  componentWillEnter(callback) {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (!DOMNode) return callback();
    const height = DOMNode.getBoundingClientRect().height;
    DOMNode.style.maxHeight = 0;
    const tFrom = { maxHeight: 0 };
    const TWEEN = require('tween.js');
    const tTo = { maxHeight: height };
    new TWEEN.Tween(tFrom)
      .to(tTo, 500)
      .onUpdate(function update() {
        DOMNode.style.maxHeight = `${this.maxHeight}px`;
      })
      .start()
      .onComplete(callback);

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
    return true;
  }

  componentWillLeave(callback) {
    const DOMNode = ReactDOM.findDOMNode(this);
    if (!DOMNode) return callback();
    const height = DOMNode.getBoundingClientRect().height;
    const tFrom = { maxHeight: height };
    const tTo = { maxHeight: 0 };
    const TWEEN = require('tween.js');
    new TWEEN.Tween(tFrom)
      .to(tTo, 500)
      .onUpdate(function update() {
        DOMNode.style.maxHeight = `${this.maxHeight}px`;
        DOMNode.style.height = `${this.maxHeight}px`;
      })
      .start()
      .onComplete(callback);

    function animate(time) {
      requestAnimationFrame(animate);
      TWEEN.update(time);
    }
    requestAnimationFrame(animate);
    return true;
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
              links.map((link, index) => (
                <li key={index} onClick={() => this.props.toggleMenu(undefined, '')}>
                  <Link to={link.path}>
                    <span>
                      <i className={`fa fa-${link.icon}`}></i>
                      <br />
                      {link.name}
                    </span>
                  </Link>
                </li>
                )
              )
            }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
