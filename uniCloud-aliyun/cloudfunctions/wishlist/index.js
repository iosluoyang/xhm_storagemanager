'use strict';
var moment = require('moment')

const db = uniCloud.database()
const dbCmd = db.command // 数据库指令

const { translateContent } = require('hello-common')


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
	
	// add 新增心愿单
	if(type == 'add') {
		// 写入心愿单集合数据
		let otherdata = {
			achieveFlag: 0, // 设置心愿单完成状态为否  achieveFlag  0进行中 1待确认 2已完成
			previewCount: 1, // 设置浏览数量为1
			commentCount: 1, // 设置评论数量为1
			creatTime: currenttimestr, // 当前新增的时间字符串,
			creatUid: uid, // 写入发布人uid
		}
		
		let data = {...info,...otherdata}
		let wishlistres = await collection.add(data)
		// 添加心愿单时间轴的两条数据
		const wishlisttimelinecollecton = db.collection('wishlisttimeline')
		// 1.心愿单开始
		let timelinestartdata = {
			wishId: wishlistres.id,
			creatTime: currenttimestr,
			user: info.user,
			content: '',
			type: 0, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
		}
		// 2.心愿单第一条评论(取备注字段)
		//注意这里新增心愿单的时候将时间轴开始时间+1秒作为第一个普通评论的时间轴,否则会造成查询结果有误
		let firsttimelinenormaldatacreatetime = moment(currenttimestr).add(1,'s').format('YYYY-MM-DD HH:mm:ss')
		let timelinenoramldata = {
			wishId: wishlistres.id,
			creatTime: firsttimelinenormaldatacreatetime,
			user: info.user,
			content: info.remark || '',
			imgs: '',
			type: 1, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
		}
		// 当第一条时间轴数据有内容时才进行添加 否则不进行添加
		let adddataArr = timelinenoramldata.content == '' ? [timelinestartdata] : [timelinestartdata,timelinenoramldata]
		await wishlisttimelinecollecton.add(adddataArr)
		
		return wishlistres
	}
	
	// edit 编辑心愿单
	else if(type == 'edit') {
		
		let docid = info._id
		
		// 新增一条编辑时间轴记录
		const wishlisttimelinecollecton = db.collection('wishlisttimeline')
		let edittimelinedata = {
			wishId: docid,
			editUser: info.user,
			creatTime: currenttimestr,
			type: 2
		}
		await wishlisttimelinecollecton.add(edittimelinedata)
		
		// 编辑心愿单集合数据
		let otherdata = {
			achieveFlag: 0, // achieveFlag  0进行中 1待确认 2已完成
			editTime: currenttimestr, // 更新当前心愿单的编辑时间为最新的当前时间
		}
		let updateinfo = {...info,...otherdata}
		delete updateinfo._id // 删除_id属性 不能更新_id字段
		let res = await collection.doc(docid).update(updateinfo);
		return res
		
	}
	
	// edit 删除心愿单
	else if(type == 'delete') {
		let docid = info._id
		let res = await collection.doc(docid).remove()
		return res
	}
	
	// getdetail 获取心愿单详情
	else if(type == 'getdetail') {
		let docid = info._id
		await collection.doc(docid).update({
			previewCount: dbCmd.inc(1) // 将该心愿单的浏览次数自增1返回
		})
		let res = await collection.doc(docid).get()
		return res
	}
	
	// getbadgenum 获取不同状态下(进行中  待确认  待下单)的心愿数量
	else if(type == 'getbadgenum') {
		// 分别获取进行中0 待确认1 和待下单2的心愿数量
		let ingnum = await collection.where({
			achieveFlag: 0
		}).count()
		
		let needtoconfirmnum = await collection.where({
			achieveFlag: 1
		}).count()
		
		let needtoordernum = await collection.where({
			achieveFlag: 2
		}).count()
		
		let res = {
			ingnum: ingnum.total,
			needtoconfirmnum: needtoconfirmnum.total,
			needtoordernum: needtoordernum.total
		}
		return res
		
	}
	
	// getlist 分页查询所有的心愿单列表
	else if(type == 'getlist') {
		
		// 如果info.date有值则返回date的值 如果info.date没有值则返回当前的时间字符串
		// let achieveFlagArr = info.achieveFlagArr // 心愿状态数组(筛选项)
		// let hurryLevelArr = info.hurryLevelArr // 紧急程度状态数组(筛选项)
		let achieveFlag = info.achieveFlag == null ? -1 : info.achieveFlag  // 心愿状态 -1为全部 0进行中 1待确认 2待下单 3已完成 4已关闭 默认为-1
		let sortType = info.sortType // 排序方式(筛选项) 
		let searchText = info.searchText // 搜索文本
		let date = info.date ? info.date : currenttimestr
		let pageSize = info.pageSize
		let pageNum = info.pageNum
		let skipdataNum = pageSize * (pageNum - 1)
		
		// let res = await collection
		// .where({
		// 	productTitle: new RegExp(searchText, 'i'), // 找到商品标题包含搜索关键字的数据 i代表不区分大小写
		// 	// achieveFlag: dbCmd.in(achieveFlagArr), // 找到心愿状态在筛选项中的数据
		// 	// hurryLevel: dbCmd.in(hurryLevelArr), // 找到紧急程度在筛选项中的数据
		// 	achieveFlag: achieveFlag == -1 ? dbCmd.exists(true) : dbCmd.eq(achieveFlag), // 找到符合achieveFlag的数据
		// 	creatTime: dbCmd.lte(date), // 找到创建时间小于当时请求时间的数据
		// })
		// // 对结果进行排序  如果是进行中和待确认和待下单则按照紧急程度进行排序  其余状态下不进行排序
		// .orderBy( "hurryLevel", sortType == 1 ? 'asc' : 'desc' ) //  排序方式为1时为升序排序 否则均为降序排序
		// .orderBy("_id", "desc") // 倒序排列
		// .skip(skipdataNum) // 跳过已经查询过的条数
		// .limit(pageSize) // 设置查询的条数
		// .get() // 获取对应数据
		
		// 聚合操作  根据不同的状态进行筛选排序查询
		// 排序对象  如果是状态为012的则根据hurryLevel进行排序 否则不用
		// 1 代表升序排列（从小到大）-1 代表降序排列（从大到小）
		let sort_hurrylevel = achieveFlag == 0 || achieveFlag == 1 || achieveFlag == 2 ? {'hurryLevel': -1} : {}
		let sort_id = {'_id': -1}
		let sortInfo = Object.assign({}, sort_hurrylevel, sort_id)
		let res = await collection.aggregate()
		.match({
			productTitle: new RegExp(searchText, 'i'), // 找到商品标题包含搜索关键字的数据 i代表不区分大小写
			// achieveFlag: dbCmd.in(achieveFlagArr), // 找到心愿状态在筛选项中的数据
			// hurryLevel: dbCmd.in(hurryLevelArr), // 找到紧急程度在筛选项中的数据
			achieveFlag: achieveFlag == -1 ? dbCmd.exists(true) : dbCmd.eq(achieveFlag), // 找到符合achieveFlag的数据
			creatTime: dbCmd.lte(date), // 找到创建时间小于当时请求时间的数据
		})
		// 排序
		.sort(sortInfo)
		.end()
		
		res.date = date // 将查询时间原样返回
		return res
		
	}
	
	// changestatus 切换心愿单的状态
	else if(type == 'changestatus') {
		let docid = info._id
		let changeachieveflag = info.achieveFlag
		let res = await collection.doc(docid).update({
			achieveFlag: changeachieveflag
		})
		return res
	}
	
	// getlinkprocategory 获取链接商品分类
	else if(type == 'getlinkprocategory') {
		
		let productCategoryApi = `https://xhm.xiaohemu.net/tshuser/pro/apiapp/app/purchase/types.ac`
		const res = await uniCloud.httpclient.request(productCategoryApi, {
		    method: 'POST',
			data: {
				info: JSON.stringify({})
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
			let result = {
				code: 0,
				data: res.data.data
			}
			
			// 尝试将第三方商品数据入库
			try{
				
				// 将当前查询出来的第三方商品信息入1688商品数据库
				let thirdProductInfo = res.data.data.product
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
	
};
