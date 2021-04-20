'use strict';

var moment = require('moment')
const db = uniCloud.database()

const uniID = require('uni-id')

exports.main = async (event, context) => {
	
	//event为客户端上传的参数
	console.log('客户端上传到的参数为: ', event)
	
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	
	//获取集合对象
	const collection = db.collection('uni-id-users')
	
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
		context: context
	})
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// 用户登录
	if(type == 'login') {
		const res = await uniIDIns.login({
			username: info.account,
			password: info.password
		})
		console.log(`user云函数中获取到的用户信息为`);
		console.log(res);
		return res
	}
	// 微信登录(未注册会自动注册)
	else if(type == 'wxlogin') {
		
		// 获取微信用户的openId
		const res = await uniIDIns.loginByWeixin({
			code: info.wxcode
		})
		
		console.log(res);
		return res
	}
	
};

