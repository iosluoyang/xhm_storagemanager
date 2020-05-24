<template>
	<view class="handlestockview">

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
				<!-- 商品库存 -->
				<text v-if="selectspecinfo" class="text-grey stockview margin-bottom-sm">{{ `${i18n.goods.stock}: ` }} <text class="text-bold text-black">{{selectspecinfo.stockCount}}</text>
				</text>

				<!-- 展示商品的所有规格 -->
				<view v-if="product && product.specs && product.specs.length > 0" class="allspecview flex flex-wrap align-center" :class=" ifremindspec ? 'animation-shake' : '' ">
					<view class="cu-tag round padding xl margin-bottom-sm" v-for="(specitem, index) in product.specs" :key="index" 
							:class="[ selectspecinfo && specitem.specId === selectspecinfo.specId ? 'bg-blue' : 'line-grey' ]"
							@tap.stop="selectspecinfo = specitem"
					>
						{{ specitem.attributeList.map((attributeitem) => {return attributeitem.attributeValue}).join('、') }}
						
					</view>
				</view>
				
				<!-- 商品规格和库存信息 -->
				<!-- <view class="flex align-center margin-bottom-sm">
					<view class="selectspecview cu-tag round bg-gradual-green margin-right" :class=" ifshowbtnanimationspec ? 'animation-shake' : '' "
					 @tap.stop="ifshowpopup=true">
						{{ showspecstr ? showspecstr : i18n.tip.pleaseselectgoodspec }}
					</view>

					<text v-if="selectspecinfo" class="text-grey stockview">{{ `${i18n.goods.stock}: ` }} <text class="text-bold text-black">{{selectspecinfo.stockCount}}</text>
					</text>
				</view> -->

			</view>

		</view>

		<!-- 操作区域 -->
		
		<!-- 出入库数量 -->
		<view class="cu-form-group margin">

			<view class="title">{{i18n.stock.amount}}:</view>
			<input :class=" ifremindamount ? 'animation-shake' : '' " type="number" v-model="typenumber" :placeholder="i18n.stock.typestocknumplacholder" />

		</view>
		
		<!-- 出库时价格类型 -->
		<radio-group class="block margin padding bg-white" :class=" ifremindpricetype ? 'animation-shake' : '' " @change="choosepricetype">
			<view class="text-df margin-bottom-sm">{{i18n.tip.pleaseselectpricetype}}:</view>
			<view class="cu-form-group">
				<view class="title">{{ i18n.goods.price }}</view>
				<radio :checked="Number(pricetype)===2" value="2"></radio>
			</view>
			<view class="cu-form-group">
				<view class="title">{{ i18n.goods.agentprice }}</view>
				<radio :checked="Number(pricetype)===3" value="3"></radio>
			</view>
			<view class="cu-form-group">
				<view class="title">{{ i18n.goods.creditprice }}</view>
				<radio :checked="Number(pricetype)===4" value="4"></radio>
			</view>
		</radio-group>
		

		<view class="cu-bar btn-group">
			<button class="cu-btn round lg shadow-blur bg-gradual-blue"
			 @tap.stop="fixstock('in')">{{i18n.stock.stockin}}</button>
			<button class="cu-btn round lg shadow-blur bg-gradual-green"
			 @tap.stop="fixstock('out')">{{i18n.stock.stockout}}</button>
		</view>


		<!--底部规格选择层-->
		<!-- <goodsspecselector 
			v-if="pid" 
			mykey="stock" 
			:pid="pid" 
			:defaultselectattributeIds="selectattributeIdArr" 
			:ifshowpopup="ifshowpopup"
			@confirmselectspecinfo="confirmselectspec" 
			@hidepopup="ifshowpopup=false"
		>
		</goodsspecselector> -->


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
				type: '', // 页面类型 stockout为出库  stockin为入库 ''为默认代表两者兼有
				pid: null, // 当前商品的pid

				product: null, // 当前操作的商品信息
				swiperData: [], // 商品图片数组

				selectattributeIdArr: [], // 默认选中的属性id数组


				ifshowpopup: false, // 是否显示底部选择框  默认为否
				selectspecinfo: null, // 当前选中的规格信息
				showspecstr: null, // 当前显示规格内容

				typenumber: '', // 当前输入的要编辑的库存数量
				pricetype: null, // 出库时选择的价格类型  价格类型	2平台销售价格	3代理价	4授信价
				
				ifremindspec: false, // 是否显示选择规格摇晃动画
				ifremindamount: false, // 是否显示提示数量摇晃动画
				ifremindpricetype: false, // 是否显示提示选择出库价格类型摇晃动画
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
			
			// 选择出库价格类型
			choosepricetype(e) {
				this.pricetype = Number(e.detail.value)
			},
			
			// 出库/入库
			fixstock(btntype) {
				
				// 检查当前选中的规格
				if (!_this.selectspecinfo) {
					uni.showToast({
						title: _this.i18n.error.lackspec,
						icon: 'none'
					});
					_this.ifremindspec = true
					setTimeout(function() {
						_this.ifremindspec = false
					}, 1500);
					return
				}

				// 检查输入库存信息
				let stockNum = this.typenumber
				
				// 点击入库情况下
				if (btntype === 'in') {

					if (stockNum === '' || parseInt(stockNum) === 0) {
						_this.ifremindamount = true
						setTimeout(function() {
							_this.ifremindamount = false
						}, 1500);
						return
					}

				}
				// 点击出库情况下
				else if (btntype === 'out') {
					
					// 校验出库数量
					if (parseInt(stockNum) > _this.selectspecinfo.stockCount || stockNum === '' || parseInt(stockNum) === 0) {
						_this.ifremindamount = true
						setTimeout(function() {
							_this.ifremindamount = false
						}, 1500);
						return
					}
					
					// 检查出库选择的价格类型
					else if(!_this.pricetype) {
						_this.ifremindpricetype = true
						setTimeout(function() {
							_this.ifremindpricetype = false
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
								stockCount: parseInt(stockNum),
								type: _this.pricetype
							}

							if (btntype === 'in') {
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
							} else if (btntype === 'out') {
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
	.handlestockview {
		.proimgsview {
			direction: ltr;
		}
	}
</style>
