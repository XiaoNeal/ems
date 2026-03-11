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