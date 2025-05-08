const onLoad = async (instance) => {
	const match = document.cookie.match(new RegExp('(^| )' + 'credential' + '=([^;]+)'))
	if (match && match[2]) return await instance.render()
}

window.watsonAssistantChatOptions = {
	headerConfig: { showRestartButton: true },
	integrationID: 'f9ba58e2-aeb0-402b-84b9-0b2c7efc6b82',
	onLoad: onLoad,
	region: 'aws-us-east-1',
	serviceInstanceID: '20250506-1235-3221-60e3-a3cbd59f31c4'
}

setTimeout(() => {
	const t = document.createElement('script')
	const source = [
		'https://web-chat.global.assistant.watson.appdomain.cloud/versions/',
		window.watsonAssistantChatOptions.clientVersion || 'latest',
		'/WatsonAssistantChatEntry.js'
	].join('')

	t.src = source
	document.head.appendChild(t)
})
