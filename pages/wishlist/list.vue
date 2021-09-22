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
			<u-tabs-swiper active-color="#e03997" ref="tabs" :list="tabArr" :current="current" @change="tabsChange" :is-scroll="true" swiperWidth="750"></u-tabs-swiper>
		</view>
		
		<!-- swiper区域 -->
		<swiper :style="{height: 'calc(100% - '+CustomBar+'px - 80rpx )' }" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(tabitem,index) in tabArr" :key="index">
				<wishlistMescrollSwiperItem ref="mescrollItem" :searchText="searchText" :i="index" :index="current" :tabs="tabArr" :height=" 'calc(100% - '+CustomBar+'px - 80rpx )' "></wishlistMescrollSwiperItem>
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
				
				currentStatus: 0, // 默认选中的状态为进行中的状态
				searchText: '', // 搜索文本
				current: 0, // 当前选项卡的索引 默认为0
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				scrollLeft: 0, // 选项卡左侧滑动的距离
				tabArr:[], // 选项卡数组
				
			};
		},
		
		// mixins: [MescrollMixin], // 使用mixin
		
		components: {
			// wishlistitem,
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
			
			// 监听更新事件
			uni.$on('updatewishlist', function(data) {
				// 如果为拷贝心愿则切换到进行中
				if(data && data.type && data.type == 'copywish') {
					_this.currentStatus = 0
				}
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
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.ing,
						status: 0,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.waittoconfirm,
						status: 1,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.makeorder,
						status: 2,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.waitreceive,
						status: 3,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.finish,
						status: 4,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.closed,
						status: 99,
						loaded: false,
						count: 0
					}
				]
				
				// 如果是代理员则前面添加心愿池选项 -2未关联心愿
				if(this.user.role == 'PRODUCT_AGENT') {
					let unbindwishitem = {
						name: this.i18n.wishlist.common.achieveflagdata.unbindwish,
						status: -2,
						loaded: false,
						count: 0,
						dataArr: []
					}
					tabArr.unshift(unbindwishitem)
				}
				
				// 设置选中索引
				let selectIndex = tabArr.findIndex(item => ( _this.currentStatus == item.status ))
				if(selectIndex > -1) { this.current = this.swiperCurrent = selectIndex }
				this.tabArr = tabArr
				
				// 获取角标数量
				this.getbadgenum()
				
				// 更新完视图后进行手动刷新
				this.$nextTick(()=>{
					this.starttorefresh()
				})
				
			},
			
			// 获取操作条上的角标数量
			getbadgenum() {
				
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
				// 刷新当前数据
				let mescroll =this.getMescroll(this.current)
				console.log(mescroll);
				mescroll.resetUpScroll(true)
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	page,.wishlistview{
		
		height: 100%;
		
		.wishlistview{
			
			
		}
		
	}

</style>
