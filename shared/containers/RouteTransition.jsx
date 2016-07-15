import React, { PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';

const willEnter = children => ({ children, opacity: spring(0), scale: spring(0.95) });
const willLeave = (key, { children }) => ({ children, opacity: spring(0), scale: spring(0.95) });
const getStyles = (children, pathname) => ({
  [pathname]: { children, opacity: spring(1), scale: spring(1) },
});

const RouteTransition = ({ children, pathname }) => (
  <TransitionMotion
    styles={getStyles(children, pathname)}
    willEnter={willEnter}
    willLeave={willLeave}
  >
    {interpolated =>
      <div>
        {Object.keys(interpolated).map(key =>
          <div
            key={`${key}-transition`}
            style={{
              position: 'absolute',
              opacity: interpolated[key].opacity,
              transform: `scale(${interpolated[key].scale})`,
            }}
          >
            {interpolated[key].children}
          </div>
        )}
      </div>
    }
  </TransitionMotion>
);

RouteTransition.propTypes = {
  children: PropTypes.object.isRequired,
  pathname: PropTypes.string.isRequired,
};

export default RouteTransition;
