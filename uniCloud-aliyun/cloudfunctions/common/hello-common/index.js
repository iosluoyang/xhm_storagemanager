
var moment = require('moment');

// get请求获取微信accesstoken
async function getWxAccessToken() {
	let appId = 'wx5d219092292308d7'
	let secret = 'b9b84c4c83aa9a3219c610d83f0d9cb1'
	let accessTokenApi = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`
	const res = await uniCloud.httpclient.request(accessTokenApi, {
	    method: 'GET',
	    contentType: 'json', // 指定以application/json发送data内的数据
	    dataType: 'json' // 指定返回值为json格式，自动进行parse
	  })
	console.log(`common中获取到的accessTokenApi的响应数据为`)
	console.log(JSON.stringify(res));
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	console.log(currenttimestr);
	return res && res.data && res.data.access_token ? res.data.access_token : ''
}

// 发送微信小程序订阅消息
async function sendWxMiniMsg() {
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	// let currenttimestr = '2021-04-19 15:50'
	// 首先获取accesstoken
	let accesstoken = await getWxAccessToken()
	// 调用post请求发送小程序订阅消息(订单变更)
	let orderchangetmpId = 'dMO7jl3o1lgYqd3PrcgALPn_1s87YUdwZXcsorRpx5U'
	let wishid = '607ce716c9c9b90001439457'
	let page = `pages/wishlist/wishdetail?id=${wishid}`
	let sendMsgApi = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accesstoken}`
	let res = await uniCloud.httpclient.request(sendMsgApi, {
		method: 'POST',
		data: {
			access_token: accesstoken, // 接口调用凭证
			touser: '', // 接收者（用户）的 openid
			template_id: orderchangetmpId, // 所需下发的订阅模板id
			"page": page, // 小程序跳转的页面
			data: {
				/*
				订单标题{{thing2.DATA}}
				订单状态{{phrase3.DATA}}
				订单备注{{thing4.DATA}}
				操作时间{{time5.DATA}}
				温馨提示{{thing8.DATA}}
				*/
			   "thing2": "我是订单标题",
			   "phrase": "待确认",
			   "thing4": "总金额为300元,国内运费为20元",
			   "time5": currenttimestr,
			   "thing8": "订单状态变更,请尽快确认"
			},
			/*
			跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
			*/
			miniprogram_state: "developer",
			/*
			进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
			*/
			lang: 'en_US'
		},
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	
	// 接口调用成功
	if(res.status == 200) {
		let data = res.data
		console.log(`获取到的返回数据为:${JSON.stringify(data)}`);
	}
	else {
		console.log(`发送订阅消息失败`);
	}

}


module.exports = {
	getWxAccessToken,
	sendWxMiniMsg,
}
