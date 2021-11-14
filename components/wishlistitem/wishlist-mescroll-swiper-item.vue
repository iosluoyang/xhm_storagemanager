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
		
		<wishlistitem v-for="(wishitem, wishindex) in dataList" :key="wishitem._id" :wishitem="wishitem" type="normaltype" @showSameStoreWish="showSameStoreWish"></wishlistitem>
		
		<!-- 底部弹框 -->
		<u-popup v-model="ifshowpopup" mode="bottom" border-radius="20" height="80%">
			
			<view class="contentview height100">
				
				<view class="titleview padding text-center text-pink" style="height: 50px;">
					<text class="cuIcon cuIcon-shopfill text-lg margin-right"></text>
					<text class="text-bold text-black">还有相同商店的其他心愿哦！</text>
					<text class="cuIcon cuIcon-shopfill text-lg margin-left"></text>
				</view>
				
				<scroll-view class="extrascrollview" scroll-y :style="{ height: 'calc(100% - 50px - 100rpx)' }">
					<wishlistitem v-for="(wishitem, wishindex) in sameStoreDataList" :key="wishitem._id" :wishitem="wishitem" type="samestoretype"></wishlistitem>
				</scroll-view>
				
				<button class="bottombtn cu-btn block width100 bg-pink" :style="{height: '100rpx'}" @tap.stop="bindallwish">
					{{ i18n.wishlist.common.agentbindallwish }}
				</button>
				
			</view>
			
		</u-popup>
		
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
				
				// agentStatus: -1, // 代理状态 -1全部 0未代理 1已代理
				// agentStatusOption: [], // 代理状态筛选项
				
				// payStatus: -1, // 支付状态 -1全部 0未支付 1已支付
				// payStatusOption: [], // 支付状态筛选项
				
				ifshowpopup: false, // 是否显示底部弹框
				dataList: [], //列表数据
				sameStoreDataList: [], // 同店铺的未关联心愿列表
			}
		},
		props:{
			searchText: '', // 搜索文本
			agentStatus: {
				type: Number,
				default: -1
			},// 代理状态 -1全部 0未代理 1已代理
			payStatus: {
				type: Number,
				default: -1
			},// 支付状态 -1全部 0未支付 1已支付
			purchaseStatus: {
				type: Number,
				default: -1
			},// 订货状态 -1全部 0未订货 1已订货
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
				// 当前搜索文本
				let searchText = this.searchText
				
				// 开始进行接口请求
				
				const db = uniCloud.database();
				// && creatUser._id == $cloudEnv_uid
				// 查询 商户角色下查询搜索关键字 完成标识 和仅自己发布的可看的合集
				// 代理员角色下查询搜索关键字 完成标识 和 代理人id自身id相等时的合集
				let wherestr = ''
				let orderbystr = `optionTime desc, creatTime desc` // 默认按照提醒标识 按照创建时间倒序显示
				let getCountFlag = false // 是否获取查询列表数据的所有数据库数量  默认为否
				
				console.log(`组件内部查询的agentStatus为:${this.agentStatus}--payStatus为:${this.payStatus}`);
				// 代理员
				if(this.user && this.user.role == 'PRODUCT_AGENT') {
					
					// 如果status=-2则代表查所有未关联代理员的心愿
					if(achieveFlag == -2) {
						wherestr = `agentFlag == 0`
						getCountFlag = true // 代理查询所有未关联的心愿单的总数量
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
					
					// 增加筛选状态的查询条件
					// 代理状态
					wherestr += `${this.agentStatus == -1 ? '' : ` && agentFlag == ${this.agentStatus}`}`
					// 支付状态
					wherestr += `${ this.payStatus == 0 ? ' && (wishOrderId.status == 0)' : this.payStatus == 1 ? ' && wishOrderId.status > 0' : '' } `
					// 订货状态
					wherestr += `${ this.purchaseStatus == 1 ? ' && (wishOrderId.thirdOrderNum != "") ' : this.purchaseStatus == 0 ? ' && wishOrderId.thirdOrderNum == "" ' : '' } `
					
					// 增加搜索关键字和供应商昵称和对应的订单编码的查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productTitle) || ${new RegExp(searchText, 'i')}.test(aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) || ${new RegExp(searchText, 'i')}.test(wishOrderId.thirdOrderNum) )`
					
				}
				// 普通供应商
				else if(this.user.role == 'MERCHANT_ADMIN' || this.user.role == 'MERCHANT_EMPLOYEE') {
					
					// 如果statsu =-1则代表查自己发布过的所有心愿单
					if(achieveFlag == -1) {
						wherestr = `creatUser._id == $cloudEnv_uid`
						getCountFlag = true // 查询所有自己发布过的心愿单数量
					}
					
					// 正在进行中
					else if(achieveFlag == 0) {
						wherestr = `achieveFlag == 0 && creatUser._id == $cloudEnv_uid`
					}
					
					// 如果status = 2则代表查自己发布过的待下单的心愿单
					else if(achieveFlag == 2) {
						wherestr = `achieveFlag == ${achieveFlag} && creatUser._id == $cloudEnv_uid`
						// 此时排序字段增加按照wishOrderId.status来进行正序排序 status=0未支付 status=1已支付
						orderbystr = `wishOrderId.status asc, optionTime desc, creatTime desc`
					}
					
					// 如果是其他类别则查对应的自己发布过的不同类别的心愿
					else {
						wherestr = `achieveFlag == ${achieveFlag} && creatUser._id == $cloudEnv_uid`
					}
					
					// 增加筛选状态的查询条件
					// 代理状态
					wherestr += `${this.agentStatus == -1 ? '' : ` && agentFlag == ${this.agentStatus}`}`
					// 支付状态
					wherestr += `${ this.payStatus == 0 ? ' && (wishOrderId.status == 0)' : this.payStatus == 1 ? ' && wishOrderId.status > 0' : '' } `
					// 订货状态
					wherestr += `${ this.purchaseStatus == 1 ? ' && (wishOrderId.thirdOrderNum != "")' : this.purchaseStatus == 0 ? ' && wishOrderId.thirdOrderNum == "" ' : '' } `
					
					// 增加搜索关键字和供应商昵称和对应的订单编码的查询条件
					wherestr += ` && (${new RegExp(searchText, 'i')}.test(productTitle) || ${new RegExp(searchText, 'i')}.test(aliasName) || ${new RegExp(searchText, 'i')}.test(creatUser.nickname) || ${new RegExp(searchText, 'i')}.test(wishOrderId.thirdOrderNum) )`
					
				}
				
				console.log(`查询语句为:\n${wherestr}`);
				db.collection('wishlist,uni-id-users,order')
					.where(wherestr)
					.field('creatUser{avatar, nickname},agentUser{avatar, nickname},agentFlag,achieveFlag,remindFlag,productTitle,sellerInfo,aliasName,imgs,targetAmount,targetPrice,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,creatTime,optionTime,hurryLevel, wishOrderId as wishOrderInfo')
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
			
			// 关联其他店铺的心愿
			showSameStoreWish(unbindsamestorewishlist) {
				this.sameStoreDataList = unbindsamestorewishlist
				this.ifshowpopup = true
			},
			
			// 一键关联其他店铺的心愿单
			bindallwish() {
				
				const _this = this
				
				let bindwishlist = this.sameStoreDataList
				const db = uniCloud.database();
				
				let promiseArr = []
				bindwishlist.forEach(eachwish => {
					
					let promise = new Promise((resolve, reject) => {
						
						db.collection('wishlist').doc(eachwish._id)
						.update({agentUser:db.env.uid, agentFlag: 1, optionTime: db.env.now})
						.then(response => {
							
							// 添加一个代理人关联心愿时间轴记录
							db.collection('wishlisttimeline')
							.add({type: 90,wishId: eachwish._id})
							.then(response => {
								// 创建时间轴成功
								
								let info = {
									msgType: 'agentbindwish',
									wishId: eachwish._id
								}
								uniCloud.callFunction({
									name: 'base',
									data: {
										type: 'sendwxmsg',
										info: info
									}
								}).then(response => {
									// 发送微信消息成功
									if(response.result.errCode == 0) {
										console.log(`发送微信订阅消息成功`);
									}
									else {
										console.log(`发送微信订阅消息失败,原因是:${response.result.message}`);
									}
									
								}).catch(error => {
									console.log(error.message);
								})
								resolve(response)
								
							})
							.catch(error => {
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
								reject(error)
							})
							
						})
						.catch(error => {
							reject(error)
						})
						
					})
					promiseArr.push(promise)
					
				})
				
				Promise.all(promiseArr).then(response => {
					uni.showToast({
						title: _this.i18n.tip.optionsuccess,
						icon: 'none'
					});
					
					console.log(`关联成功`);
					console.log(response);
					// 关联成功
					_this.ifshowpopup = false
					_this.mescroll.resetUpScroll(true)
					
				}).catch(error => {
					console.log(`关联失败`);
					console.log(error);
				})
				
			},
			
			//
		}
	}

</script>

<style lang="scss" scoped>
	
</style>