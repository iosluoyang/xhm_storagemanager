<template>
	<view class="linkprodetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.goodsdetail}}</block>
		</cu-custom>
		
		<!-- 商品详情信息 -->
		<view v-if="linkProduct" class="prodetailview" style="padding-bottom: 50px;">
			
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
			<view class="titleheaderview padding-left-sm padding-right-sm">
				<view class="title text-bold text-xl">{{ linkProduct.title }}</view>
				<view class="text-price text-lg text-red margin-top-sm">{{ linkProduct.priceRange }}</view>
			</view>
			
			<!-- tab视图 -->
			<u-sticky offset-top="0" enable h5-nav-height="44" z-index="555">
				<scroll-view scroll-x class="bg-white nav text-center">
					<view class="cu-item" :class="index==TabCur?'text-pink cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
						{{ item.title }}
					</view>
				</scroll-view>
			</u-sticky>
			
			<!-- tab内容区域 -->
			<view class="tabcontentview padding-left-sm padding-right-sm">
				
				<view v-for="(item, index) in tabArr" :key="item.key">
					
					<!-- 如果是详情 -->
					<view v-if="item.key == 'detail'" v-show="tabArr[TabCur].key == item.key" class="detailimgsview">
						<u-image v-for="(img,index) in linkProduct.detailImgs.split(',')" :key="index" :src="img" mode="widthFix" @click="previewImgs(linkProduct.detailImgs, index)"></u-image>
					</view>
					
					<!-- 如果是属性 -->
					<view v-else-if="item.key == 'attribute'" v-show="tabArr[TabCur].key == item.key" class="cu-list menu sm-border 1688attributeListView">
						<view class="cu-item" v-for="(item, index) in linkProduct.attributeList" :key="index">
							<view class="content basis-sm">
								<text class="text-grey text-cut">{{ item.attributeName }}</text>
							</view>
							<view class="action">
								<text class="text-grey text-sm">{{item.attributeVal }} </text>
							</view>
						</view>
					</view>
					
					<!-- 如果是交易须知 -->
					<view v-else-if="item.key == 'tradeprotocol'" v-show="tabArr[TabCur].key == item.key" class="tradeproptocolview">
						<u-parse :html="tradeprotocolcontent" :selectable="true" :show-with-animation="true" autoscroll></u-parse>
					</view>
					
				</view>
				
			</view>
			
		</view>
		
		<!-- 底部操作条 -->
		<view style="position: fixed;bottom: 0;left: 0;right: 0;z-index: 666;" class="bottomoptionview cu-bar bg-white tabbar border shop">
			
			<!-- 联系客服按钮 -->
			<!-- #ifndef MP-WEIXIN -->
			<button class="action" open-type="contact">
				<view class="cuIcon-service text-green"></view>
				{{ i18n.base.customerservice }}
			</button>
			<!-- #endif -->
			
			<!-- 收藏按钮 -->
			<view class="action" @click="isFavor = !isFavor">
				<view :class="[ isFavor ? 'cuIcon-favorfill text-orange' : 'cuIcon-favor' ]"></view>
				{{ i18n.base.favor }}
			</view>
			
			<!-- 立即购买按钮 -->
			<view class="btn-group">
				<button class="cu-btn bg-gradual-pink round shadow-blur" @click="showSelector = true">{{ i18n.base.buynow }}</button>
			</view>
		
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 多规格弹框 -->
		<wishSpecSelector v-if="linkProduct && linkProduct.specPropInfo" :specPropInfo="linkProduct.specPropInfo"  :ifshow.sync="showSelector"
							:defaultProImg="linkProduct.imgs && linkProduct.imgs.split(',').length > 0 ? linkProduct.imgs.split(',')[0] : '' "
							:defaultProTitle="linkProduct.title"
							:defaultProPrice="linkProduct.priceRange"
							@finishSelect="specFinishSelect">
		</wishSpecSelector>
		
	</view>
</template>

<script>
	
	var _this
	import wishSpecSelector from '@/components/base/wishspecselector.vue'; // 多规格选择器
	
	export default {
		
		components: {
			wishSpecSelector
		},
		
		data() {
			return {
				
				ifloading: false, // 是否正在加载
				searchText: '', // 搜索文本
				linkProduct: null, // 外链商品详情
				
				swiperIndex: 0, // 索引
				isFavor: false, // 是否收藏
				
				TabCur: 0, // tab索引
				tabArr: [], // tab数据
				
				tradeprotocolcontent: '', // 交易需知富文本内容 
				
				showSelector: false, // 是否显示多规格选择器
				
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
							uni.showModal({
								content: `系统暂未找到该商品,请检查链接是否正确,可以选择重试或者手动添加心愿单`,
								showCancel: true,
								cancelText: `重试`,
								confirmText: '手动添加',
								success: res => {
									if(res.cancel) {
										_this.loadDetailData()
									}
									else if(res.confirm) {
										uni.redirectTo({
											url: '/pages/wishlist/handlewish?type=add'
										});
									}
								}
							});
							// uni.showToast({
							// 	title: res.result.message,
							// 	icon: 'none'
							// });
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
			
			// 选择完规格
			specFinishSelect(selectSpecPropInfo) {
				console.log(`当前选择完规格的数据为`);
				console.log(selectSpecPropInfo);
				// 跳转心愿单发布详情页面
				if(selectSpecPropInfo) {
					let newLinkProduct = {...this.linkProduct, ...{selectSpecPropInfo: selectSpecPropInfo}, ...{sourceLink: this.searchText}}
					uni.setStorageSync('productInfo1688', newLinkProduct)
					uni.navigateTo({
						url: '/pages/wishlist/handlewish?type=add'
					});
				}
				
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
