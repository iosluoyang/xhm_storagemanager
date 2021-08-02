'use strict';
var moment = require('moment')

const db = uniCloud.database()
const dbCmd = db.command // 数据库指令

const uniID = require('uni-id')

exports.main = async (event, context) => {
	//event为客户端上传的参数
	
	//获取集合对象	
	const uniIDIns = uniID.createInstance({ // 创建uni-id实例，其上方法同uniID
		context: context
	})
	
	let token = event.uniIdToken
	console.log(`wishlist云函数获取到的token为${token}`);
	
	let uid = ''
	// 如果存在token的话则开始获取用户uid
	if(token) {
		let uidres = await uniIDIns.checkToken(token)
		// 获取返回错误的话直接返回该错误信息
		if(uidres.code != 0) {
			return uidres
		}
		uid = uidres.uid
		console.log(`wishlist云函数获取到的uid为${uid}`);
	}
		
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	
	//获取集合对象
	const collection = db.collection('wishlist')
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	if(type == 'getlinkprocategory') {
		
		// 如果翻译语种为zh的话则替换为cn
		if(info.lang == 'zh') {info.lang = 'cn'}
		
		let productCategoryApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/types.ac`
		const res = await uniCloud.httpclient.request(productCategoryApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`wishlist中获取到的1688分类api的响应数据为`)
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
	
	// getlinkprolist 获取链接商品列表
	else if(type == 'getlinkprolist') {
		
		console.log(`获取分类的参数为`);
		console.log(info);
		let productListApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/productsearch1688.ac`
		const res = await uniCloud.httpclient.request(productListApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`wishlist中获取到的1688商品列表api的响应数据为`)
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
	
	// getlinkdetail 获取链接商品的详情
	else if(type == 'getlinkdetail') {
		
		let linkApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/productdetail1688.ac`
		let text = info.text
		let thirdPid = info.thirdPid
		console.log(`参数为:text->${text}  thirdPid->${thirdPid}`);
		const res = await uniCloud.httpclient.request(linkApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`wishlist中获取到的1688api商品详情的响应数据为`)
		console.log(res);
		if(res.status == 200 && res.data && res.data.errorCode == '000000') {
			
			let data = res.data.data
			
			// 查询当前商品是否被查询用户收藏
			let favorFlag = 0 // 默认为未收藏
			// 如果用户登录则开始查询
			if(uid) {
				let favorcollection = db.collection('favorpro')
				let favorres =  await favorcollection.where({creatUser: uid, thirdPid: data.product.thirdPid}).get({getOne: true})
				console.log(`查询收藏表的数据为:`);
				console.log(favorres);
				if(favorres.affectedDocs > 0) {
					// 找到了收藏表中的数据 则为已收藏状态
					favorFlag = 1
				}
			}
			
			// 写入收藏字段
			let newData = {...data}
			newData.product['favorFlag'] = favorFlag
			
			let result = {
				code: 0,
				data: newData
			}
			
			// 尝试将第三方商品数据入库
			try{
				
				// 将当前查询出来的第三方商品信息入1688商品数据库
				let thirdProductInfo = data.product
				let pid = thirdProductInfo.pid
				let thirdPid = thirdProductInfo.thirdPid
				const linkproductcollection = db.collection('linkproduct1688')
				let linkprockres = await linkproductcollection.doc(thirdPid).set(thirdProductInfo)
				console.log(`第三方商品入库回调为:`);
				console.log(linkprockres);
				
			}catch(e){
				//TODO handle the exception
				console.log(`第三方商品入库回调失败,原因为`);
				console.log(e);
			}finally{
				return result
			}
			
		}
		else {
			let result = {
				code: res.data.errorCode,
				message: res.data.msg
			}
			return result
		}
	}
	
	// gettranslateattribute 获取链接商品属性翻译版本
	else if(type == 'gettranslateattribute') {
		
		console.log(`获取翻译的属性数组为`);
		// 如果翻译语种为zh的话则替换为cn
		if(info.lang == 'zh') {info.lang = 'cn'}
		
		let productAttributeTranslateApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/productAttributeTranslate.ac`
		const res = await uniCloud.httpclient.request(productAttributeTranslateApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`wishlist中获取到的1688商品属性翻译版本api的响应数据为`)
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
	
	// gettranslatecategory 获取商品分类翻译版本
	else if(type == 'gettranslatecategory') {
		
		// 如果翻译语种为zh的话则替换为cn
		if(info.lang == 'zh') {info.lang = 'cn'}
		
		let productCategoryTranslateApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/productCategoryTranslate.ac`
		const res = await uniCloud.httpclient.request(productCategoryTranslateApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify(info)
			},
			dataAsQueryString: true, // 是否强制转换data为queryString
			// nestedQuerystring: true, // 转换data为queryString时默认不支持嵌套Object，此选项设置为true则支持转换嵌套Object
		    contentType: 'json', // 指定以application/json发送data内的数据
		    dataType: 'json', // 指定返回值为json格式，自动进行parse
		})
		console.log(`wishlist中获取到的1688商品分类翻译版本api的响应数据为`)
		console.log(res);
		if(res.status == 200 && res.data.errorCode == '000000') {
			let result = {
				code: 0,
				data: res.data.data
			}
			return result
		}
		else if (res.status == 404) {
			let result = {
				code: 404,
				message: res.data.message
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
	
};
