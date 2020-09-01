// 获取版本号
function getVersion() {
  return '1.0.0'
}

// 获取当前时间字符串(是否到毫秒)
function getcurrenttimestr(ifmillisecond) {
	var now = new Date();
	var yy = now.getFullYear(); //年
	var mm = now.getMonth() + 1; //月
	var dd = now.getDate(); //日
	var hh = now.getHours(); //时
	var ii = now.getMinutes(); //分
	var ss = now.getSeconds(); //秒
	var sss = now.getMilliseconds(); // 毫秒
	var time = yy + "-";
	if (mm < 10) time += "0";
	time += mm + "-";
	if (dd < 10) time += "0";
	time += dd + " ";
	if (hh < 10) time += "0";
	time += hh + ":";
	if (ii < 10) time += '0';
	time += ii + ":";
	if (ss < 10) time += '0';
	// 是否获取到毫秒
	if(ifmillisecond) {
		time += ss + ":";
		if (sss < 10) time += '0';
		time += sss;
	}
	else {
		time += ss
	}
	
	return time
}


module.exports = {
	getVersion, // 获取版本号
	getcurrenttimestr, // 获取当前时间字符串
	
}