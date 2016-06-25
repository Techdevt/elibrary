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