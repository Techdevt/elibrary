import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    component: PropTypes.node,
    store: PropTypes.object
  };

  render() {
    const {component, store} = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    
    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" sizes="57x57" href="images/favicon/apple-touch-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="images/favicon/apple-touch-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="images/favicon/apple-touch-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="images/favicon/apple-touch-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="images/favicon/apple-touch-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="images/favicon/apple-touch-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="images/favicon/apple-touch-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="images/favicon/apple-touch-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="images/favicon/apple-touch-icon-180x180.png" />
          <link rel="icon" type="image/png" href="images/favicon/favicon-32x32.png" sizes="32x32" />
          <link rel="icon" type="image/png" href="images/favicon/android-chrome-192x192.png" sizes="192x192" />
          <link rel="icon" type="image/png" href="images/favicon/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/png" href="images/favicon/favicon-16x16.png" sizes="16x16" />
          <link rel="manifest" href="images/favicon/manifest.json" />
          <link rel="mask-icon" href="images/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-TileImage" content="images/favicon/mstile-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          {
            (process.env.NODE_ENV === 'production') &&
            <link rel="stylesheet" href="/style.css" />
          }
        </head>
        <body>
          <div id="App" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${serialize(store.getState())};`}} charSet="UTF-8"/>
          <script src="/bundle.js" charSet="UTF-8" />
          <script src="/vendor.bundle.js" charSet="UTF-8" />
        </body>
      </html>
    );
  }
}