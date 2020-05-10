// 用户相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

//获取人员列表
function getmemberlist(data){
	return flyrequest.fly.request('/app/user/list.do',data)
}

//新增人员
function addmember(data){
	return flyrequest.fly.request('/app/user/add.do',data)
}

//编辑人员
function editmember(data){
	return flyrequest.fly.request('/app/user/edit.do',data)
}

//冻结/解冻人员
function freezemember(data){
	return flyrequest.fly.request('/app/user/freeze.do',data)
}

//重置人员密码
function resetmemberpwd(data){
	return flyrequest.fly.request('/app/user/resetPwd.do',data)
}

//删除人员
function deletemember(data){
	return flyrequest.fly.request('/app/user/del.do',data)
}

export default {
	
	getmemberlist,
	addmember,
	editmember,
	freezemember,
	resetmemberpwd,
	deletemember,
	
	
}