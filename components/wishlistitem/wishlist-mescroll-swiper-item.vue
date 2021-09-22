<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<!-- top的高度等于悬浮菜单tabs的高度 -->
	 <mescroll-uni :ref="'mescrollRef'+i" @init="mescrollInit" :height="height" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @emptyclick="emptyClick">
		<wishlistitem v-for="(wishitem, wishindex) in dataList" :key="wishitem._id" :wishitem="wishitem"></wishlistitem>
	</mescroll-uni>
</template>

<script>
	
	var _this
	
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
	import wishlistitem from '@/components/wishlistitem/wishlistitem.vue'
	
	export default {
		mixins: [MescrollMixin,MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
		components: {
			wishlistitem,
		},
		data() {
			return {
				downOption:{
					auto:false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
				},
				upOption:{
					auto:false, // 不自动加载
					noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
					empty:{
						tip: '~ Empty ~', // 提示
					}
				},
				dataList: [] //列表数据
			}
		},
		props:{
			searchText: '', // 搜索文本
			i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
			index: { // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
				type: Number,
				default(){
					return 0
				}
			},
			tabs: { // 为了请求数据,演示用,可根据自己的项目判断是否要传
				type: Array,
				default(){
					return []
				}
			},
			height: [Number,String] // mescroll的高度
		},
		created() {
			_this = this
		},
		methods: {
			/*下拉刷新的回调 */
			downCallback() {
				// 这里加载你想下拉刷新的数据, 比如刷新轮播数据
				// loadSwiper();
				// 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
				this.mescroll.resetUpScroll()
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(mescroll) {
				
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : mescroll.date // 请求时间标识
				let currenttabitem = this.tabs[this.i]
				let dataList = this.dataList
				
				// 获取当前要请求的心愿状态
				let achieveFlag = currenttabitem.status
				// 排序方式
				let sortType = 0
				// 当前搜索文本
				let searchText = this.searchText
				
				// 开始进行接口请求
				
				const db = uniCloud.database();
				// && creatUser._id == $cloudEnv_uid
				// 查询 商户角色下查询搜索关键字 完成标识 和仅自己发布的可看的合集
				// 代理员角色下查询搜索关键字 完成标识 和 代理人id自身id相等时的合集
				let wherestr = ''
				let orderbystr = `creatTime desc` // 默认按照提醒标识 按照创建时间倒序显示
				// 代理员
				if(this.user.role == 'PRODUCT_AGENT') {
					
					// 如果status=-2则代表查所有未关联代理员的心愿
					if(achieveFlag == -2) {
						wherestr = `agentFlag == 0`
					}
					// 如果statsu =-1则代表查自己关联过的所有心愿单
					else if(achieveFlag == -1) {
						wherestr = `agentUser._id == $cloudEnv_uid`
					}
					// 如果status = 2则代表查关联过的待下单的心愿单 此时排序字段增加按照wishOrderId.status来进行正序排序
					else if(achieveFlag == 2) {
						wherestr = `achieveFlag == ${achieveFlag} && agentUser._id == $cloudEnv_uid`
						orderbystr = `wishOrderId.status asc, creatTime desc`
					}
					
					// 如果是其他类别则查对应的自己关联过的不同类别的心愿
					else {
						wherestr = `achieveFlag == ${achieveFlag} && agentUser._id == $cloudEnv_uid`
					}
					
					// 增加搜索关键字和供应商昵称和对应的订单编码的查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productTitle) || ${new RegExp(searchText, 'i')}.test(aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) || ${new RegExp(searchText, 'i')}.test(wishOrderId.thirdOrderNum) )`
					
				}
				// 普通供应商
				else if(this.user.role == 'MERCHANT_ADMIN' || this.user.role == 'MERCHANT_EMPLOYEE') {
					
					// 如果statsu =-1则代表查自己发布过的所有心愿单
					if(achieveFlag == -1) {
						wherestr = `creatUser._id == $cloudEnv_uid`
					}
					
					// 如果status = 2则代表查自己发布过的待下单的心愿单 此时排序字段增加按照wishOrderId.status来进行正序排序
					else if(achieveFlag == 2) {
						wherestr = `achieveFlag == ${achieveFlag} && creatUser._id == $cloudEnv_uid`
						orderbystr = `wishOrderId.status asc, creatTime desc`
					}
					
					// 如果是其他类别则查对应的自己发布过的不同类别的心愿
					else {
						wherestr = `achieveFlag == ${achieveFlag} && creatUser._id == $cloudEnv_uid`
					}
					
					// 增加搜索关键字查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productTitle) || ${new RegExp(searchText, 'i')}.test(aliasName) || ${new RegExp(searchText, 'i')}.test(wishOrderId.thirdOrderNum) )`
					
				}
				
				db.collection('wishlist,uni-id-users,order')
					.where(wherestr)
					.field('creatUser{avatar, nickname},agentUser{avatar, nickname},agentFlag,achieveFlag,remindFlag,productTitle,sellerInfo,aliasName,imgs,targetAmount,targetPrice,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,creatTime,hurryLevel, wishOrderId as wishOrderInfo')
					.orderBy(orderbystr)
					.skip((pageNum - 1) * pageSize)
					.limit(pageSize)
					.get()
					.then(response => {
						
						if(response.result.code == 0) {
							
							// 加载成功
							let list = response.result.data || []
							
							// 手动将creatUser的数据从数组转换为对象
							list.forEach(item => {
								item.creatUser = item.creatUser[0]
								item.agentUser = item.agentUser && item.agentUser.length > 0 ? item.agentUser[0] : null
								item.wishOrderInfo = item.wishOrderInfo ? item.wishOrderInfo[0] : null
							})
							console.log(`本次共获取${list.length}个数据,具体数据为:`);
							console.log(list);
							if(pageNum == 1) {
								dataList = [] //清空数据源
								mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
							} 
							//将请求的数据添加至现有数据源中
							this.dataList = dataList.concat(list)
							
							// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
							_this.$nextTick(()=>{
								let hasNext = list.length === mescroll.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
								mescroll.endSuccess(list.length,hasNext)
							})
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.loaderror,
								icon: 'none'
							});
							// 失败隐藏下拉加载状态
							mescroll.endErr()
							console.log(response.message);
						}
						
					})
					.catch(error => {
						if(error && error.message && error.message.indexOf('30203') > -1) {
							console.log(`重新登录`);
							_this.$store.dispatch('user/resettoken').then(() => {
								
								uni.redirectTo({
									url: '/pages/base/login'
								});
								setTimeout(function() {
									
									uni.showToast({
										title: _this.i18n.tip.pleaselogin,
										icon: 'none'
									});
									
								}, 1000);
								
							})
						}
						// 失败隐藏下拉加载状态
						mescroll.endErr()
					})
				
				
				
			},
			//点击空布局按钮的回调
			emptyClick(){
				uni.showToast({
					title:'点击了按钮,具体逻辑自行实现'
				})
			}
		}
	}
</script>
