'use strict';

var moment = require('moment')
const db = uniCloud.database()

const uniID = require('uni-id')

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
	
	//获取集合对象
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
		context: context
	})
	
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
				
		//获取集合对象
		const wishcollection = db.collection('wishlist')
		let wishId = info.wishId
		let wishres = await wishcollection
			.doc(wishId)
			// .field({'productTitle': true, 'creatUser': true, 'agentUser': true})
			.get()
		let wishInfo = wishres.data[0]
		let productTitle = wishInfo.productTitle
		productTitle = productTitle.substr(0,10) + '...'
		
		console.log(wishInfo);
		
		let creatUserId = wishInfo.creatUser
		let agentUserId = wishInfo.agentUser
		
		// 查找用户表中对应的微信openId
		let creatuserres = await uniID.getUserInfo({uid: creatUserId})
		let creatUserInfo = creatuserres.userInfo
		let creatUserWxOpenId = ''
		if(creatUserInfo.wx_openid && creatUserInfo.wx_openid['mp-weixin']) {
			creatUserWxOpenId = creatUserInfo.wx_openid['mp-weixin']
		}
		
		let agentuserres = await uniID.getUserInfo({uid: agentUserId})
		let agentUserInfo = agentuserres.userInfo
		let agentUserWxOpenId = ''
		if(agentUserInfo.wx_openid && agentUserInfo.wx_openid['mp-weixin']) {
			agentUserWxOpenId = agentUserInfo.wx_openid['mp-weixin']
		}
		
		// 代理员接单提醒
		if(msgtype == 'agentbindwish') {
						
			template_id = 'aTdSoJyxsBld6VOHFZ6WnVU7h9pdZyq9mzRyiTkgJd8'
			touseropenid = creatUserWxOpenId // 发送用户微信openId
			let tips = `该心愿已被接单,代理员将尽快为您处理`
			
			data = {
				thing7: {value: productTitle}, // 订单名称
				time4: {value: currenttimestr}, // 接单时间
				name13: {value: agentUserInfo.nickname}, // 接单人
				thing5: {value: tips} // 温馨提示
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 确认报价单消息
		else if(msgtype == 'confirmquotation') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALEu30xt6AYXc-xKFC8QFJqY'
			touseropenid = creatUserWxOpenId // 发送用户微信openId
			let tips = `该心愿报价单更新,请尽快确认`
			
			data = {
				thing2: {value: productTitle}, // 心愿标题
				thing12: {value: agentUserInfo.nickname}, // 代理员名称
				time5: {value: currenttimestr}, // 操作时间
				thing8: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 客户拒绝报价单(发送给代理员)
		else if(msgtype == 'refusequotation') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALEu30xt6AYXc-xKFC8QFJqY'
			touseropenid = agentUserWxOpenId // 发送代理员微信openId
			let tips = `用户拒绝了该报价单,请点击查看`
			
			data = {
				thing2: {value: productTitle}, // 心愿标题
				thing12: {value: creatUserInfo.nickname}, // 名称
				time5: {value: currenttimestr}, // 操作时间
				thing8: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 客户同意报价单(发送给代理员)
		else if(msgtype == 'agreequotation') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALEu30xt6AYXc-xKFC8QFJqY'
			touseropenid = agentUserWxOpenId // 发送代理员微信openId
			let tips = `用户同意了该报价单,请尽快处理`
			
			data = {
				thing2: {value: productTitle}, // 心愿标题
				thing12: {value: creatUserInfo.nickname}, // 名称
				time5: {value: currenttimestr}, // 操作时间
				thing8: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 代理员确认发货(发送给客户)
		else if(msgtype == 'deliveryorder') {
			
			template_id = '7dzi8oH8BaVuvGEK-zl3n5bdQHthpU_0LuDnTmLIox8'
			touseropenid = creatUserWxOpenId // 发送客户微信openId
			let tips = `代理员已经发货,请耐心等待货物到达`
			
			data = {
				time11: {value: currenttimestr}, // 发货时间
				thing2: {value: productTitle}, // 心愿标题
				thing10: {value: 'LAL Express'}, // 快递公司
				character_string12: {value: wishId.substr(-10,10)}, // 快递单号
				thing5: {value: tips} // 备注
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
