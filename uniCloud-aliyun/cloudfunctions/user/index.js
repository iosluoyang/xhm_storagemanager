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
	console.log(`user云函数获取到的token为${token}`);
	
	let uid = ''
	// 如果存在token的话则开始获取用户uid
	if(token) {
		let uidres = await uniIDIns.checkToken(token)
		// 获取返回错误的话直接返回该错误信息
		if(uidres.code != 0) {
			return uidres
		}
		uid = uidres.uid
	}
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// 用户注册
	if(type == 'register') {
		
		const res = await uniIDIns.register({
			username: info.account,
			password: info.password,
			role: info.role || [], // 注册时默认角色为空数组
			myInviteCode: info.invitecode || '', // 邀请码
		})
		
		console.log(`user云函数中用户注册返回的数据为`);
		console.log(res);
		
		// 用户注册成功之后设置用户的默认头像和昵称
		if(res.code == 0) {
			
			const updateres = await uniIDIns.updateUser({
				uid: res.uid, // 注册用户的uid
				avatar: `https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/ff3c957c-604a-4242-a965-007aa4005613.png`, // 设置默认的用户头像
				nickname: `User-${res.token.slice(-6)}` // 默认昵称为注册时返回的token后6位
			})
			console.log(`user云函数中用户注册后更新用户信息返回的数据为`);
			console.log(updateres);
			
		}
		
		return res
	}
	
	// 用户登录
	else if(type == 'login') {
		const res = await uniIDIns.login({
			username: info.account,
			password: info.password,
			queryField: ['username','email','mobile'] //指定从哪些字段中比对username（传入参数均为username），不填默认与数据库内的username字段对比, 可取值'username'、'email'、'mobile'
		})
		console.log(`user云函数中获取到的用户信息为`);
		console.log(res);
		
		// 注意此处返回的userInfo要去掉password字段
		if(res.userInfo && res.userInfo.password) {
			let newuserInfo = res.userInfo
			delete newuserInfo.password
			res.userInfo = newuserInfo
		}
		
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
		
		const res = await uniIDIns.unbindWeixin(uid)
		console.log(`user云函数中解绑微信的操作信息为`);
		console.log(res);
		return res
		
	}
	
	// 微信登录(未注册会自动注册)
	else if(type == 'wxlogin') {
		
		// 获取微信用户的openId
		const res = await uniIDIns.loginByWeixin({
			code: info.wxcode,
			myInviteCode: info.invitecode
		})
		
		console.log(`user云函数中微信登录的信息为`);
		console.log(res);
		
		// 注意此处返回的userInfo要去掉password字段
		if(res.userInfo && res.userInfo.password) {
			let newuserInfo = res.userInfo
			delete newuserInfo.password
			res.userInfo = newuserInfo
		}
		
		return res
		
	}
	
	// 获取用户个人信息
	else if(type == 'getuserinfo') {
		
		const res = await uniIDIns.getUserInfo({
			uid: uid
		})
		
		console.log(`user云函数中获取用户个人信息的结果为`);
		console.log(res);
		
		// 注意此处返回的userInfo要去掉password字段
		if(res.userInfo && res.userInfo.password) {
			let newuserInfo = res.userInfo
			delete newuserInfo.password
			res.userInfo = newuserInfo
		}
		
		return res
	}
	
};

