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
			commentCount: 0, // 设置评论数量为0
			creatTime: currenttimestr, // 当前新增的时间字符串
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
		await wishlisttimelinecollecton.add([timelinestartdata,timelinenoramldata])
		
		return wishlistres
	}
	
	// edit 编辑心愿单
	else if(type == 'edit') {
		let docid = info._id
		// 编辑心愿单集合数据
		let otherdata = {
			achieveFlag: 0, // achieveFlag  0进行中 1待确认 2已完成
			creatTime: currenttimestr, // 更新当前心愿单的创造时间为最新的当前时间
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
	
	// getlist 分页查询所有的心愿单列表
	else if(type == 'getlist') {
		
		// 如果info.date有值则返回date的值 如果info.date没有值则返回当前的时间字符串
		let date = info.date ? info.date : currenttimestr
		let pageSize = info.pageSize
		let pageNum = info.pageNum
		let skipdataNum = pageSize * (pageNum - 1)
		
		let res = await collection
		.where({
			creatTime: dbCmd.lte(date) // 找到创建时间小于当时请求时间的数据
		})
		.orderBy("_id", "desc") // 倒序排列
		.skip(skipdataNum) // 跳过已经查询过的条数
		.limit(pageSize) // 设置查询的条数
		.get() // 获取对应数据
		
		res.date = date // 将查询时间原样返回
		return res
		
	}
	
};
