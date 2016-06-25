import Immutable from 'immutable';

const defaultState = Immutable.Map({
  isActive: false,
  caption: '',
  links: []
});

const MenuReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return state.set('isActive', !state.get('isActive'));
    case 'SET_LINKS':
      return state.set('links', action.links || state.get('links'));
    default:
      return state;
  }
};

export default MenuReducer;