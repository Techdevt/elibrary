export function logout() {
	return function(dispatch) {
		logoutBackend().then(
			(data) => {
				dispatch(logoutSuccess(data));
				window.location.replace('/');
				//@todo::clear user contents from all reducers
			}
		).catch(err => {
			console.log(err.message);
		});
	}
}

export function logoutSuccess(data) {
	window.localStorage.removeItem('token');
	
	return {
		type: 'LOGOUT_SUCCESS',
		res: data
	};
}

export function logoutBackend() {
	const env = process.env.NODE_ENV;
	return request.post(`/logout`);
}