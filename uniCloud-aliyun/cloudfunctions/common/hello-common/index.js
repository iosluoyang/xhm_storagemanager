
var moment = require('moment');
let appId = 'wx5d219092292308d7'
let secret = 'b9b84c4c83aa9a3219c610d83f0d9cb1'

// get请求获取微信用户openId
async function getWxOpenIdByCode(code) {
	
	let openIdApi = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
	const res = await uniCloud.httpclient.request(openIdApi, {
	    method: 'GET',
	    contentType: 'json', // 指定以application/json发送data内的数据
	    dataType: 'json' // 指定返回值为json格式，自动进行parse
	  })
	console.log(`common中获取到的openIdApi的响应数据为`)
	console.log(JSON.stringify(res));
	return res && res.data && res.data.openid ? res.data.openid : ''
	
}

// get请求获取微信accesstoken
async function getWxAccessToken() {
	let accessTokenApi = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`
	const res = await uniCloud.httpclient.request(accessTokenApi, {
	    method: 'GET',
	    contentType: 'json', // 指定以application/json发送data内的数据
	    dataType: 'json' // 指定返回值为json格式，自动进行parse
	  })
	console.log(`common中获取到的accessTokenApi的响应数据为`)
	console.log(JSON.stringify(res));
	return res && res.data && res.data.access_token ? res.data.access_token : ''
}

// 发送微信小程序订阅消息
async function sendWxMiniMsg(param) {
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	// 首先获取accesstoken
	let accesstoken = await getWxAccessToken()
	let sendMsgApi = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accesstoken}`
	let res = await uniCloud.httpclient.request(sendMsgApi, {
		method: 'POST',
		data: {
			access_token: accesstoken, // 接口调用凭证
			touser: param.touser, // 接收者（用户）的 openid
			template_id: param.template_id, // 所需下发的订阅模板id
			page: param.page, // 小程序跳转的页面
			data: param.data, // 消息体的数据
			/*
			跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			*/
			miniprogram_state: "trial",
			/*
			进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
			*/
			lang: 'en_US'
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	
	console.log(`hello-common中sendWxMiniMsg的返回结果为:`);
	console.log(res);
	
	// 接口调用成功
	if(res.status == 200 && res.data.errcode == 0) {
		let data = res.data
		console.log(`获取到的返回数据为:${JSON.stringify(data)}`);
		res = {
			errCode: 0,
			message: "发送消息成功"
		}
	}
	else {
		console.log(`发送订阅消息失败`);
		console.log(res.data.errmsg);
		res = {
			errCode: res.data.errcode,
			message: res.data.errmsg
		}
	}
	
	return res

}

module.exports = {
	getWxOpenIdByCode,
	getWxAccessToken,
	sendWxMiniMsg,
}
