export function downloadFile(path) {
	return {
		type: 'DOWNLOAD',
		promise: (client) => client.get(`/download?path=${path}`)
	};
}