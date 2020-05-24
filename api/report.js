// 数据统计相关的接口请求汇总
import flyrequest from '@/common/js/requestfly.js'

// 获取每日出入库汇总记录
function geteachdaystockreport(data){
	return flyrequest.fly.request('/app/report/eachdayStockList.do',data)
}

// 获取今日实时出入库汇总记录
function gettodaystockreport(data){
	return flyrequest.fly.request('/app/report/todayStockInfo.do',data)
}

export default{
	
	geteachdaystockreport,
	gettodaystockreport,
	
}