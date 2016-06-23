import request from 'axios';
const BACKEND_URL = (env) => {
	return env ==='development' ? 'http://127.0.0.1:3000':  'http://127.0.0.1:8080';
};

export function createUser(user) {
	return {
		type: 'CREATE_USER',
		promise: (client) => client.post('/user', {
	      data: user
	    })
	}; 
}

export function initiatePasswordReset(email) {
	return {
		type: 'INITIATE_PASSWORD_RESET',
		promise: (client) => client.post('/resetpass', {
	      data: email
	    })
	};
}
 
export function deleteImage() {
	return {
		type: 'DELETE_IMAGE',
		promise: (client) => client.post('/resetImage')
	};
} 

export function resetPassword(credentials) {
	return {
		type: 'RESET_PASSWORD',
		promise: (client) => client.post(`/resetpass/${credentials.id}/${credentials.token}`)
	};
}

export function authenticateUser(credentials) {
	return {
		type: 'AUTH_USER',
		promise: (client) => client.post('/auth', {
	      data: credentials
	    })
	};
}

export function logoutUser() {
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

export function editUser(fields) {
	return {
		type: 'EDIT_USER',
		promise: (client) => client.put('/user', {
	      data: fields
	    })
	};
}

export function deleteUser(credentials) {
	return {
		type: 'DELETE_USER',
		promise: (client) => client.delete('/user', {
	      data: credentials
	    })
	};
}

export function cleanAuthMessage() {
	return {
		type: 'CLEAN_AUTH_MESSAGE'
	};
}

export function onboardMerchant(data) {
	return {
		type: 'ONBOARD_MERCHANT',
		promise: (client) => client.post('/merchant_onboard', {
			data: data
		})
	};
}

export function setAddressEditable(index, nextState) {
	return {
		type: 'SET_ADDRESS_EDITABLE',
		index: index,
		state: nextState
	};
}

export function changeAddress(index, key, value) {
	return {
		type: 'EDIT_ADDRESS',
		key: key,
		index: index,
		value: value
	};
}

export function revertAddress(oldAddress) {
	return {
		type: 'REVERT_ADDRESS',
		address: oldAddress
	};
}

export function addAddress() {
	return {
		type: 'ADD_ADDRESS'
	};
}

export function toggleAddressActive(index, state) {
	return {
		type: 'TOGGLE_ADDRESS_ACTIVE',
		index: index,
		state: state
	};
}

export function MtoggleAddressActive(delegateIndex,index, state) {
	return {
		type: 'TOGGLE_DELEGATE_ADDRESS_ACTIVE',
		dIndex: delegateIndex,
		index: index,
		state: state
	};
}

export function MsetAddressEditable(delegateIndex, index, state) {
	return {
		type: 'SET_DELEGATE_ADDRESS_EDITABLE',
		index: index,
		state: state,
		dIndex: delegateIndex
	};
}

export function MhandleAddressEdit(delegateIndex, addressIndex, key, value) {
	return {
		type: 'EDIT_DELEGATE_ADDRESS',
		dIndex: delegateIndex,
		index: addressIndex,
		key: key,
		value: value
	};
}

export function MaddAddress(dIndex) {
	return {
		type: 'ADD_DELEGATE_ADDRESS',
		dIndex: dIndex
	};
}

export function receiveSocket(socketID) {
  return {
    type: 'RECEIVE_SOCKET',
    socketID
  };
}
