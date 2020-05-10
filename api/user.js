// 用户相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'
import store from '@/store/index.js'

//用户注册
function register(data){
	return flyrequest.fly.request('/app/user/register.do',data)
}

//用户登录
function login(data){
	return flyrequest.fly.request('/app/user/login.do',data)
}

//用户登出
function logout(){
	return flyrequest.fly.request('/app/user/logout.do')
}

//用户修改密码
function modifypwd(data){
	return flyrequest.fly.request('/app/user/modifyPwd.do',data)
}

//获取用户个人资料
function getuserdetail(){
	return flyrequest.fly.request('/app/user/detail.do')
}

//修改用户个人资料
function modifyuserdetail(data){
	return flyrequest.fly.request('/app/user/modify.do',data)
}

// 刷新token
function refreshtoken(){
	
	if (data && data.request) {
		return flyrequest.newfly.request('/app/token/refreshToken.do',null,{
			headers: { 'refreshToken': store.getters.refreshToken } // 只有调用refreshToken接口的时候才传refreshToken的字段 其余接口均忽略
		})
	}
	
	return flyrequest.fly.request('/app/token/refreshToken.do',null,{
		headers: { 'refreshToken': store.getters.refreshToken } // 只有调用refreshToken接口的时候才传refreshToken的字段 其余接口均忽略
	})
}










//用户忘记密码
function forgetpwd(data){
	return flyrequest.fly.request('/app/user/forgotPwd.do',data)
}

//用户第三方登录成功绑定手机号
function bindsocialmediaaccount(data){
	return flyrequest.fly.request('/app/user/bindPhone.do',data)
}

//用户身份验证
function authenticate(data){
	return flyrequest.fly.request('/app/user/auth.do',data)
}

//用户更换手机号
function changephonenum(data){
	return flyrequest.fly.request('/app/user/changePhone.do',data)
}




export default {
	
	register,
	login,
	logout,
	modifypwd,
	getuserdetail,
	modifyuserdetail,
	refreshtoken,
	
	
}