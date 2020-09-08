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
			wishid: info.wishid,
			creatTime: currenttimestr,
			user: info.user,
			content: info.content,
			link: info.link, // 链接地址
			price: info.price, // 价格
			moneytype: info.moneytype, // 价格币种 默认为RMB  RMB人民币 THB泰铢
			imgs: info.imgs,
			type: info.type, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新  2心愿单待确认  3心愿单确认通过  4心愿单确认拒绝  5心愿单完成
		}
		let res = await collection.add(data)
		
		return res
	}
	
	// edit 编辑时间轴数据
	else if(type == 'edit') {
		let docid = info._id
		// 编辑时间轴集合数据
		let otherdata = {
			creatTime: currenttimestr, // 更新当前时间轴的创造时间为最新的当前时间
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
	
	// gettimelinelist 获取某个心愿id下的所有时间轴数据(按照时间倒叙展示)
	else if(type == 'getlist') {
		
		let wishid = info.wishid
		let res = await collection.where({
			wishid: wishid
		}).orderBy('creatTime','desc').get()
		
		return res
	}
	
};
