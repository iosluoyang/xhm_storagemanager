// 基础的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取1688商品分类接口
function get1688category(data){
	return flyrequest.fly.request('/app/purchase/types.ac',data)
}

// 获取1688商品搜索接口
function get1688prosearch(data){
	return flyrequest.fly.request('/app/purchase/productsearch1688.ac',data)
}

// 获取1688商品详情
function get1688prodetail(data){
	return flyrequest.fly.request('/app/purchase/productdetail1688.ac',data)
}

// 获取翻译属性
function get1688proattirbutetranslate(data){
	return flyrequest.fly.request('/app/purchase/productAttributeTranslate.ac',data)
}



export default{
	get1688category,
	get1688prosearch,
	get1688prodetail,
	get1688proattirbutetranslate,
}
