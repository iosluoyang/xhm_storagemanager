// 基础的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取配置信息 
function getconfig(data){
	if (data && data.request) {
		return flyrequest.newfly.request('/app/config/list.do',data)
	}
	return flyrequest.fly.request('/app/config/list.do',data)
}

// 获取OSS文件直传的签名信息
function getosssignature(data){
	return flyrequest.fly.request('/aliyunsts/app/token/h5token.do',data)
}


// 获取用户工作时间
function getworkingtime(data){
	return flyrequest.fly.request('/app/user/getWorkingDays.do',data)
}

// 设置用户工作时间
function setworkingtime(data){
	return flyrequest.fly.request('/app/user/setWorkingDays.do',data)
}

export default {
	
	getconfig,
	getosssignature,
	getworkingtime,
	setworkingtime
	
}