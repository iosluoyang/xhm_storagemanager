// 公告相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取首页公告
function gethomenotice(data){
	return flyrequest.fly.request('/app/notice/homeNotice.do',data)
}

//获取公告列表
function getnoticelist(data){
	return flyrequest.fly.request('/app/notice/list.do',data)
}

//新增公告
function addnotice(data){
	return flyrequest.fly.request('/app/notice/add.do',data)
}

//编辑公告
function editnotice(data){
	return flyrequest.fly.request('/app/notice/modify.do',data)
}

//删除公告
function deletenotice(data){
	return flyrequest.fly.request('/app/notice/del.do',data)
}

//公告详情
function noticedetail(data){
	return flyrequest.fly.request('/app/notice/detail.do',data)
}

export default {
	
	gethomenotice,
	getnoticelist,
	addnotice,
	editnotice,
	deletenotice,
	noticedetail,
	
}