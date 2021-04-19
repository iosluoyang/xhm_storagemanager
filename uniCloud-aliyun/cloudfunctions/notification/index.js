'use strict';

var moment = require('moment')
const db = uniCloud.database()

const { getWxAccessToken,sendWxMiniMsg } = require('hello-common')

exports.main = async (event, context) => {
	
	//event为客户端上传的参数
	console.log('客户端上传到的参数为: ', event)
	
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	
	//获取集合对象
	const collection = db.collection('notification')
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// add 新增公告
	if(type == 'add') {
		// 写入公告集合数据
		let data = {
			content: info.content,
			createDate: currenttimestr
		}
		let res = await collection.add(data)
		return res
	}
	
	// edit 编辑公告
	else if(type == 'edit') {
		let docid = info._id
		let res = await collection.doc(docid).update({
			content: info.content,
		});
		return res
	}
	
	// edit 删除公告
	else if(type == 'delete') {
		let docid = info._id
		let res = await collection.doc(docid).remove()
		return res
	}
	
	// getdetail 获取公告详情
	else if(type == 'getdetail') {
		let docid = info._id
		let res = await collection.doc(docid).get()
		return res
	}
	
	// getlist 分页查询所有的公告列表
	else if(type == 'getlist') {
		
		let accesstoken = getWxAccessToken()
		console.log(`accesstoken = ${accesstoken}`);
		// 发送微信订阅消息
		sendWxMiniMsg()
		
		let date = info.date
		let pageSize = info.pageSize
		let pageNum = info.pageNum
		let skipdataNum = pageSize * (pageNum - 1)
		
		let res = await collection.orderBy("_id", "desc").skip(skipdataNum).limit(pageSize).get()
		// 如果date有值则返回原先date的值 如果date没有值则返回当前的时间字符串
		let newdate = date ? date : currenttimestr
		res.date = newdate
		return res
		
		// // 倒叙返回所有的数据
		// let res = await collection.orderBy("_id", "desc").get()
		// //返回数据给客户端
		// return res
	}
	
	// getnewest 查询最新一条公告
	else if(type == 'getnewest') {
		// 倒叙返回最新的一条数据
		let res = await collection.orderBy("_id", "desc").limit(1).get()
		return res
	}
	
	
	
};
