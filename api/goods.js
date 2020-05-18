// 基础的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 生成商品二维码
function buildqrcode(data){
	return flyrequest.fly.request('/app/product/createBarCodes.do',data)
}

// 获取二维码内容对应的pid
function getpidbyqrcode(data){
	return flyrequest.fly.request('/app/product/queryPidByBarCode.do',data)
}


// 获取商品分类列表
function gettypelist(data){
	return flyrequest.fly.request('/app/type/list.do',data)
}

// 获取商品分类详情
function gettypedetail(data){
	return flyrequest.fly.request('/app/type/detail.do',data)
}

// 新增商品分类
function addtype(data){
	return flyrequest.fly.request('/app/type/add.do',data)
}

// 修改商品分类
function updatetype(data){
	return flyrequest.fly.request('/app/type/update.do',data)
}

// 删除商品分类
function deletetype(data){
	return flyrequest.fly.request('/app/type/del.do',data)
}

// 获取商品列表数据
function getproductlist(data){
	return flyrequest.fly.request('/app/product/list.do',data)
}

// 获取商品规格组合
function getprospecs(data){
	return flyrequest.fly.request('/app/product/specList.do',data)
}

// 新增商品
function addproduct(data){
	return flyrequest.fly.request('/app/product/add.do',data)
}

// 编辑商品
function editproduct(data){
	return flyrequest.fly.request('/app/product/modify.do',data)
}

// 删除商品
function deleteproduct(data){
	return flyrequest.fly.request('/app/product/del.do',data)
}

// 获取商品详情
function getgoodsdetail(data){
	return flyrequest.fly.request('/app/product/detail.do',data)
}

// 修改商品价格信息
function fixgoodsprice(data){
	return flyrequest.fly.request('/app/product/modifyPrice.do',data)
}


// 商品入库
function stockin(data){
	return flyrequest.fly.request('/app/product/addStockCount.do',data)
}

// 商品出库
function stockout(data){
	return flyrequest.fly.request('/app/product/subStockCount.do',data)
}







export default {
	buildqrcode,
	getpidbyqrcode,
	
	gettypelist,
	gettypedetail,
	addtype,
	updatetype,
	deletetype,
	
	getproductlist,
	getprospecs,
	
	addproduct,
	editproduct,
	deleteproduct,
	getgoodsdetail,
	
	fixgoodsprice,
	
	stockin,
	stockout,
	
	
}
