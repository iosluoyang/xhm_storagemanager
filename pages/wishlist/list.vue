<template>
	<view class="contentview wishlistview">
		
		<!-- 自定义导航栏 -->
		<cu-custom class="customnav" bgColor="bg-gradual-pink">
			
			<view slot="content" class="search-form round">
				<u-field v-model="searchText" type="text" icon="search" :label-width="0" :border-bottom="false" :placeholder="i18n.placeholder.wishlistlist.search" confirm-type="search" @confirm="searchwishlist"></u-field>
			</view>
			
			<!-- 小程序中没有右侧搜索按钮 -->
			<!-- #ifndef MP -->
			<view slot="right" class="action">
				<button class="cu-btn bg-pink shadow-blur round" @tap.stop="searchwishlist">{{i18n.base.search}}</button>
			</view>
			<!-- #endif -->
			
		</cu-custom>

		<!-- 选项卡 -->
		<view class="u-tabs-box">
			<u-tabs-swiper active-color="#e03997" ref="tabs" :list="tabArr" :current="current" bar-width="100" :bold="false" @change="tabsChange" :is-scroll="true" swiperWidth="750"></u-tabs-swiper>
		</view>
		
		<!-- 顶部筛选区域 -->
		<u-dropdown v-if="filterFlag" class="u-dropdown" active-color="#e03997" height="80rpx">
			
			<!-- 普通供应商视角下 -->
			<template v-if="user && (user.role == 'MERCHANT_ADMIN' || user.role == 'MERCHANT_EMPLOYEE') ">
				
				<!-- 心愿单全部分类 -->
				<template v-if="computedCurrentStatus == -1">
					<u-dropdown-item v-model="agentStatus" :title=" i18n.wishlist.list.agentstatus.title " :options="agentStatusOption" @change="changeAgentStatus"></u-dropdown-item>
				</template>
				
				<!-- 全部或者待下单分类 -->
				<u-dropdown-item v-if="computedCurrentStatus == -1 || computedCurrentStatus == 2" v-model="payStatus" :title=" i18n.wishlist.list.paystatus.title " :options="payStatusOption" @change="changePayStatus"></u-dropdown-item>
				
				<!-- 待下单分类 -->
				<template v-if="computedCurrentStatus == 2">
					<!-- 订货筛选项 当心愿单为待购买status == 2时出现 -->
					<u-dropdown-item v-model="purchaseStatus" :title=" i18n.wishlist.list.purchasestatus.title " :options="purchaseStatusOption" @change="changePurchaseStatus"></u-dropdown-item>
				</template>
				
			</template>
			
			<!-- 代理员视角下 -->
			<template v-else-if="user && user.role == 'PRODUCT_AGENT' ">
				
				<!-- 待下单分类 -->
				<u-dropdown-item v-if="computedCurrentStatus == 2" v-model="payStatus" :title=" i18n.wishlist.list.paystatus.title " :options="payStatusOption" @change="changePayStatus"></u-dropdown-item>
				
				<!-- 待下单分类 -->
				<template v-if="computedCurrentStatus == 2">
					<!-- 订货筛选项 当心愿单为待购买status == 2时出现 -->
					<u-dropdown-item v-model="purchaseStatus" :title=" i18n.wishlist.list.purchasestatus.title " :options="purchaseStatusOption" @change="changePurchaseStatus"></u-dropdown-item>
				</template>
				
			</template>
			
		</u-dropdown>
		
		<!-- swiper区域 -->
		<swiper :style="{height: filterFlag ? 'calc(100% - '+CustomBar+'px - 80rpx - 80rpx )' : 'calc(100% - '+CustomBar+'px - 80rpx)' }" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(tabitem,index) in tabArr" :key="index">
				<wishlistMescrollSwiperItem ref="mescrollItem" :searchText="searchText" :i="index" :index="current" :tabs="tabArr" :height=" filterFlag ? 'calc(100% - '+CustomBar+'px - 80rpx - 80rpx )' : 'calc(100% - '+CustomBar+'px - 80rpx)' " :agentStatus="agentStatus" :payStatus="payStatus" :purchaseStatus="purchaseStatus"></wishlistMescrollSwiperItem>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	
	var _this	
	
	import wishlistMescrollSwiperItem from '@/components/wishlistitem/wishlist-mescroll-swiper-item.vue';
	
	export default {
		
		data() {
			return {
				
				needtochecktoken: true, // 是否检测用户token信息
				
				currentStatus: -1, // 默认选中的状态为进行中的状态
				searchText: '', // 搜索文本
				
				
				agentStatus: -1, // 代理状态 -1全部 0未代理 1已代理
				agentStatusOption: [], // 代理状态筛选项
				
				payStatus: -1, // 支付状态 -1全部 0未支付 1已支付
				payStatusOption: [], // 支付状态筛选项
				
				purchaseStatus: -1, // 订货状态  0未订货 1已订货
				purchaseStatusOption: [], // 订货状态筛选项
				
				current: 0, // 当前选项卡的索引 默认为0
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				scrollLeft: 0, // 选项卡左侧滑动的距离
				tabArr:[], // 选项卡数组
				
			};
		},
				
		components: {
			wishlistMescrollSwiperItem,
		},
		
		onLoad(option) {
			
			_this = this
			
			// 选中状态
			let currentStatus = option.status
			if(currentStatus != null) {
				this.currentStatus = currentStatus
			}
			
			// 初始化选项卡数组数据
			this.initTabArr()
			
			// 初始化筛选项
			this.setFilterOptionData()
			
			// 监听更新事件
			uni.$on('updatewishlist', function(data) {
				_this.getbadgenum()
				_this.starttorefresh()
			})
			uni.$on('updatebadgenum', function() {
				_this.getbadgenum()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishlist')
			uni.$off('updatebadgenum')
		},
		
		computed: {
			
			// 当前计算的心愿状态
			computedCurrentStatus() {
				
				if(this.tabArr && this.tabArr.length > 0) {
					let currentItem = this.tabArr[this.current]
					let currentStatus = currentItem.status
					return currentStatus
				}
				return this.currentStatus || -1
				
			},
			
			// 筛选面板标识 false为没有筛选面板  true为有筛选面板  默认没有
			filterFlag() {
				
				let computedCurrentStatus = this.computedCurrentStatus
				
				// 普通供应商
				if(this.user && (this.user.role == 'MERCHANT_ADMIN' || this.user.role == 'MERCHANT_EMPLOYEE')) {
					// 根据当前选择的心愿状态区分筛选面板内容
					if(computedCurrentStatus == -1 || computedCurrentStatus == 2) {
						// 设置筛选面板数据
						return true
					}
				}
				// 商品代理员
				else if(this.user && this.user.role == 'PRODUCT_AGENT') {
					// 根据当前选择的心愿状态区分筛选面板内容
					if(computedCurrentStatus == 2) {
						// 设置筛选面板数据
						return true
					}
				}
				
				return false
			}
		},
		
		methods: {
			
			// 搜索心愿 开始刷新数据
			searchwishlist() {
				this.starttorefresh()
			},
			
			// 初始化选项卡数据
			initTabArr() {
				// 心愿单标识 -1全部 0心愿进行中 1心愿待确认 2心愿已确认代理待下单 3代理已下单客户待收货 4客户已收货心愿已完成 99心愿已关闭
				let tabArr = [
					{
						name: this.i18n.wishlist.common.achieveflagdata.all,
						status: -1,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.ing,
						status: 0,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.waittoconfirm,
						status: 1,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.makeorder,
						status: 2,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.waitreceive,
						status: 3,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.finish,
						status: 4,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.closed,
						status: 99,
						count: 0
					}
				]
				
				// 如果是代理员则前面添加心愿池选项 -2未关联心愿
				if(this.user && this.user.role == 'PRODUCT_AGENT') {
					let unbindwishitem = {
						name: this.i18n.wishlist.common.achieveflagdata.unbindwish,
						status: -2,
						count: 0,
					}
					tabArr.unshift(unbindwishitem)
				}
				
				// 设置选中索引
				let selectIndex = tabArr.findIndex(item => ( _this.currentStatus == item.status ))
				if(selectIndex > -1) { this.current = this.swiperCurrent = selectIndex }
				this.tabArr = tabArr
				
				// 获取角标数量
				this.getbadgenum()
			
			},
			
			// 设置初始化筛选项
			setFilterOptionData() {
				
				let agentStatusOption = [
					{
						label: this.i18n.wishlist.list.all,
						value: -1
					},
					{
						label: this.i18n.wishlist.list.agentstatus.unbind,
						value: 0
					},
					{
						label: this.i18n.wishlist.list.agentstatus.bind,
						value: 1
					}
				]
				this.agentStatusOption = agentStatusOption
				
				let payStatsuOption = [
					{
						label: this.i18n.wishlist.list.all,
						value: -1
					},
					{
						label: this.i18n.wishlist.list.paystatus.unpay,
						value: 0
					},
					{
						label: this.i18n.wishlist.list.paystatus.pay,
						value: 1
					}
				]
				this.payStatusOption = payStatsuOption
				
				let purchaseStatusOption = [
					{
						label: this.i18n.wishlist.list.all,
						value: -1,
					},
					{
						label: this.i18n.wishlist.list.purchasestatus.unpurchase,
						value: 0,
					},
					{
						label: this.i18n.wishlist.list.purchasestatus.purchase,
						value: 1,
					}
				]
				this.purchaseStatusOption = purchaseStatusOption
				
			},
			
			changeAgentStatus(value) {
				this.agentStatus = value
				this.starttorefresh()
			},
			
			changePayStatus(value) {
				this.payStatus = value
				this.starttorefresh()
			},
			
			changePurchaseStatus(value) {
				this.purchaseStatus = value
				this.starttorefresh()
			},
			
			// 重置筛选项
			resetFilterData() {
				this.agentStatus = -1
				this.payStatus = -1
				this.purchaseStatus = -1
			},
			
			// 获取操作条上的角标数量
			getbadgenum() {
				
				if(!this.user) {return}
				const db = uniCloud.database();
				let wherestr = this.user.role == 'MERCHANT_ADMIN' || this.user.role == 'MERCHANT_EMPLOYEE' ? `creatUser == $cloudEnv_uid` : this.user.role == 'PRODUCT_AGENT' ? `agentUser == $cloudEnv_uid` : ''
				db.collection('wishlist')
					.where(wherestr)
					.groupBy('achieveFlag')
					.groupField('count(*) as count')
					.get()
					.then(res => {
						
						let countdata = res.result.data
						// 设置achieveFlag = 0,1,2,3时的角标数量  没有的设置为0(防止更新为0时数据不更新的问题)
						// console.log(countdata);
						_this.tabArr.map((item) => {
							if(item.status == 0 || item.status == 1 || item.status == 2 || item.status == 3 ) {
								let selectitem = countdata.find(dataitem => (dataitem.achieveFlag == item.status))
								if(selectitem) {
									item.count = selectitem.count
								}
								else {
									item.count = 0
								}
							}
						})
						
					})
					.catch(err => {
						console.log(err.message);
					})
				
			},
			
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.tabs.setDx(dx);
			},
			
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.tabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				// 重置筛选条件
				this.resetFilterData()
			},
			
			// 获取指定下标的mescroll对象
			getMescroll(i){
				let mescrollItems = this.$refs.mescrollItem;
				if(mescrollItems){
					let item = mescrollItems[i]
					if(item) return item.mescroll
				}
				return null
			},
			
			//开始手动下拉刷新
			starttorefresh(){
				// 获取角标
				this.getbadgenum()
				this.$nextTick(function(){
					// 刷新当前数据
					let mescroll =this.getMescroll(this.current)
					console.log(mescroll);
					if(mescroll) {
						mescroll.resetUpScroll(true)
					}
				})
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	page,.wishlistview{
		height: 100%;
	}
</style>

<style>
	page{
		height: 100%;
	}
</style>
