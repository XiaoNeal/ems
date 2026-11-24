
// 按需引入：全量 import 'crypto-js' 会把 DES/RC4/Rabbit/SHA1/SHA512 等未使用的算法
// 一起打进主包 vendor（小程序主包有 2MB 限制）。这里只取 AES + Base64/Utf8 编码。
//
// 关于 mode / padding：crypto-js 的 BlockCipher 默认 cfg 就是 CBC + Pkcs7
// （见 cipher-core 中 BlockCipher.cfg），且 4.2.0 没有独立的 mode-cbc.js /
// pad-pkcs7.js，它们内置在 cipher-core 里。因此这里不显式传 mode/padding，
// 与原写法 CryptoJS.mode.CBC + CryptoJS.pad.Pkcs7 完全等价（已用同一密钥
// 做过双向加解密对照验证）。
import AES from 'crypto-js/aes'
import Utf8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'

export function decrypt(content, password, ivpt) {
	try {
		let ciphertext = Base64.parse(content);
		let key = Utf8.parse('grnhygc201409050');
		let iv = Utf8.parse('grnhygc201409050');
		let decrypted = AES.decrypt({
			ciphertext: ciphertext
		}, key, {
			iv: iv
		});

		return decrypted.toString(Utf8);
	} catch (e) {
		return null;
	}
}

export function aesMinEncrypt(key, iv, word) {
	let _word = Utf8.parse(word)
	let _key = Utf8.parse(key)
	let _iv = Utf8.parse(iv)

	const encrypted = AES.encrypt(_word, _key, {
		iv: _iv
	})
	return encrypted.toString()
}
