// 数据统计相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取每日出入库汇总记录
function geteachdaystocklist(data){
	return flyrequest.fly.request('/app/report/eachdayStockList.do',data)
}

export default{
	geteachdaystocklist
}