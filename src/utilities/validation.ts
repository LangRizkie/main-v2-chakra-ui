const messages = {
	component_not_found: 'Component not found',
	does_not_match: 'Confirmation password does not match',
	length: 'Password must contain 8-50 characters long',
	lowercase: 'Password must contain lowercase letter (a-z)',
	number: 'Password must contain number (0-9)',
	repeat: 'Password must not repeating characters',
	required: 'This field is required',
	sequential: 'Password must not sequential characters',
	special: 'Password must contain special character',
	uppercase: 'Password must contain uppercase letter (A-Z)',
	username: 'Password cannot be matched with username'
}

const values = {
	length: 5,
	per: [5, 8, 10],
	start: 0
}

const regex = {
	alphabet: /^[A-Za-z]+$/,
	date: /^\d{4}\/\d{2}\/\d{2}$/,
	digit: /^\d+$/,
	length: /^.{8,50}$/,
	lowercase: /[a-z]/,
	number: /\d/,
	repeat: /(.+)\1+\1+/,
	sequential: /(?:abcdefghijklmnopqrstuvwxyz|0123456789)/i,
	special: /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,
	symbol: /[\W_]/,
	uppercase: /[A-Z]/
}

const getPasswordScore = (value: string) => {
	const check = [
		regex.lowercase.test(value),
		regex.uppercase.test(value),
		regex.number.test(value),
		regex.special.test(value)
	]

	const positive = check.filter(Boolean).length

	const length = !regex.length.test(value) ? -1 : 0
	const repeat = regex.repeat.test(value) ? -1 : 0
	const sequential = regex.sequential.test(value) ? -1 : 0

	return Math.max(0, Math.min(positive + length + repeat + sequential, 4))
}

const isJSON = (value: string) => {
	try {
		return !!JSON.parse(value)
	} catch {
		return false
	}
}

export { getPasswordScore, isJSON, messages, regex, values }
