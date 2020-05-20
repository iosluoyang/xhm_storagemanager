// 客户相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

//获取客户列表
function getcustomerlist(data){
	return flyrequest.fly.request('/app/customer/list.do',data)
}

//新增客户
function addcustomer(data){
	return flyrequest.fly.request('/app/customer/add.do',data)
}

//编辑客户
function editcustomer(data){
	return flyrequest.fly.request('/app/customer/modify.do',data)
}

//删除人员
function deletecustomer(data){
	return flyrequest.fly.request('/app/customer/del.do',data)
}

//客户详情
function customerdetail(data){
	return flyrequest.fly.request('/app/customer/detail.do',data)
}

export default {
	
	getcustomerlist,
	addcustomer,
	editcustomer,
	deletecustomer,
	customerdetail,
	
}