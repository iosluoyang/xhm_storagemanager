import baseapi from '@/api/base.js'
import userapi from '@/api/user.js'
import managepeopleapi from '@/api/managepeople.js'
import goodsapi from '@/api/goods.js'
import stockapi from '@/api/stock.js'
import customerapi from '@/api/customer.js'
import noticeapi from '@/api/notice.js'
import reportapi from '@/api/report.js'
import productapi from '@/api/product.js'


export default {
	baseapi, // 基础参数api接口 例如获取配置信息
	userapi, // 用户相关api接口
	managepeopleapi, // 管理成员相关api接口
	goodsapi, // 商品相关api接口
	stockapi, // 库存相关api接口
	customerapi, // 客户相关api接口
	noticeapi, // 公告相关api接口
	reportapi, // 数据统计相关api接口
	productapi, // 商品新相关的api接口
}