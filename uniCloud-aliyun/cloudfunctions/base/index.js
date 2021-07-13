'use strict';

var moment = require('moment')
const db = uniCloud.database()

const { getWxAccessToken,sendWxMiniMsg } = require('hello-common')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	
	//context中可获取客户端调用的上下文
	let clientIP = context.CLIENTIP // 客户端ip信息
	let clientUA = context.CLIENTUA // 客户端user-agent
	let spaceInfo = context.SPACEINFO // 当前环境信息 {spaceId:'xxx',provider:'tencent'}
	// 以下四个属性只有使用uni-app以callFunction方式调用才能获取
	let os = context.OS //客户端操作系统，返回值：android、ios    等
	let platform = context.PLATFORM //运行平台，返回值为 mp-weixin、app-plus等
	let appid = context.APPID // manifest.json中配置的appid
	let deviceId = context.DEVICEID // 客户端标识，新增于HBuilderX 3.1.0，同uni-app客户端getSystemInfo接口获取的deviceId
	// console.log(`clientIP:${clientIP}\nclientUA:${clientUA}\nos:${os}\nplatform:${platform}\nappid:${appid}\ndeviceId:${deviceId}`);
	
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	
	// 发送微信消息
	if(type == 'sendwxmsg') {
		
		// 发送类型
		let msgtype = info.msgtype
		let touseropenid = 'o89E541Xo_81C8xIdjDROd9AlgEw'
		let template_id = ''
		let data = {}
		let page = ''
		
		if(info.productTitle) {
			info.productTitle = info.productTitle.substr(0,10) + '...'
		}
		
		// 代理员接单提醒
		if(msgtype == 'agentbindwish') {
			
			template_id = 'aTdSoJyxsBld6VOHFZ6WnVU7h9pdZyq9mzRyiTkgJd8'
			let tips = `该心愿已被接单,代理员将尽快为您处理`
			
			data = {
				thing7: {value: info.productTitle}, // 订单名称
				time4: {value: currenttimestr}, // 接单时间
				name13: {value: info.agentUserName || '代理人'}, // 接单人
				thing5: {value: tips} // 温馨提示
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 确认报价单消息
		if(msgtype == 'confirmquotation') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALEu30xt6AYXc-xKFC8QFJqY'
			let tips = `该心愿报价单更新,请尽快确认`
			
			data = {
				thing2: {value: info.productTitle}, // 心愿标题
				thing12: {value: info.agentUserName}, // 代理员名称
				time5: {value: currenttimestr}, // 操作时间
				thing8: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 订单提醒
		else if(msgtype == '123') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALPn_1s87YUdwZXcsorRpx5U'
			
			data = {
				/*
				订单标题{{thing2.DATA}}
				订单状态{{phrase3.DATA}}
				订单备注{{thing4.DATA}}
				操作时间{{time5.DATA}}
				温馨提示{{thing8.DATA}}
				*/
			   thing2: {value: "我是订单标题"},
			   phrase3: {value: "待确认"},
			   thing4: {value: "总金额为300元,国内运费为20元"},
			   time5: {value: currenttimestr},
			   thing8: {value: "订单状态变更,请尽快确认"}
			},
			
			page = `/pages/wishlist/linkprocategory`
			
		}
		
		let param = {
			touser: touseropenid,
			template_id: template_id,
			page: page,
			data: data
		}
		
		let res = sendWxMiniMsg(param)
		
		return res
		
	}
	
	return event
	
};
