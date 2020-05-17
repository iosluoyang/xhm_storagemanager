// 基础的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取出入库记录
function getstockrecord(data){
	return flyrequest.fly.request('/app/product/StockOptlist.do',data)
}

export default{
	getstockrecord
}
