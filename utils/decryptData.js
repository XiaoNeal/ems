
import CryptoJS from 'crypto-js'
export function decrypt(content, password, ivpt) {
	try {
		let ciphertext = CryptoJS.enc.Base64.parse(content);
		let key = CryptoJS.enc.Utf8.parse('grnhygc201409050');
		let iv = CryptoJS.enc.Utf8.parse('grnhygc201409050');
		let decrypted = CryptoJS.AES.decrypt({
			ciphertext: ciphertext
		}, key, {
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
		});

		return decrypted.toString(CryptoJS.enc.Utf8);
	} catch (e) {
		return null;
	}
}

export function aesMinEncrypt(key, iv, word) {
	let _word = CryptoJS.enc.Utf8.parse(word)
	let _key = CryptoJS.enc.Utf8.parse(key)
	let _iv = CryptoJS.enc.Utf8.parse(iv)

	const encrypted = CryptoJS.AES.encrypt(_word, _key, {
		iv: _iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})
	return encrypted.toString()
}