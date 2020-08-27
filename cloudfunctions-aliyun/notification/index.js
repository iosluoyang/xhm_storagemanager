'use strict';
const db = uniCloud.database()

// 获取当前时间字符串(是否到毫秒)
function getcurrenttimestr(ifmillisecond) {
	var now = new Date();
	var yy = now.getFullYear(); //年
	var mm = now.getMonth() + 1; //月
	var dd = now.getDate(); //日
	var hh = now.getHours(); //时
	var ii = now.getMinutes(); //分
	var ss = now.getSeconds(); //秒
	var sss = now.getMilliseconds(); // 毫秒
	var time = yy + "-";
	if (mm < 10) time += "0";
	time += mm + "-";
	if (dd < 10) time += "0";
	time += dd + " ";
	if (hh < 10) time += "0";
	time += hh + ":";
	if (ii < 10) time += '0';
	time += ii + ":";
	if (ss < 10) time += '0';
	// 是否获取到毫秒
	if(ifmillisecond) {
		time += ss + ":";
		if (sss < 10) time += '0';
		time += sss;
	}
	else {
		time += ss
	}
	
	return time
}

exports.main = async (event, context) => {
	
	//event为客户端上传的参数
	console.log('客户端上传到的参数为: ', event)
	
	//获取集合对象
	const collection = db.collection('notification')
	
	// 根据不同的type区分不同的业务
	let type = event.type
	let info = event.info
	
	// add 新增公告
	if(type == 'add') {
		// 写入公告集合数据
		let data = {
			content: info.content,
			createDate: getcurrenttimestr()
		}
		let res = await collection.add(data)
		return res
	}
	
	// edit 编辑公告
	else if(type == 'edit') {
		let docid = info._id
		let res = await collection.doc(docid).update({
			content: info.content,
		});
		return res
	}
	
	// edit 删除公告
	else if(type == 'delete') {
		let docid = info._id
		let res = await collection.doc(docid).remove()
		return res
	}
	
	// getdetail 获取公告详情
	else if(type == 'getdetail') {
		let docid = info._id
		let res = await collection.doc(docid).get()
		return res
	}
	
	// getlist 分页查询所有的公告列表
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
	
	// getnewest 查询最新一条公告
	else if(type == 'getnewest') {
		// 倒叙返回最新的一条数据
		let res = await collection.orderBy("_id", "desc").limit(1).get()
		return res
	}
	
	
	
};
