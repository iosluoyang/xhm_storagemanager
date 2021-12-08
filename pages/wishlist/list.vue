<template>
	<view class="contentview wishlistview">
		
		<!-- 自定义导航栏 -->
		<cu-custom class="customnav" bgColor="bg-gradual-pink">
			
			<view slot="content" class="search-form round">
				<u-field v-model="searchText" type="text" icon="search" :label-width="0" :border-bottom="false" :placeholder="i18n.placeholder.wishlistlist.search" confirm-type="search" @confirm="searchwishlist"></u-field>
			</view>
			
		</cu-custom>

		<!-- 选项卡 -->
		<view class="u-tabs-box">
			<u-tabs-swiper active-color="#e03997" ref="tabs" :list="tabArr" :current="current" bar-width="100" :bold="false" @change="tabsChange" :is-scroll="true" swiperWidth="750"></u-tabs-swiper>
		</view>
		
		<!-- swiper区域 -->
		<swiper :style="{height: swiperHeight }" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(tabitem,index) in tabArr" :key="index">
				<wishlistMescrollSwiperItem ref="mescrollItem" :searchText="searchText" :i="index" :index="current" :tabs="tabArr" :height="swiperHeight"></wishlistMescrollSwiperItem>
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
				
				currentStatus: 0, // 默认选中的状态为进行中的状态
				searchText: '', // 搜索文本
				
				current: 0, // 当前选项卡的索引 默认为0
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				swiperHeight: ` calc(100% - ${this.CustomBar}px - 80rpx) `,
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
			
			// 监听更新事件
			uni.$on('updatewishlist', function(data) {
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
			
			// 初始化选项卡数据
			initTabArr() {
				
				// 心愿单标识 0 未代理	1 已代理待报价	2 已报价待确认	3 已确认已完成	90 已关闭
				// -1代表查询所有 为虚拟的一个status 放在未代理心愿tab的后面展示
				let tabArr = [
					{
						name: this.i18n.wishlist.common.achieveflagdata.unbindwish,
						status: 0,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.all,
						status: -1,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.ing,
						status: 1,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.waittoconfirm,
						status: 2,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.finish,
						status: 3,
						count: 0,
					},
					{
						name: this.i18n.wishlist.common.achieveflagdata.closed,
						status: 90,
						count: 0
					}
				]
				
				// 如果是管理员角色则调换数组第一和第二的顺序
				if(this.user.role == this.$basejs.roleEnum.admin) {
					let temp = tabArr[0]
					tabArr[0] = tabArr[1]
					tabArr[1] = temp
				}
				
				// 设置选中索引
				let selectIndex = tabArr.findIndex(item => ( _this.currentStatus == item.status ))
				if(selectIndex > -1) { this.current = this.swiperCurrent = selectIndex }
				this.tabArr = tabArr
				
				// 获取角标数量
				this.getbadgenum()
			
			},
			
			// 获取操作条上的角标数量
			getbadgenum() {
				
				const db = uniCloud.database();
				let wherestr = this.user.role == this.$basejs.roleEnum.merchantAdmin ? `creatUid == $cloudEnv_uid` : this.user.role == this.$basejs.roleEnum.productAgent ? ` agentUid == $cloudEnv_uid` : ''
				db.collection('wish')
					.where(wherestr)
					.groupBy('status')
					.groupField('count(*) as count')
					.get()
					.then(res => {
						
						let countdata = res.result.data
						// 注意遍历的顺序  考虑从非0到0的情况
						_this.tabArr.forEach(eachtab => {
							let existdataitem = countdata.find(dataitem => (dataitem.status == eachtab.status))
							eachtab.count = existdataitem ? existdataitem.count : 0
						})
						
					})
					.catch(err => {
						console.log(err.message);
					})
				
			},
			
			// 搜索心愿 开始刷新数据
			searchwishlist() {
				this.starttorefresh()
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
				this.$nextTick(function(){
					// 刷新当前数据
					let mescroll =this.getMescroll(this.current)
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
