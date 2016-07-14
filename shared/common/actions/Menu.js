export function setLinks(links) {
  return {
    type: 'SET_LINKS',
    links,
  };
}

export function toggleMenu(links) {
  return dispatch => {
    if (links) {
      dispatch(setLinks(links));
    }

    dispatch({
      type: 'TOGGLE_MENU',
    });
  };
}
