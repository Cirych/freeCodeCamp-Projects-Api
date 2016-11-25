const alphabet = "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"

const encode = alphabet => num => {
	let encoded = '',
		base = alphabet.length
	while (num) {
		let remainder = num % base
		num = Math.floor(num / base)
		encoded = alphabet[remainder].toString() + encoded
	}
	return encoded
}

const decode = alphabet => str => {
	let decoded = 0,
		base = alphabet.length
	while (str) {
		let index = alphabet.indexOf(str[0])
		let power = str.length - 1
		decoded += index * (Math.pow(base, power))
		str = str.substring(1)
	}
	return decoded
}

module.exports = {
	encode: encode(alphabet),
	decode: decode(alphabet)
}