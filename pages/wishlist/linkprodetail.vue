<template>
	<view class="linkprodetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.goodsdetail}}</block>
		</cu-custom>
		
		<!-- 商品详情信息 -->
		<view v-if="linkProduct" class="prodetailview padding-left-sm padding-right-sm">
			
			<!-- 轮播图 -->
			<swiper class="card-swiper square-dot" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" @change="swiperChange">
				<swiper-item v-for="(item,index) in linkProduct.imgs.split(',')" :key="index"
								:class=" swiperIndex==index?'cur': '' "
								indicator-color="#8799a3"
								indicator-active-color="#0081ff"
								@tap.stop="previewImgs(linkProduct.imgs, index)"
				>
								
					<view class="swiper-item">
						<image :src="item" mode="aspectFill"></image>
					</view>
					
				</swiper-item>
			</swiper>
			
			<!-- 标题售价等区域 -->
			<view class="titleheaderview">
				<view class="title text-bold text-xl">{{ linkProduct.title }}</view>
				<view class="text-price text-lg text-red margin-top-sm">{{ linkProduct.priceRange }}</view>
			</view>
			
			<!-- tab视图 -->
			<u-sticky offset-top="0" enable h5-nav-height="44">
				<scroll-view scroll-x class="bg-white nav text-center">
					<view class="cu-item" :class="index==TabCur?'text-pink cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
						{{ item.title }}
					</view>
				</scroll-view>
			</u-sticky>
			
			<swiper :style="{ height: 'calc(100vh - 45px - 45px - 50px )' }" :indicator-dots="false" :autoplay="false" :duration="300" :current="TabCur" skip-hidden-item-layout disable-touch>
				<swiper-item v-for="(item, index) in tabArr" :key="item.key">
					<view class="swiper-item height100" style="overflow: auto;">
						
						<!-- 如果是详情 -->
						<template v-if="item.key == 'detail'">
							<u-image v-for="(img,index) in linkProduct.detailImgs.split(',')" :key="index" :src="img" mode="widthFix" @click="previewImgs(linkProduct.detailImgs, index)"></u-image>
						</template>
						
						<!-- 如果是属性 -->
						<template v-else-if="item.key == 'attribute'">
							<view  class="cu-list menu sm-border 1688attributeListView">
								<view class="cu-item" v-for="(item, index) in linkProduct.attributeList" :key="index">
									<view class="content basis-sm">
										<text class="text-grey text-cut">{{ item.attributeName }}</text>
									</view>
									<view class="action">
										<text class="text-grey text-sm">{{item.attributeVal }} </text>
									</view>
								</view>
							</view>
						</template>
						
						<!-- 如果是交易须知 -->
						<template v-else-if="item.key == 'tradeprotocol'">
							<u-parse :html="tradeprotocolcontent" :selectable="true" :show-with-animation="true" autoscroll></u-parse>
						</template>
						
					</view>
				</swiper-item>
			</swiper>
			
		</view>
		
		<!-- 底部操作条 -->
		<view style="position: fixed;bottom: 0;left: 0;right: 0;z-index: 1000;" class="bottomoptionview cu-bar bg-white tabbar border shop">
			<button class="action" open-type="contact">
				<view class="cuIcon-service text-green">
					<view class="cu-tag badge"></view>
				</view>
				客服
			</button>
			<view class="action">
				<view class=" cuIcon-shop"></view> 店铺
			</view>
			<view class="action">
				<view class="cuIcon-cart">
					<view class="cu-tag badge">99</view>
				</view>
				购物车
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red round shadow-blur">立即订购</button>
			</view>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				
				ifloading: false, // 是否正在加载
				searchText: '', // 搜索文本
				linkProduct: null, // 外链商品详情
				
				swiperIndex: 0, // 索引
				
				TabCur: 0, // tab索引
				tabArr: [], // tab数据
				
				tradeprotocolcontent: '', // 交易需知富文本内容 
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let searchText = option.searchText
			if(!searchText) {
				uni.showToast({
					title: this.i18n.tip.needtoinputcontent,
					icon: 'none'
				});
				return
			}
			
			this.searchText = decodeURI(searchText)
			this.loadDetailData()
			
		},
		
		methods: {
			
			// 加载详情数据
			loadDetailData() {
				
				_this.ifloading = true
				
				// 开始加载规格信息
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlinkdetail',
						info: {
							text: this.searchText
						}
					},
					success(res) {
						_this.ifloading = false
						console.log(`获取成功${JSON.stringify(res)}`);
						if(res.result.code == 0) {
							
							let linkProduct = res.result.data.product
							
							console.log(`当前的数据信息为`);
							console.log(linkProduct);
							_this.linkProduct = linkProduct
							
							// 设置tab切换
							_this.setTabData()
							
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
						}
						
					},
					fail(error) {
						_this.ifloading = false
						console.log(`获取失败${JSON.stringify(error)}`);
						console.log(error.message);
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					}
				})
				
			},
			
			swiperChange(e) {
				this.swiperIndex = e.detail.current;
			},
			
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 设置tab切换
			setTabData() {
				let tabs = [
					{
						title: "详情",
						key: "detail"
					},
					{
						title: "属性参数",
						key: "attribute"
					},
					{
						title: "订购须知",
						key: "tradeprotocol"
					}
				]
				
				this.tabArr = tabs
				
				// 设置交易须知内容
				let tradeprotocolcontent = `
					<p>交易须知</p>
					<img src="https://cbu01.alicdn.com/img/ibank/O1CN012bU9k21NvxSACT7Z4_!!2206610561633-0-cib.jpg" />
				`
				this.tradeprotocolcontent = tradeprotocolcontent
			},
			
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
