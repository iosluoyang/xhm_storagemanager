<template>
	<view class="wishfavorlistview pagecontent">

		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-orange">
			<block slot="content">{{ i18n.nav.profavor }}</block>
		</cu-custom>
		
		<!-- 小程序中存在插槽问题 暂时不用udb -->
		<!-- <unicloud-db v-slot:default="{data, loading, error, options}" ref="udb" 
			collection="product-favor,product"
			where="creatUid == $cloudEnv_uid" orderby="favorTime desc" 
			page-data="add" :page-size="10" @load="loaddata">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading" class="cu-load loading"></view>
			<view v-else>
				<view class="goodslistview">

					<view class="eachgood flex align-center margin padding solid-bottom bg-white"
						v-for="(item, index) in data" :key="index" @tap.stop="gotoprodetail(item)">

						<u-image style="flex-shrink: 0;" :src="item.productInfo.imgs.split(',')[0]" width="150"
							height="150"></u-image>

						<view class="margin-left flex flex-direction">

							<text class="text-black text-df t_twoline">{{item.productInfo.title}}</text>

							<view class="priceinfo margin-top-sm flex align-center justify-between">
								<text class="text-red text-price text-lg">{{item.productInfo.price}}</text>
								<text class="cuIcon cuIcon-favorfill text-orange u-font-40"
									@tap.stop="unfavoritem(item)"></text>
							</view>

						</view>

					</view>

				</view>
			</view>
		</unicloud-db> -->

		<!-- mescroll区域  通过fixed来进行定位处理-->
		<mescroll-body class="mescroll" @init="mescrollInit" @down="downCallback" @up="upCallBack">

			<view class="goodslistview">

				<view class="eachgood flex align-center margin padding solid-bottom bg-white"
					v-for="(item, index) in dataArr" :key="index" @tap.stop="gotoprodetail(item)">

					<!-- 商品首图 -->

					<u-image style="flex-shrink: 0;" :src="item.productInfo.imgs.split(',')[0]" width="150"
						height="150"></u-image>

					<!-- 商品内容 -->
					<view class="margin-left flex flex-direction">

						<!-- 商品名称 -->
						<text class="text-black text-df t_twoline">{{item.productInfo.title}}</text>

						<!-- 价格 和 取消收藏按钮-->
						<view class="priceinfo margin-top-sm flex align-center justify-between">
							<text class="text-red text-price text-lg">{{item.productInfo.price}}</text>
							<text class="cuIcon cuIcon-favorfill text-orange u-font-40"
								@tap.stop="unfavoritem(index)"></text>
						</view>

					</view>

				</view>

			</view>

		</mescroll-body>

	</view>
</template>

<script>
	var _this

	import MescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue'
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js" // 引入mescroll-mixins.js

	export default {

		components: {
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

		onPullDownRefresh() { 
			//下拉刷新
			
			// this.$refs.udb.loadData({
			// 	clear: true //可选参数，是否清空数据
			// }, () => {
			// 	uni.stopPullDownRefresh()
			// })
			
			_this.mescroll.resetUpScroll(true)
		},
		onReachBottom() { 
			//滚动到底翻页
			// this.$refs.udb.loadMore()
		},

		methods: {

			// 加载数据
			loaddata(data, ended) {
				data.map((eachpro => (eachpro.productInfo = eachpro.pid[0])))
			},

			//上拉加载
			upCallBack(mescroll) {

				let pageNum = mescroll.num; // 页码, 默认从1开始
				let pageSize = mescroll.size; // 页长, 默认每页10条
				let date = pageNum === 1 ? '' : mescroll.date // 请求时间标识
				let dataArr = [...this.dataArr]

				const db = uniCloud.database();
				db.collection('product-favor,product')
					.where(`creatUid == $cloudEnv_uid`)
					.foreignKey('product-favor.pid')
					.orderBy(`favorTime desc`)
					.skip((pageNum - 1) * pageSize)
					.limit(pageSize)
					.get()
					.then(response => {

						if (response.result.code == 0) {

							// 加载成功
							let list = response.result.data || []
							// 将查询出来的对应商品数组取第一个作为对象
							list.map((eachpro => (eachpro.productInfo = eachpro.pid[0])))

							if (pageNum == 1) {
								dataArr = [] //清空数据源
								mescroll.scrollTo(0, 0) // 如果是第一页则滑动到顶部
							}
							//将请求的数据添加至现有数据源中
							dataArr = dataArr.concat(list)
							_this.dataArr = dataArr

							// 如果渲染的数据较复杂,可延时隐藏下拉加载状态: 如
							_this.$nextTick(() => {
								let hasNext = list.length === mescroll.size //如果当前页的数据量不等于每页请求的数据量  则说明已经没有下一页了
								mescroll.endSuccess(list.length, hasNext)
							})

						} else {
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
				let item = _this.dataArr[index]
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if (res.confirm) {

							// let id = item._id
							// _this.$refs.udb.remove(id,{
							// 	needConfirm: false
							// })
							
							const db = uniCloud.database();
							db.collection('product-favor')
							.doc(item._id)
							.remove()
							.then(response => {
								if(response.result.code == 0) {
									// 取消收藏成功
									uni.showToast({
										title: _this.i18n.tip.optionsuccess,
										icon: 'none'
									});
									_this.dataArr.splice(index, 1)
								}
								else {
									uni.showToast({
										title: _this.i18n.error.optionerror,
										icon: 'none'
									});
								}
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
				uni.navigateTo({
					url: `/pages/product/prodetail?pid=${item.productInfo.pid}`
				});
			},

		},
	}
</script>

<style lang="scss" scoped>

</style>
