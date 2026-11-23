export function determineDeviceType(data){
	let result
	switch (+data){
		case 86:
		result = {id:86,typeName:'智能储能柜',agreementId:1702}
			break;
		default:
			break;
	}
	return result;
}

/**
 * 设备类型码是否有效、可交给 DeviceFactory.create 解析。
 *
 * 服务端对「未配置协议类型」的设备会下发 typeCode/deviceType = -1（数字或字符串 '-1'），
 * 这类占位码在工厂 switch 里没有分支，会打印「未知 deviceType」并且不生成模型，
 * 导致该设备永远收不到实时数据。因此必须在注册链路最前端拦掉。
 *
 * @param {*} value 单个类型码或类型码数组（报文侧允许下发多个候选值）
 * @returns {boolean}
 */
export function isUsableDeviceType(value) {
	if (value == null) return false
	const list = Array.isArray(value) ? value : [value]
	return list.some(item => {
		const code = String(item == null ? '' : item).trim()
		// '-1' / '0' / 空串都是占位值；合法类型码为 4 位十六进制码，可带版本后缀（171F_V2、0318V2_3）
		if (!code || code === '-1' || code === '0') return false
		return /^[0-9a-zA-Z_]+$/.test(code)
	})
}

/**
 * 从一条设备配置里取出第一个可用的类型码。
 * 优先 typeCode，其次 deviceType，最后 rawDeviceType；全部为占位值时返回 ''。
 *
 * @param {Object} item 设备配置项
 * @returns {string} 归一化后的类型码字符串
 */
export function resolveDeviceTypeCode(item) {
	if (!item) return ''
	const candidates = [item.typeCode, item.deviceType, item.rawDeviceType]
	for (const candidate of candidates) {
		if (candidate == null) continue
		const list = Array.isArray(candidate) ? candidate : [candidate]
		for (const value of list) {
			const code = String(value == null ? '' : value).trim()
			if (isUsableDeviceType(code)) return code
		}
	}
	return ''
}