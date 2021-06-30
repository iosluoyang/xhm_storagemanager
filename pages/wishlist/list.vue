<template>
	<view class="contentview wishlistview">
		
		<!-- 自定义导航栏 -->
		<cu-custom class="customnav" bgColor="bg-gradual-pink" isBack>
			
			<view slot="content" class="search-form round">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" :placeholder="i18n.tip.searchwish" v-model="searchText" @confirm="searchwishlist" confirm-type="search"></input>
			</view>
			
			<!-- 小程序中没有右侧搜索按钮 -->
			<!-- #ifndef MP -->
			<view slot="right" class="action">
				<button class="cu-btn bg-pink shadow-blur round" @tap.stop="searchwishlist">{{i18n.base.search}}</button>
			</view>
			<!-- #endif -->
			
		</cu-custom>
		
		<!-- 选项卡 -->
		<scroll-view scroll-x scroll-with-animation :scroll-left="scrollLeft" class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class=" index==current ? 'text-pink' : '' " v-for="(tabitem,index) in tabArr" :key="index" @tap="changetap" :data-index="index">
					<text>{{ tabitem.name }}</text>
					<view v-if="tabitem.count > 0 && (tabitem.status == 0 || tabitem.status == 1 || tabitem.status == 2)  " class="cu-tag badge pos-static">{{ tabitem.count > 99 ? '99+' : tabitem.count }}</view>
				</view>
			</view>
		</scroll-view>
		
		<!-- swiper视图 -->
		<swiper class="swiper-box" :style="{height: 'calc(100% - '+CustomBar+'px - 45px )'}" :current="current" disable-touch  @animationfinish="animationfinish">
			
			<swiper-item class="swiper-item" v-for="(tabitem,index) in tabArr" :key="index">
				
				<mescroll-uni class="mescroll bg-gray" :ref=" 'mescrollRef' + index.toString() " @init="mescrollInit" @down="downCallback" @up="upCallback" :down="downOption">
					
					<view class="wishlistview">
						<wishlistitem class="eachwish" v-for="(wishitem, wishindex) in tabitem.dataArr" :key="wishitem._id" :wishitem="wishitem"></wishlistitem>
					</view>
										
				</mescroll-uni>
				
			</swiper-item>
			
		</swiper>
		
	</view>
</template>

<script>
	
	var _this	
	
	// 引入mescroll-mixins.js
	import MescrollMixin from "@/components/mescroll-uni/mescroll-mixins.js";
	import wishlistitem from '@/components/wishlistitem/wishlistitem.vue'
	
	export default {
		
		data() {
			return {
				
				currentStatus: 0, // 默认选中的状态为进行中的状态
				searchText: '', // 搜索文本
				current: 0, // 当前选项卡的索引 默认为0
				scrollLeft: 0, // 选项卡左侧滑动的距离
				tabArr:[], // 选项卡数组
				mescrollArr: [], // mescroll组件数组  数量和tabArr保持一致
				
				//下拉刷新配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					isLock: false, // 是否锁定
				},
				
			};
		},
		
		mixins: [MescrollMixin], // 使用mixin
		
		components: {
			wishlistitem,
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
				
				let tabArr = [
					{
						name: this.i18n.base.all,
						status: -1,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.achieveFlag.ing,
						status: 0,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.achieveFlag.waittoconfirm,
						status: 1,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.achieveFlag.makeorder,
						status: 2,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.achieveFlag.finish,
						status: 3,
						loaded: false,
						count: 0,
						dataArr: []
					},
					{
						name: this.i18n.wishlist.achieveFlag.closed,
						status: 4,
						loaded: false,
						count: 0
					}
				]
				
				// 设置选中索引
				let selectIndex = tabArr.findIndex(item => ( _this.currentStatus == item.status ))
				if(selectIndex > -1) { this.current = selectIndex }
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
				
				// 暂时还未能获取自身uid下的数量
				const db = uniCloud.database();
				db.collection('wishlist')
					.where('creatUser == $cloudEnv_uid')
					.groupBy('achieveFlag')
					.groupField('count(*) as count')
					.get()
					.then(res => {
						console.log(`获取到的自己角标为:`);
						console.log(res);
						// 将各个状态的数量进行遍历设置
						let countdata = res.result.data
						countdata.forEach(item => {
							let achieveFlag = item.achieveFlag
							let count = item.count
							let selectitem = _this.tabArr.find(item => ( item.status == achieveFlag ))
							selectitem.count = count
						})
					})
					.catch(err => {
						console.log(err.message);
					})
				
			},
			
			// 切换tap
			changetap(e) {
				let index = e.currentTarget.dataset.index
				this.current = index
				this.scrollLeft = (index - 1) * 60
			},
			
			// swiper切换结束
			animationfinish({ detail: { current } }) {
				
				//第一次切换tab，动画结束后需要加载数据
				let tabItem = _this.tabArr[current]
				this.current = current
				this.scrollLeft = (current - 1) * 60
				
				//如果没有加载过该选项的数据  则进行下拉刷新的操作
				if(!tabItem.loaded){
					//第一次进入到该tab的话要进行数据的加载
					_this.starttorefresh()
				}
				
			},
			
			// 初始化mescroll 将其加入mescrollArr中
			mescrollInit(mescroll) {
				this.mescrollArr.push(mescroll)
			},
			
			//开始手动下拉刷新
			starttorefresh(){
				// 获取角标
				this.getbadgenum()
				// 刷新当前数据
				let mescroll = this.mescrollArr[this.current]
				mescroll.resetUpScroll(true)
			},
			
			// 下拉刷新的回调
			downCallback(mescroll) {
				// 手动刷新当前的mescroll数据
				this.starttorefresh()
			},
			
			// 上拉加载的回调
			upCallback(mescroll) {
	
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : mescroll.date // 请求时间标识
				let currenttabitem = this.tabArr[this.current]
				let dataArr = currenttabitem.dataArr
				
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
				// 代理员
				if(this.user.role.includes('PRODUCT_AGENT')) {
					// 如果是查询全部则查询所有还没有关联代理员的心愿单
					// 否则查询该代理员下的不同状态下的心愿单
					wherestr = achieveFlag == -1 ? ` (agentFlag == 0 || agentUser._id == $cloudEnv_uid) ` : ` achieveFlag == ${achieveFlag} && agentUser._id == $cloudEnv_uid`
					wherestr += ` && ${new RegExp(searchText, 'i')}.test(productTitle)`
				}
				// 普通供应商
				else if(this.user.role.includes('MERCHANT_ADMIN') || this.user.role.includes('MERCHANT_EMPLOYEE')) {
					wherestr = achieveFlag == -1 ? ` creatUser._id == $cloudEnv_uid && ${new RegExp(searchText, 'i')}.test(productTitle)` : ` achieveFlag == ${achieveFlag} && creatUser._id == $cloudEnv_uid && ${new RegExp(searchText, 'i')}.test(productTitle) `
				}
				
				db.collection('wishlist,uni-id-users')
					.where(wherestr)
					.field('creatUser{avatar, nickname},agentUser{avatar, nickname},agentFlag,achieveFlag,remindFlag,productTitle,imgs,targetAmount,targetPrice,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,creatTime,hurryLevel')
					.orderBy(` remindFlag desc, creatTime desc`)
					.skip((pageNum - 1) * pageSize)
					.limit(pageSize)
					.get()
					.then(response => {
						// 加载成功
						let list = response.result.data || []
						console.log(list);
						
						// 手动将creatUser的数据从数组转换为对象
						list.forEach(item => {
							item.creatUser = item.creatUser[0]
							item.agentUser = item.agentUser && item.agentUser.length > 0 ? item.agentUser[0] : null
						})
						console.log(`本次共获取${list.length}个数据,具体数据为:`);
						console.log(list);
						if(pageNum == 1) {
							dataArr = [] //清空数据源
							mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
						} 
						//将请求的数据添加至现有数据源中
						dataArr = dataArr.concat(list)
						//无法检测数组对象长度的变更 故使用$set方法进行变更
						_this.$set(currenttabitem,'dataArr',dataArr)
						_this.$set(currenttabitem,'loaded',true)
						
						// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
						_this.$nextTick(()=>{
							let hasNext = list.length === mescroll.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
							mescroll.endSuccess(list.length,hasNext)
						})
					})
					.catch(err => {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
						// 失败隐藏下拉加载状态
						mescroll.endErr()
					})
				
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	page{
		
		height: 100%;
		
		.wishlistview{
			
			height: 100%;
			
			.swiper-box{
				
				.swiper-item{
					width: 100%;
					height: 100%;
					
					.mescroll{
						width: 100%;
						height: 100%;
					}
				}
				
			}
		}
		
		/deep/.mescroll{
			.mescroll-empty{
				.empty-icon{
					display: inline-block;
				}
			}
		}
	}

</style>
