<template>
	<!-- 
	swiper中的transfrom会使fixed失效,此时用height固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
	<!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
	<!-- top的高度等于悬浮菜单tabs的高度 -->
	<mescroll-uni class="mescrollview" :ref="'mescrollRef'+i" @init="mescrollInit" :height="height" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback">
		<!-- 顶部提示 -->
		<u-top-tips :ref="'uTips' + i" :navbar-height="0"></u-top-tips>
		
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
				
				dataList: [], //列表数据
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
				let status = currenttabitem.status
				// 当前搜索文本
				let searchText = this.searchText
				
				// 开始进行接口请求
				
				const db = uniCloud.database();
				// && creatUser._id == $cloudEnv_uid
				// 查询 商户角色下查询搜索关键字 完成标识 和仅自己发布的可看的合集
				// 代理员角色下查询搜索关键字 完成标识 和 代理人id自身id相等时的合集
				let wherestr = ''
				let orderbystr = `updateTime desc, creatTime desc` // 默认按照操作时间 、创建时间倒序显示
				let getCountFlag = false // 是否获取查询列表数据的所有数据库数量  默认为否
				
				// 代理员
				if(this.user && this.user.role == this.$basejs.roleEnum.productAgent) {
					
					// 如果status =-1则代表查自己代理的所有心愿单
					if(status == -1) {
						wherestr = `agentUid._id == $cloudEnv_uid`
					}
					
					// 如果status=0则代表查所有未被代理的心愿
					else if(status == 0) {
						wherestr = `status == 0`
						getCountFlag = true // 代理查询所有未关联的心愿单的总数量
					}
					
					// 如果是其他类别则查对应的自己关联过的不同类别的心愿
					else {
						wherestr = `status == ${status} && agentUid._id == $cloudEnv_uid`
					}
					
					// 增加搜索关键字和供应商昵称和对应的订单编码的查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productList.title) || ${new RegExp(searchText, 'i')}.test(productList.aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) )`
					
				}
				// 普通供应商
				else if(this.user.role == this.$basejs.roleEnum.merchantAdmin) {
					
					wherestr = `creatUid._id == $cloudEnv_uid`
					
					// 如果statsu =-1则代表查自己所有发布过的所有心愿单
					if(status == -1) {
						getCountFlag = true // 查询所有自己发布过的心愿单数量
					}
					// 如果是其他类别则查对应的自己发布过的不同类别的心愿
					else {
						wherestr += ` && status == ${status}`
					}
					
					// 增加搜索关键字和供应商昵称和对应的订单编码的查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productList.title) || ${new RegExp(searchText, 'i')}.test(productList.aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) )`
					
				}
				// 管理员
				else if(this.user.role == this.$basejs.roleEnum.admin) {
					// 如果statsu =-1则代表查所有发布过的所有心愿单
					if(status == -1) {
						getCountFlag = true // 查询所有发布过的心愿单数量
					}
					// 如果是其他类别则查对应的不同类别的心愿
					else {
						wherestr += `status == ${status} && `
						if(status == 0) {
							getCountFlag = true
						}
					}
					
					// 增加搜索关键字
					wherestr += `(${new RegExp(searchText, 'i')}.test(productList.title) || ${new RegExp(searchText, 'i')}.test(productList.aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.username) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) || ${new RegExp(searchText, 'i')}.test(agentUser.username) || ${new RegExp(searchText, 'i')}.test(agentUser.nickname) )`
				}
				
				console.log(`查询语句为:\n${wherestr}`);
				db.collection('wish,uni-id-users')
					.where(wherestr)
					.field( `creatUid{avatar, nickname} as creatUser, agentUid{avatar, nickname} as agentUser, optionTime, status, productList, creatTime` )
					.orderBy(orderbystr)
					.skip((pageNum - 1) * pageSize)
					.limit(pageSize)
					.get({
						getCount: pageNum == 1 && getCountFlag, // 仅第一页查询时有显示数量
					})
					.then(response => {
						
						if(response.result.code == 0) {
							
							// 加载成功
							let list = response.result.data || []
							
							// 手动将creatUser的数据从数组转换为对象
							list.forEach(item => {
								item.creatUser = item.creatUser && item.creatUser.length > 0 ? item.creatUser[0] : null
								item.agentUser = item.agentUser && item.agentUser.length > 0 ? item.agentUser[0] : null
								item.sellerInfo = item.productList && item.productList.length > 0 ? item.productList[0].sellerInfo : null
							})
							console.log(`本次共获取${list.length}个数据,具体数据为:`);
							console.log(list);
							if(pageNum == 1) {
								dataList = [] //清空数据源
								mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
							} 
							//将请求的数据添加至现有数据源中
							this.dataList = dataList.concat(list)
							
							// 如果有数量则toast提示数量
							if(response.result.count) {
								this.$refs['uTips' + this.i].show({
									title: `In total ${response.result.count}`,
									type: 'success',
								})
							}
							
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
						// 失败隐藏下拉加载状态
						mescroll.endErr()
					})
				
			},

			//
		}
	}

</script>

<style lang="scss" scoped>
	
</style>