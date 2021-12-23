'use strict';

var moment = require('moment')
const db = uniCloud.database()

const uniID = require('uni-id')

const { sendWxMiniMsg } = require('hello-common')

exports.main = async (event, context) => {
	
	//event为客户端上传的参数
	console.log('event : ', event)
	
	// const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
	// 	event,
	// 	context 
 //    })
	
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
	
	const db = uniCloud.database();
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	// let currenttimestr = dbJQL.env.now()
	
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
		
		let wishId = info.wishId
		let orderId = info.orderId
		
		let wishInfo
		let orderInfo
		let productTitle
		let creatUserId
		let agentUserId
		
		//获取心愿集合对象(如果有wishId)
		if(wishId) {
			
			const wishcollection = db.collection('wish')
			
			let wishres = await wishcollection
				.doc(wishId)
				.get()
			wishInfo = wishres.data[0]
			// let wishRes = db.collection('wish').doc(wishId).get({getOne: true})
			// if(wishRes.result.code == 0) {
			// 	wishInfo = wishRes.result.data
			// }
			productTitle = wishInfo.productList[0].title.substr(0,10) + '...' // 取心愿单首个商品的标题
			
			console.log(`获取的心愿详情`);
			console.log(wishInfo);
			
			creatUserId = wishInfo.creatUid
			agentUserId = wishInfo.agentUid

		}
		
		// 获取心愿订单对象(如果有orderId)
		if(orderId) {
			
			const wishcollection = db.collection('order')
			
			let orderres = await wishcollection
				.doc(orderId)
				.get()
			orderInfo = orderres.data[0]
			productTitle = orderInfo.productList[0].substr(0,10) + '...'
			
			console.log(`获取的订单详情`);
			console.log(orderInfo);
			
			creatUserId = orderInfo.creatUid
			agentUserId = orderInfo.agentUid
			
		}
		
		// 查找用户表中对应的微信openId
		let creatuserres = await uniID.getUserInfo({uid: creatUserId})
		let creatUserInfo = creatuserres.userInfo
		let creatUserWxOpenId = ''
		if(creatUserInfo.wx_openid && creatUserInfo.wx_openid['mp-weixin']) {
			creatUserWxOpenId = creatUserInfo.wx_openid['mp-weixin']
		}
		
		console.log(`获取的心愿的客户信息`);
		console.log(creatUserInfo);
		
		let agentUserInfo = {nickname: 'ThaiEasy'}
		let agentUserWxOpenId = ''
		if(agentUserId) {
			let agentuserres = await uniID.getUserInfo({uid: agentUserId})
			agentUserInfo = agentuserres.userInfo
			agentUserWxOpenId = ''
			if(agentUserInfo.wx_openid && agentUserInfo.wx_openid['mp-weixin']) {
				agentUserWxOpenId = agentUserInfo.wx_openid['mp-weixin']
			}
			
		}
		
		console.log(`获取的心愿的代理员信息`);
		console.log(agentUserInfo);
		
		
		// 开始发送消息
		
		// 代理员接单提醒(发送给客户)
		if(msgtype == 'agentbindwish') {
						
			template_id = 'aTdSoJyxsBld6VOHFZ6WnVU7h9pdZyq9mzRyiTkgJd8'
			touseropenid = creatUserWxOpenId // 发送用户微信openId
			let tips = `心愿已被接单-Agent accept`
			
			data = {
				thing7: {value: productTitle}, // 订单名称
				time4: {value: currenttimestr}, // 接单时间
				name13: {value: agentUserInfo.nickname}, // 接单人
				thing5: {value: tips} // 温馨提示
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 确认报价单消息(发送给客户)
		else if(msgtype == 'confirmquotation') {
			
			template_id = 'dMO7jl3o1lgYqd3PrcgALEu30xt6AYXc-xKFC8QFJqY'
			touseropenid = creatUserWxOpenId // 发送用户微信openId
			let tips = `心愿报价单更新-Quotation`
			
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
			let tips = `用户拒绝报价-User refuse`
			
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
			let tips = `用户同意报价-User agree`
			
			data = {
				thing2: {value: productTitle}, // 心愿标题
				thing12: {value: creatUserInfo.nickname}, // 名称
				time5: {value: currenttimestr}, // 操作时间
				thing8: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 客户完成支付(发送给代理员)
		else if(msgtype == 'finishpay') {
			
			template_id = 'YohhOYh5-nXQhDoOqTc-OQBdnp5_dxUU3q0aVtLmpoI'
			touseropenid = agentUserWxOpenId // 发送代理员微信openId
			let tips = `用户已付款-User paid`
			
			data = {
				thing2: {value: productTitle}, // 心愿标题
				character_string1: {value: orderInfo._id}, // 订单单号
				amount3: {value: `¥ ${orderInfo.totalOrderPrice}`}, // 订单金额
				thing7: {value: tips}, // 温馨提示
				time8: {value: currenttimestr}, // 推送时间
			}
			
			page = `/pages/order/orderdetail?orderId=${orderId}&ifShare=true`
			
			console.log(`模拟发送的消息体为:`);
			console.log(data);
			console.log(page);
			
		}
		
		// 截止此处...
		
		// 代理员下单(发送给客户)
		else if(msgtype == 'purchaseorder') {
			
			template_id = 'SiEZ87XeyqXepGhjYI94fTlDneG7iAtMYcQDuRlGncM'
			touseropenid = creatUserWxOpenId // 发送客户微信openId
			let tips = `代理已下单-Agent purchase`
			
			data = {
				character_string1: {value: orderInfo._id}, // 订单编号
				time2: {value: currenttimestr}, // 下单时间
				thing8: {value: productTitle}, // 心愿标题
				thing17: {value: agentUserInfo.nickname}, // 下单人
				thing5: {value: tips} // 备注
			}
			
			page = `/pages/wishlist/wishdetail?id=${info.wishId}&ifShare=true`
			
		}
		
		// 代理员确认发货(发送给客户)
		else if(msgtype == 'deliveryorder') {
			
			template_id = '7dzi8oH8BaVuvGEK-zl3n5bdQHthpU_0LuDnTmLIox8'
			touseropenid = creatUserWxOpenId // 发送客户微信openId
			let tips = `代理已发货-Order delivery`
			
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
			
			page = `/pages/product/category`
			
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
	
	// 翻译文本
	else if(type == 'translatecontent') {
		
		console.log(`调用翻译接口的参数为:`);
		console.log(info);
		
		let translateApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/translate.ac`
		const res = await uniCloud.httpclient.request(translateApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`base中获取到的翻译接口响应数据为`)
		console.log(res);
		if(res.status == 200 && res.data.errorCode == '000000') {
			let result = {
				code: 0,
				data: res.data.data
			}
			return result
		}
		else {
			let result = {
				code: res.data.errorCode,
				message: res.data.msg
			}
			return result
		}
		
	}
	
	return event
	
};
