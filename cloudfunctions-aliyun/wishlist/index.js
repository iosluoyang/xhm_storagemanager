'use strict';
const db = uniCloud.database()

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('客户端上传到的参数为: ', event)
	
	//获取集合对象
	const collection = db.collection('wishlist')
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// add 新增心愿单
	if(type == 'add') {
		// 写入心愿单集合数据
		let data = {...info}
		let res = await collection.add(data)
		return res
	}
	
	// edit 编辑心愿单
	else if(type == 'edit') {
		let docid = info._id
		let res = await collection.doc(docid).update({...info});
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
		let res = await collection.doc(docid).get()
		return res
	}
	
	// getlist 分页查询所有的心愿单列表
	else if(type == 'getlist') {
		
		let date = info.date
		let pageSize = info.pageSize
		let pageNum = info.pageNum
		let skipdataNum = pageSize * (pageNum - 1)
		
		let res = await collection.orderBy("_id", "desc").skip(skipdataNum).limit(pageSize).get()
		// 如果date有值则返回原先date的值 如果date没有值则返回当前的时间字符串
		let newdate = date ? date : getcurrenttimestr(true)
		res.date = newdate
		return res
		
		// // 倒叙返回所有的数据
		// let res = await collection.orderBy("_id", "desc").get()
		// //返回数据给客户端
		// return res
	}
	
};
