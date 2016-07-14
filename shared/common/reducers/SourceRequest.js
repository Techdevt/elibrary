import Immutable from 'immutable';

const sourceRequest = Immutable.Map({
  host: '',
  protocol: '',
});

const sourceReducer = (state = sourceRequest, action) => {
  switch (action.type) {
    default: return state;
  }
};

export default sourceReducer;
