<template>
	<view class="goodsdetailview bg-white">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue" isBack>
			<block slot="content">{{i18n.nav.goodsdetail}}</block>
		</cu-custom>
		
		<!-- 轮播图 -->
		<template>
			<!-- 普通轮播图 -->
			<swiper v-if="swiperData && swiperData.length < 3" class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500">
				<swiper-item v-for="(item,index) in swiperData" :key="index" @tap.stop="previewimg(index)">
					<image :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<!-- 卡片轮播图 -->
			<swiper v-if="swiperData && swiperData.length > 2" class="card-swiper round-dot bg-gray" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" @change="changeSwiper" indicator-color="#8799a3"
			 indicator-active-color="#0081ff">
				<swiper-item v-for="(img,index) in swiperData" :key="index" :class="swiperindex==index?'cur':''" @tap.stop="previewimg(index)">
					<view class="swiper-item">
						<image :src="img" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</template>
		
		<!-- 商品信息区域 -->
		<view v-if="product" class="goodsinfoview">
			
			<!-- 商品名称价格和简介 -->
			<view class="padding">
				<view class="goodstitleview t_threeline text-xxl text-black margin-bottom">{{product.title}}</view>
				<view class="goodspriceview text-red text-xl margin-bottom">{{ product.price }}</view>
				<view class="goodsdesview text-df">{{product.productIntro}}</view>
			</view>
			
			<!-- 商品其他信息展示 -->
			<view class="cu-list menu">
				
				<!-- 分类(仅展示) -->
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-tagfill text-orange margin-right-xs"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodstype}}</text>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange light">{{ `${product.firstTypeName}${product.subTypeName ? ' / ' + product.subTypeName : '' }`}}</view>
					</view>
				</view>
				
				<!-- 标识码(仅展示) -->
				<view class="cu-item" v-if="product.barCode && product.barCode.length > 0">
					<view class="content">
						<text class="cuIcon-qrcode text-blue margin-right-sm"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodsbarcode}}</text>
					</view>
					<view class="action">
						<text class="text-grey text-df">{{product.barCode}}</text>
					</view>
				</view>
				
				<!-- 规格展示 -->
				<view class="cu-item arrow" @tap.stop="previewspec">
					<view class="content">
						<text class="cuIcon-sort text-blue margin-right-xs"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodsspec}}</text>
					</view>
					
					<view class="action">
						<text class="text-gray text-df">{{ showspecstr ? showspecstr : i18n.base.select }}</text>
					</view>
				</view>
				
				<!-- 平台售价 -->
				<view class="cu-item arrow" @tap.stop="fixprice('price')">
					<view class="content">
						<text class="cuIcon text-red cuIcon-moneybagfill"></text>
						<text class="text-df text-black margin-right-sm">{{i18n.goods.price}}</text>
						<text class="text-sm text-red" v-if="selectstockinfo">{{selectstockinfo.price}}</text>
						
					</view>
					
					<view class="action">
						<text class="text-grey">{{i18n.goods.goodsdetail.fixprice}}</text>
					</view>
				</view>
				
				<!-- 成本价 -->
				<view class="cu-item arrow" @tap.stop="fixprice('costprice')">
					<view class="content">
						<text class="cuIcon cuIcon-moneybag"></text>
						<text class="text-df text-black margin-right-sm">{{i18n.goods.costprice}}</text>
						<text class="text-sm text-grey" v-if="selectstockinfo">{{selectstockinfo.costPrice}}</text>
					</view>
					
					<view class="action">
						<text class="text-grey">{{i18n.goods.goodsdetail.fixcostprice}}</text>
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!-- 底部操作按钮区域 -->
		<view class="optionview cu-bar btn-group bg-white">
			<button class="bg-gradual-blue lg round cu-btn" @tap.stop="editgoods">{{i18n.base.edit}}</button>
			<button class="bg-gradual-green lg round cu-btn" @tap.stop="jumptostockmanage">{{i18n.nav.stock}}</button>
		</view>
		
		
		<!--底部规格选择层-->
		<goodsspecselector v-if="pid" 
							:pid="pid"
							mykey="goodsdetail"
							:defaultselectattributeIds="selectattributeIdArr" 
							:ifshowpopup="ifshowpopup"
							@confirmselectspecinfo="confirmselectspec"
							@hidepopup="hidepopup">
		</goodsspecselector>
		
		<!-- 价格修改弹出框 -->
		<view class="cu-modal" v-if="selectstockinfo" :class=" ifshowmodal ?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ fixpricetype === 'costprice' ? i18n.goods.goodsdetail.fixcostprice : i18n.goods.goodsdetail.fixprice }}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-grey"></text>
					</view>
				</view>
				<view class="padding-xl">
					
					<!-- 当前规格展示 -->
					<view class="text-df text-left margin-bottom">{{`${i18n.goods.handlegoods.goodsspec}: ${showspecstr}`}}</view>
					
					<!-- 价格展示输入框 -->
					<input type="digit"
							class="borderbottom radius text-xl"
							maxlength="6" 
							:placeholder=" fixpricetype === 'costprice' ? `${i18n.goods.costprice}: ${selectstockinfo.costPrice}` : (fixpricetype === 'price' ? `${i18n.goods.price}: ${selectstockinfo.price}` : '') " 
							v-model="tempfixprice"
							:cursor-spacing="20"
							:focus="ifshowmodal"
							 />
					
				</view>
				<view class="cu-bar btn-group bg-white justify-around">
					<button class="cu-btn round lg line-grey text-grey" @tap="hideModal">{{i18n.base.cancel}}</button>
					<button class="cu-btn round lg bg-gradual-blue" :class=" ifshowfixbtnanimation ? 'animation-shake' : '' " @tap="confirmfixprice">{{i18n.base.confirm}}</button>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	var _this
	
	import goodstypepicker from '@/components/base/goodstypepicker.vue'
	import goodsspecselector from '@/components/base/goodsspecselector.vue'
	
	export default {
		
		components: {
			goodstypepicker,
			goodsspecselector,
		},
		
		data() {
			return {
				pid: null, // 商品主键id
				product: null, // 商品详情数据
				
				swiperindex: 0, // 轮播图的索引
				swiperData: null, // 轮播图数据
				
				selectattributeIdArr: [], // 默认选中的属性id数组
				
				selectstockinfo: null, // 当前选中的规格对象
				showspecstr: null, // 当前选中的规格名称文本
				ifshowpopup: false, // 是否显示底部规格弹框  默认为否不显示
				
				ifshowmodal: false, // 是否显示价格修改弹窗  默认为否
				fixpricetype: '', // 修改价格的类型  costprice为修改成本价  price为修改平台售价
				tempfixprice: '', // 临时输入价格变量
				ifshowfixbtnanimation: false, // 是否显示修改价格时的错误提示动画  默认为否
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let pid = option.pid
			_this.pid = pid
			
			// 加载商详信息
			_this.loaddetaildata()
			
			uni.$on('updateprodetail', function(){
				// 加载商详信息
				_this.loaddetaildata()
			})
			
		},
		
		onUnload() {
			uni.$off('updateprodetail')
		},
		
		methods: {
			
			// 加载商详信息
			loaddetaildata() {
				_this.$api.goodsapi.getgoodsdetail({pid: _this.pid}).then(response => {
					// 获取详情成功
					let product = response.data.product
					_this.product = product
					
					// 处理轮播数据
					let swiperData = []
					if(product.imgs){
						let imgsArr = product.imgs.split(',')
						imgsArr.forEach(imgurl => {
							let fullimgurl = _this.imgUrl + imgurl
							swiperData.push(fullimgurl)
						})
					}
					if(swiperData.length > 0) {_this.swiperData = swiperData}
					
					// 计算商品的价格
					_this.calculateproductprice()
					
				}).catch(error => {
					// 获取详情失败
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 计算商品价格
			calculateproductprice() {
				
				let product = _this.product
				// 处理商品价格数据
				let stockinfos = product.stockInfos
				let maxprice = Math.max.apply(Math, stockinfos.map(function(stockinfo) {return stockinfo.price}))
				let minprice = Math.min.apply(Math, stockinfos.map(function(stockinfo) {return stockinfo.price}))
				let showproductprice = `${minprice} ~ ${maxprice}`
				product.price = showproductprice
				
			},
			
			// 滑动轮播图
			changeSwiper(e) {
				let swiperindex = e.detail.current
				_this.swiperindex = swiperindex
			},
			
			// 查看大图
			previewimg(index) {
				uni.previewImage({
					urls: _this.swiperData,
					current: index
				})
			},
			
			// 更改商品分类
			selecttypeconfirm(selecttypeinfo) {
				let firstTypeId = selecttypeinfo.firstTypeId
				let secondTypeId = selecttypeinfo.secondTypeId
				
				console.log(`当前选中的商品分类为:${firstTypeId}---${secondTypeId}`);
				
			},
			
			// 预览规格
			previewspec() {
				_this.ifshowpopup = true
			},
			
			// 选择完某个库存规格
			confirmselectspec(info) {
				// 当前选择的库存
				let selectstockinfo = info.stockinfo
				this.selectstockinfo = selectstockinfo
				
				// 当前规格文本
				let showspecstr = info.showspecstr
				this.showspecstr = showspecstr
				
			},
			
			// 点击开始修改价格
			fixprice(pricetype) {
				
				// 判断是否已经选择了规格  没有的话提示请先选择规格
				if(this.selectstockinfo) {
					this.fixpricetype = pricetype
					this.ifshowmodal = true
				}
				else{
					uni.showToast({
						title: _this.i18n.tip.pleaseselectgoodspec,
						icon: 'none',
						duration: 1500
					});
					_this.ifshowpopup = true
				}
				
				
				
			},
			
			// 确定修改价格
			confirmfixprice() {
				
				let targetprice = this.tempfixprice
				
				// 校验数据
				if(!targetprice || targetprice === '') {
					this.ifshowfixbtnanimation = true
					setTimeout(function() {
						_this.ifshowfixbtnanimation = false
					}, 1500);
				}
				else{
					// 开始上送
					
					let data = {}
					if(this.fixpricetype === 'costprice') {
						data = {
							pid: this.pid,
							specId: this.selectstockinfo.specId,
							costPrice: targetprice
						}
					}
					else if(this.fixpricetype === 'price') {
						data = {
							pid: this.pid,
							specId: this.selectstockinfo.specId,
							price: targetprice
						}
					}
					
					this.$api.goodsapi.fixgoodsprice(data).then(response => {
						// 修改成功
						_this.hideModal() // 隐藏价格修改弹框
						// 将当前已经选中的属性id数组设置给规格属性选择器
						let selectattributeIdArr = []
						_this.selectstockinfo.computeAttributeValues.forEach(valueinfo => {
							selectattributeIdArr.push(valueinfo.attributeId)
						})
						_this.selectattributeIdArr = selectattributeIdArr
						// 重新请求数据
						_this.loaddetaildata()
						
					}).catch(error => {
						_this.ifshowfixbtnanimation = true
						setTimeout(function() {
							_this.ifshowfixbtnanimation = false
						}, 1500);
					})
					
				}
			},
			
			// 点击隐藏价格修改弹窗
			hideModal() {
				this.ifshowmodal = false
				this.tempfixprice = '' // 清除当前临时价格记录
			},
			
			// 点击隐藏底部规格选择弹出框
			hidepopup() {
				// 可以选择二次确认
				this.ifshowpopup = false
			},
			
			// 编辑商品
			editgoods() {
				uni.navigateTo({
					url: `/pages/goods/handlegoods?type=edit&pid=${this.pid}`
				});
			},
			
			// 出入库操作
			jumptostockmanage() {
				
				// 跳转出入库页面
				uni.navigateTo({
					url: `/pages/stock/index?pid=${_this.pid}`
				});
				
			}
		},
	}
</script>

<style lang="scss">
	page{
		
	}
	.goodsdetailview{
		
		padding-bottom: 60px;
		
		.optionview{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
		}

	}
</style>
