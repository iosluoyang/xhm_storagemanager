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
				<text class="stockview margin-bottom-sm">
					<text class="text-grey">{{ `${i18n.goods.stock}: ` }} </text>
					<text v-if="selectspecinfo" class="text-bold text-black">{{selectspecinfo.stockCount}}</text>
				</text>

				<!-- 展示商品的所有规格 -->
				<view class="specsview margin-bottom-sm">
					
					<view class="text-grey margin-bottom-sm">{{ `${i18n.goods.handlegoods.goodsspec}: ` }} </view>
					<view v-if="product && product.specs && product.specs.length > 0" class="allspecview flex flex-wrap align-center" :class=" ifremindspec ? 'animation-shake' : '' ">
						<view class="cu-tag round padding xl margin-bottom-sm" v-for="(specitem, index) in product.specs" :key="index" 
								:class="[ selectspecinfo && specitem.specId === selectspecinfo.specId ? 'bg-blue' : 'line-grey' ]"
								@tap.stop="selectspecinfo = specitem"
						>
							{{ specitem.attributeList.map((attributeitem) => {return attributeitem.attributeValue}).join('、') }}
							
						</view>
					</view>
					
				</view>

			</view>

		</view>

		<!-- 操作区域 -->
		
		<!-- 出入库数量 -->
		<view class="cu-form-group margin-left margin-right">

			<view class="title">{{i18n.stock.amount}}:</view>
			<input :class=" ifremindamount ? 'animation-shake' : '' " type="number" v-model="typenumber" :placeholder="i18n.stock.typestocknumplacholder" />

		</view>
		
		<!-- 其他选择项 -->
		<view class="cu-list menu margin-left margin-right solid-top">
			
			<!-- 出库客户 -->
			<view class="cu-item arrow" :class=" ifremindcustomer ? 'animation-shake' : '' " @tap.stop="starttoselectcustomer">
				<view class="title">
					{{i18n.stock.customer}}:
				</view>
				<view class="action">
					{{ selectcustomer ? selectcustomer.customer : i18n.base.select }}
				</view>
			</view>
			
			<!-- 出库价格类型 -->
			<view class="cu-item arrow" :class=" ifremindpricetype ? 'animation-shake' : '' " @tap.stop="ifshowmodal=true">
				<view class="title">
					{{i18n.stock.pricetype}}:
				</view>
				<view class="action">
					{{ selectpriceinfo ? selectpriceinfo.name : i18n.base.select }}
				</view>
			</view>
			
			
		
		</view>
		
		
		<!-- 切换出库价格的单选框弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''" @tap.stop="ifshowmodal=false">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="changepricetype">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(priceinfo,index) in priceTypeList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{priceinfo.name}}</view>
								<radio class="round" :class=" selectpriceinfo && selectpriceinfo.type === priceinfo.type ? 'checked' : '' " :checked=" selectpriceinfo === priceinfo.type "
								 :value="priceinfo.type.toString()"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		
		
		<view class="cu-bar btn-group optionbtnview bg-white">
			<button class="cu-btn round lg shadow-blur bg-gradual-blue"
			 @tap.stop="fixstock('in')">{{i18n.stock.stockin}}</button>
			<button class="cu-btn round lg shadow-blur bg-gradual-green"
			 @tap.stop="fixstock('out')">{{i18n.stock.stockout}}</button>
		</view>

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
				specId: null, // 当前选中的规格id

				product: null, // 当前操作的商品信息
				swiperData: [], // 商品图片数组
				priceTypeList: [], // 当前的价格类型(出库时选择使用)

				selectspecinfo: null, // 当前选中的规格信息
				selectcustomer: null, // 当前选中的客户信息
				ifshowmodal: false, // 是否显示价格类型选择的单选框 默认为否
				selectpriceinfo: null, // 当前选中的价格类型信息(出库时使用) 出库时选择的价格类型  其中的type代表价格类型	2平台销售价格	3代理价	4授信价

				typenumber: '', // 当前输入的要编辑的库存数量
				
				
				ifremindspec: false, // 是否显示选择规格摇晃动画
				ifremindamount: false, // 是否显示提示数量摇晃动画
				ifremindcustomer: false, // 是否显示提示客户信息摇晃动画
				ifremindpricetype: false, // 是否显示提示选择出库价格类型摇晃动画
			};
		},

		onLoad(option) {
			_this = this
			
			let pid = option.pid
			_this.pid = pid
			
			let specId = option.specId
			_this.specId = Number(specId)
			
			// 价格类型  其中的type代表价格类型	2平台销售价格	3代理价	4授信价
			let priceTypeList = [
				{
					name: _this.i18n.goods.price,
					type: 2
				},
				{
					name: _this.i18n.goods.agentprice,
					type: 3
				},
				{
					name: _this.i18n.goods.creditprice,
					type: 4
				}
			]
			this.priceTypeList = priceTypeList

			// 加载详情数据
			_this.loadprodetail()
			
			uni.$on('selectcustomer', function(selectcustomer) {
				_this.selectcustomer = selectcustomer
			})

		},
		
		destroyed() {
			uni.$off('selectcustomer')
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
					
					// 遍历当前规格 根据传入的规格id设置选中规格对象
					if(_this.product.specs && _this.product.specs.length > 0) {
						let selectspecinfo = _this.product.specs.find((specinfo) => {
							return specinfo.specId === _this.specId
						})
						_this.selectspecinfo = selectspecinfo
					}

				}).catch(error => {
					// 获取数据失败
					uni.showToast({
						title: `${_this.i18n.error.loaderror}`,
						icon: 'none'
					});
				})

			},
			
			// 开始选择出库客户信息
			starttoselectcustomer() {
				uni.navigateTo({
					url: `/pages/customer/index?type=select`
				});
			},
			
			// 切换价格类型
			changepricetype(e) {
				let pricetype = Number(e.detail.value)
				this.selectpriceinfo = this.priceTypeList.find((priceinfo) => {
					return priceinfo.type === pricetype
				})
				console.log(`${JSON.stringify(this.selectpriceinfo)}`);
				this.ifshowmodal = false
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
					else if(!_this.selectpriceinfo) {
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
								customerId: _this.selectcustomer ? _this.selectcustomer.customerId : null,
								type: _this.selectpriceinfo ? _this.selectpriceinfo.type : null
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
		padding-bottom: 100px;
		.proimgsview {
			direction: ltr;
		}
		
		.optionbtnview{
			position: fixed;
			z-index: 999;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
