<template>
	<view class="wishfavorlistview pagecontent">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{ i18n.nav.mywishlistfavor }}</block>
		</cu-custom>
		
		<!-- mescroll区域  通过fixed来进行定位处理-->
		<mescroll-body class="mescroll" @init="mescrollInit" @down="downCallback" @up="upCallBack">
			
			<view class="goodslistview">
				
				<view class="eachgood flex align-center margin padding solid-bottom bg-white" v-for="(item, index) in dataArr" :key="index" @tap.stop="gotoprodetail(item)">
					
					<!-- 商品首图 -->
					
					<u-image style="flex-shrink: 0;" :src="item.productInfo.imgs.split(',')[0]" width="150" height="150"></u-image>
					
					<!-- 商品内容 -->
					<view class="margin-left flex flex-direction">
						
						<!-- 商品名称 -->
						<text class="text-black text-df t_twoline">{{item.productInfo.title}}</text>
						
						<!-- 价格 和 取消收藏按钮-->
						<view class="priceinfo margin-top-sm flex align-center justify-between">
							<text class="text-red text-price text-lg">{{item.productInfo.priceRange}}</text>
							<text class="cuIcon cuIcon-favorfill text-orange u-font-40" @tap.stop="unfavoritem(index)"></text>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
		</mescroll-body>
		
	</view>
</template>

<script>
	var _this
	
	import MescrollUni from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	import MescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js
	
	export default {
		
		components: {
			MescrollUni,
			MescrollBody
		},
		
		mixins: [MescrollMixin],
		
		props: {
			
		},
		
		data() {
			return {
				dataArr: [], // 数据源数组
			};
		},
		
		onLoad(option) {
			_this = this
		},
		
		methods: {
			
			//上拉加载
			upCallBack(mescroll){
								
				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : mescroll.date // 请求时间标识
				let dataArr = [...this.dataArr]
				
				const db = uniCloud.database();
				db.collection('favorpro,linkproduct1688')
				.where(`creatUser == $cloudEnv_uid`)
				.field('pid as productInfo, thirdPid, favorTime, creatUser')
				.orderBy(`favorTime desc`)
				.skip((pageNum - 1) * pageSize)
				.limit(pageSize)
				.get()
				.then(response => {
					
					if(response.result.code == 0) {
						
						// 加载成功
						let list = response.result.data || []
						// 将查询出来的对应商品数组取第一个作为对象
						list.map((eachpro => ( eachpro.productInfo = eachpro.productInfo[0] )))
						console.log(list);

						if(pageNum == 1) {
							dataArr = [] //清空数据源
							mescroll.scrollTo(0,0) // 如果是第一页则滑动到顶部
						} 
						//将请求的数据添加至现有数据源中
						dataArr = dataArr.concat(list)
						_this.dataArr = dataArr
						
						// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
						_this.$nextTick(()=>{
							let hasNext = list.length === mescroll.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
							mescroll.endSuccess(list.length,hasNext)
						})
						
					}
					else {
						// 失败隐藏下拉加载状态
						mescroll.endErr()
					}
					
				})
				.catch(error => {
					// 失败隐藏下拉加载状态
					mescroll.endErr()
				})

			},
			
			// 取消收藏
			unfavoritem(index) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							let item = _this.dataArr[index]
							const db = uniCloud.database();
							db.collection('favorpro').doc(item._id).remove()
							.then(response => {
								// 取消收藏成功
								uni.showToast({
									title: _this.i18n.tip.optionsuccess,
									icon: 'none'
								});
								
								_this.dataArr.splice(index,1)
								
							})
							.catch(error => {
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
							})
							
						}
					}
				});
				
			},
			
			// 点击详情
			gotoprodetail(item) {
				let thirdPid = item.productInfo.thirdPid
				uni.navigateTo({
					url: `/pages/wishlist/linkprodetail?thirdPid=${thirdPid}`
				});
			},
			
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
