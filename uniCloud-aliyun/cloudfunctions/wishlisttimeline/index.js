'use strict';
var moment = require('moment')

const db = uniCloud.database()
const dbCmd = db.command // 数据库指令


exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('客户端上传到的参数为: ', event)
	
	// 当前时间字符串
	let currenttimestr = moment().add(8,'h').format('YYYY-MM-DD HH:mm:ss') // 注意服务器时间要比客户端时间晚8个小时 所以这里要增加8个小时
	
	//获取集合对象
	const collection = db.collection('wishlisttimeline')
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// add 新增时间轴数据
	if(type == 'add') {
		
		let data = {
			wishId: info.wishId,
			creatTime: currenttimestr,
			user: info.user,
			content: info.content,
			link: info.link, // 链接地址
			price: info.price, // 价格
			moneyType: info.moneyType, // 价格币种 默认为RMB  RMB人民币 THB泰铢
			imgs: info.imgs,
			type: info.type, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
		}
		let res = await collection.add(data)
		
		// 如果时间轴type为3待确认 则将对应的心愿单状态更改为待确认
		const wishcollection = db.collection('wishlist')
		if(data.type == 3) {
			await wishcollection.doc(data.wishId).update({
				achieveFlag: 1 // achieveFlag  0进行中 1待确认 2已完成
			})
		}
		
		// 每增加一个评论数据就像对应的心愿单评论数据自增1
		await wishcollection.doc(data.wishId).update({
			commentCount: dbCmd.inc(1) // 将该心愿单的评论数量自增1
		})
		
		return res
	}
	
	// edit 编辑时间轴数据
	else if(type == 'edit') {
		let docid = info._id
		// 编辑时间轴集合数据
		let otherdata = {
			editTime: currenttimestr, // 更新当前时间轴的编辑时间为最新的当前时间
		}
		let updateinfo = {...info,...otherdata}
		delete updateinfo._id // 删除_id属性 不能更新_id字段
		let res = await collection.doc(docid).update(updateinfo);
		return res
	}
	
	// delete 删除时间轴数据
	else if(type == 'delete') {
		let docid = info._id
		let res = await collection.doc(docid).remove()
		return res
	}
	
	// refuse 时间轴数据点击拒绝
	else if(type == 'refuse') {
		let docid = info._id
		let updateinfo = {
			type: 5,
			refuseReason: info.refuseReason,
			refuseUser: info.refuseUser,
			refuseTime: currenttimestr,
		}
		let res = await collection.doc(docid).update(updateinfo)
		// 当时间轴数据被拒绝的时候将对应的心愿单状态恢复为进行中
		let wishId = info.wishId
		const wishlistcollection = db.collection('wishlist')
		await wishlistcollection.doc(wishId).update({
			achieveFlag: 0
		})
		return res
	}
	
	// agree 时间轴数据点击同意
	else if(type == 'agree') {
		
		// 首先更新当前时间轴数据为已通过
		let docid = info._id
		let updateinfo = {
			type: 4,
			agreeUser: info.agreeUser,
			agreeTime: currenttimestr,
		}
		let res = await collection.doc(docid).update(updateinfo)
		
		// 然后新增一条时间轴完成记录
		let donedata = {
			wishId: info.wishId,
			creatTime: currenttimestr,
			user: info.agreeUser,
			type: 6, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
		}
		await collection.add(donedata)
		
		// 将对应的该心愿评论数据+1 然后变更该心愿为已完成状态
		const wishlistcollection = db.collection('wishlist')
		await wishlistcollection.doc(info.wishId).update({
			commentCount: dbCmd.inc(1), // 将该心愿单的评论数量自增1
			achieveFlag: 2
		})

		return res
	}
	
	// gettimelinelist 获取某个心愿id下的所有时间轴数据(按照时间倒叙展示)
	else if(type == 'getlist') {
		
		let wishId = info.wishId
		let res = await collection.where({
			wishId: wishId
		}).orderBy('creatTime','desc').get()
		
		return res
	}
	
	else if(type == 'getdetail') {
		let docid = info._id
		let res = await collection.doc(docid).get()
		return res
	}
	
};
