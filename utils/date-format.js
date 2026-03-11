
export function dateStandardFormat(date) {
	let yy = date.getFullYear();
	let mm = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
	let dd = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
	return yy + "-" + mm + "-" + dd;
}

export function dateFormatTime(date) {
	let year = date.getFullYear().toString();
	let months
	let month = (date.getMonth() + 1);
	let days
	let day = date.getDate();
	let hour = date.getHours();
	let hours;
	let minute = date.getMinutes();
	let minutes;
	let second = date.getSeconds();
	let seconds;
	if (month >= 10) {
		months = month.toString()
	} else {
		months = '0' + month.toString()
	}
	if (day >= 10) {
		days = day.toString()
	} else {
		days = '0' + day.toString()
	}
	if (hour >= 10) {
		hours = hour.toString();
	} else {
		hours = '0' + hour.toString();
	}
	if (minute >= 10) {
		minutes = minute.toString();
	} else {
		minutes = '0' + minute.toString();
	}
	if (second >= 10) {
		seconds = second.toString();
	} else {
		seconds = '0' + second.toString();
	}
	
	return year + '-' + months + '-' + days + ' ' + hours + ":" + minutes + ":" + seconds;
}

export function dateMonthFormat(date) {
	let yy = date.getFullYear();
	let mm = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
	return yy + "-" + mm;
}