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
	
	let token = event.uniIdToken
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// 用户注册
	if(type == 'register') {
		const res = await uniIDIns.register({
			username: info.account,
			password: info.password
		})
		console.log(`user云函数中用户注册返回的数据为`);
		console.log(res);
		return res
	}
	
	// 用户登录
	else if(type == 'login') {
		const res = await uniIDIns.login({
			username: info.account,
			password: info.password
		})
		console.log(`user云函数中获取到的用户信息为`);
		console.log(res);
		return res
	}
	
	// 用户登出
	else if(type == 'logout') {
		const res = await uniIDIns.logout(token)
		console.log(`user云函数中用户退出信息为`);
		console.log(res);
		return res
	}
	
	// 获取微信openId
	else if(type == 'getwxopenid') {
		const res = await uniIDIns.code2SessionWeixin({
			code: info.wxcode
		})
		console.log(`user云函数中获取到的微信openid信息为`);
		console.log(res);
		return res
	}
	
	// 绑定微信
	else if(type == 'bindwx') {
		
		// 用户wxcode
		let wxcode = info.wxcode
		// 获取用户uid
		let uidres = await uniIDIns.checkToken(token)
		// 获取返回错误的话直接返回该错误信息
		if(uidres.code != 0) {
			return uidres
		}
		let uid = uidres.uid
		// let uid = info.uid
		let res = await uniIDIns.bindWeixin({
			uid: uid,
			code: wxcode
		})
		console.log(`user云函数中绑定微信的操作信息为`);
		console.log(res);
		return res
		
	}
	
	// 解绑微信
	else if(type == 'unbindwx') {
		
		// 获取用户uid
		let uidres = await uniIDIns.checkToken(token)
		// 获取返回错误的话直接返回该错误信息
		if(uidres.code != 0) {
			return uidres
		}
		let uid = uidres.uid
		// let uid = info.uid
		const res = await uniIDIns.unbindWeixin({
			uid: uid
		})
		console.log(`user云函数中解绑微信的操作信息为`);
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

