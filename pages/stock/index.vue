<template>
	<view class="stockview">

		<cu-custom bgColor="bg-gradual-green" isBack>
			<block slot="content">{{i18n.nav.stock}}</block>
		</cu-custom>

		<!-- 商品信息区域 -->
		<view class="proinfoview margin padding radius shadow-warp bg-white" v-if="product">

			<view class="baseinfoview flex flex-direction">

				<!-- 商品图片集合 -->
				<view class="cu-avatar-group proimgsview margin-bottom-sm">
					<view class="cu-avatar round lg" v-for="(item,index) in swiperData" :key="index" :style="[{ backgroundImage:'url(' + item + ')' }]"></view>
				</view>

				<!-- 商品名称 -->
				<view class="t_threeline text-bold text-black margin-bottom-sm">{{product.title}}</view>

				<!-- 商品规格和库存信息 -->
				<view class="flex align-center margin-bottom-sm">
					<!-- 商品规格信息 -->
					<view class="selectspecview cu-tag round bg-gradual-green margin-right" :class=" ifshowbtnanimationspec ? 'animation-shake' : '' "
					 @tap.stop="ifshowpopup=true">
						{{ showspecstr ? showspecstr : i18n.tip.pleaseselectgoodspec }}
					</view>

					<!-- 商品库存信息 -->
					<text v-if="selectspecinfo" class="text-grey stockview">{{ `${i18n.goods.stock}: ` }} <text class="text-bold text-black">{{selectspecinfo.stockCount}}</text>
					</text>
				</view>

			</view>

		</view>

		<!-- 操作区域 -->
		<view class="cu-form-group margin">

			<view class="title">{{i18n.stock.amount}}:</view>
			<input type="number" v-model="typenumber" :placeholder="i18n.stock.typestocknumplacholder" />

		</view>

		<view class="cu-bar btn-group">
			<button class="cu-btn round lg shadow-blur line-green" :class=" ifshowbtnanimationin ? 'animation-shake' : '' "
			 @tap.stop="fixstock('in')">{{i18n.stock.stockin}}</button>
			<button class="cu-btn round lg shadow-blur bg-green" :class=" ifshowbtnanimationout ? 'animation-shake' : '' "
			 @tap.stop="fixstock('out')">{{i18n.stock.stockout}}</button>
		</view>


		<!--底部规格选择层-->
		<goodsspecselector 
			v-if="pid" 
			mykey="stock" 
			:pid="pid" 
			:defaultselectattributeIds="selectattributeIdArr" 
			:ifshowpopup="ifshowpopup"
			@confirmselectspecinfo="confirmselectspec" 
			@hidepopup="ifshowpopup=false"
		>
		</goodsspecselector>


	</view>
</template>

<script>
	import goodsspecselector from '@/components/base/goodsspecselector.vue'

	var _this
	export default {

		components: {
			goodsspecselector
		},

		data() {
			return {
				pid: null, // 当前商品的pid

				product: null, // 当前操作的商品信息
				swiperData: [], // 商品图片数组

				selectattributeIdArr: [], // 默认选中的属性id数组


				ifshowpopup: false, // 是否显示底部选择框  默认为否
				selectspecinfo: null, // 当前选中的规格信息
				showspecstr: null, // 当前显示规格内容

				typenumber: '', // 当前输入的要编辑的库存数量

				ifshowbtnanimationspec: false, // 是否显示选择规格按钮摇晃动画
				ifshowbtnanimationin: false, // 是否显示入库按钮摇晃动画
				ifshowbtnanimationout: false, // 是否显示入库按钮摇晃动画
			};
		},

		onLoad(option) {
			_this = this
			let pid = option.pid
			_this.pid = pid

			// 加载详情数据
			_this.loadprodetail()

		},

		methods: {

			// 加载详情数据
			loadprodetail() {

				_this.$api.goodsapi.getgoodsdetail({
					pid: _this.pid
				}).then(response => {
					// 获取数据成功
					let product = response.data.product
					_this.product = product

					// 处理轮播数据
					let swiperData = []
					if (product.imgs) {
						let imgsArr = product.imgs.split(',')
						imgsArr.forEach(imgurl => {
							let fullimgurl = _this.imgUrl + imgurl
							swiperData.push(fullimgurl)
						})
					}
					_this.swiperData = swiperData


				}).catch(error => {
					// 获取数据失败
					uni.showToast({
						title: `${_this.i18n.error.loaderror}`,
						icon: 'none'
					});
				})

			},

			// 选择完某个库存规格
			confirmselectspec(info) {

				// 当前选择的库存
				let selectspecinfo = info.specinfo
				this.selectspecinfo = selectspecinfo

				// 当前规格文本
				let showspecstr = info.showspecstr
				this.showspecstr = showspecstr

			},

			// 出库/入库
			fixstock(stocktype) {

				// 检查当前选中的规格
				if (!_this.selectspecinfo) {
					uni.showToast({
						title: _this.i18n.error.lackspec,
						icon: 'none'
					});
					_this.ifshowbtnanimationspec = true
					setTimeout(function() {
						_this.ifshowbtnanimationspec = false
					}, 1500);
					return
				}

				// 检查输入库存信息
				let stockNum = this.typenumber

				// 入库情况下
				if (stocktype === 'in') {

					if (stockNum === '' || parseInt(stockNum) === 0) {
						_this.ifshowbtnanimationin = true
						setTimeout(function() {
							_this.ifshowbtnanimationin = false
						}, 1500);
						return
					}

				}
				// 出库
				else if (stocktype === 'out') {

					// 校验出库数量
					if (parseInt(stockNum) > _this.selectspecinfo.stockCount || stockNum === '' || parseInt(stockNum) === 0) {
						_this.ifshowbtnanimationout = true
						setTimeout(function() {
							_this.ifshowbtnanimationout = false
						}, 1500);
						return
					}

				}

				uni.showModal({
					title: _this.i18n.base.tip,
					content: _this.i18n.tip.ifsuretofixstock,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if (res.confirm) {

							// 开始出入库
							let data = {
								pid: _this.pid,
								specId: _this.selectspecinfo.specId,
								stockCount: parseInt(stockNum)
							}

							if (stocktype === 'in') {
								_this.$api.goodsapi.stockin(data).then(response => {

									// 入库成功 刷新页面
									uni.showToast({
										title: _this.i18n.stock.stockin + _this.i18n.base.success
									});

									_this.typenumber = ''

									// 发送更新事件
									uni.$emit('updateprolist')
									uni.$emit('updateprodetail')

									setTimeout(function() {
										uni.navigateBack();
									}, 2000);


								}).catch(error => {
									uni.showToast({
										title: _this.i18n.error.loaderror,
										icon: 'none'
									});
								})
							} else if (stocktype === 'out') {
								_this.$api.goodsapi.stockout(data).then(response => {

									// 出库成功
									uni.showToast({
										title: _this.i18n.stock.stockout + _this.i18n.base.success
									});

									_this.typenumber = ''

									// 发送更新事件
									uni.$emit('updateprolist')
									uni.$emit('updateprodetail')

									setTimeout(function() {
										uni.navigateBack();
									}, 2000);

								}).catch(error => {
									uni.showToast({
										title: _this.i18n.error.loaderror,
										icon: 'none'
									});
								})
							}

						}
					}
				});


			},

		},

	}
</script>

<style scoped lang="scss">
	.stockview {
		.proimgsview {
			direction: ltr;
		}
	}
</style>
