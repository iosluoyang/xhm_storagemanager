<template>
	<view class="linkprodetailview">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.prodetail}}</block>
		</cu-custom>
		
		<!-- 商品详情信息 -->
		<view v-if="linkProduct" class="prodetailview">
			
			<!-- 轮播图 -->
			<!-- card-swiper screen-swiper square-dot round-dot -->
			<swiper class="card-swiper square-dot bg-gray" :indicator-dots="true" :circular="true"
				indicator-color="#8799a3" indicator-active-color="#6739b6" 
				:autoplay="true" interval="3000" duration="300" @change="swiperChange">
				<swiper-item v-for="(item,index) in linkProduct.imgs.split(',')" :key="index"
								:class=" swiperIndex==index?'cur': '' "
								@tap.stop="previewImgs(linkProduct.imgs, index)"
				>
				
					<view class="swiper-item">
						<image :src="item" mode="aspectFill"></image>
					</view>
					
				</swiper-item>
			</swiper>
			
			<!-- 标题售价等区域 -->
			<view class="titleheaderview margin-top padding-left-sm padding-right-sm">
				<view class="title text-black text-bold text-xl" @longpress="$basejs.copytoclipboard(linkProduct.title)">{{ linkProduct.title }}</view>
				<view class="text-price text-red margin-top-sm u-font-40">{{ linkProduct.priceRange }}</view>
			</view>
			
			<!-- tab视图 -->
			<u-sticky :offset-top="stickyTop" z-index="555">
				<scroll-view scroll-x class="bg-white nav text-center">
					<view class="cu-item" :class="index==TabCur?'text-pink cur':''" v-for="(item,index) in tabArr" :key="index" @tap="tabSelect" :data-id="index">
						{{ item.title }}
					</view>
				</scroll-view>
			</u-sticky>
			
			<!-- tab内容区域 -->
			<view class="tabcontentview padding-left-sm padding-right-sm">
				
				<!-- 如果是详情 -->
				<view v-show="TabCur == 0" class="detailimgsview">
					<u-image v-for="(img,index) in linkProduct.detailImgs.split(',')" :key="index" :src="img" mode="widthFix" @click="previewImgs(linkProduct.detailImgs, index)">
						<u-loading slot="loading"></u-loading>
					</u-image>
				</view>
				
				<!-- 如果是属性 -->
				<view v-show="TabCur == 1" class="1688attributeListView">
					
					<u-cell-item :arrow="false" hover-class="none">
						<button slot="title" class="cu-btn round bg-blue" @click="translateattribute">
							<text class="margin-right-sm cuIcon cuIcon-global text-white"></text>
							{{ i18n.base.translate }}
						</button>
					</u-cell-item>
					
					<u-cell-item v-for="(item, index) in attributeList" :key="index"
								:title="item.attributeName" :value="item.attributeVal"
								:arrow="false" hover-class="none">
					</u-cell-item>
					
					
					
				</view>
				
				<!-- 如果是交易须知 -->
				<view v-show="TabCur == 2" class="tradeproptocolview">
					<u-parse :html="tradeprotocolcontent" :selectable="true" :show-with-animation="true" autoscroll></u-parse>
				</view>
				
			</view>
			
		</view>
		
		<!-- 底部操作条 -->
		<view v-if="linkProduct" class="bottomoptionview cu-bar bg-white tabbar border shop" :style="{zIndex: 3}">
			
			<!-- 联系客服按钮 -->
			<!-- #ifdef MP-WEIXIN -->
			<button class="action" open-type="contact">
				<view class="cuIcon-service text-green"></view>
				{{ i18n.base.customerservice }}
			</button>
			<!-- #endif -->
			
			<!-- 收藏按钮 -->
			<view class="action" @click="favorPro">
				<view :class="[ isFavor ? 'cuIcon-favorfill text-orange' : 'cuIcon-favor' ]"></view>
				{{ i18n.base.favor }}
			</view>
			
			<!-- 立即购买按钮 -->
			<view class="btn-group flex align-center ">
				<button class="cu-btn bg-gradual-pink round shadow-blur width50" @click="showSelector = true">{{ i18n.base.buynow }}</button>
			</view>
		
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 向上按钮 -->
		<mescroll-top :value="ifshowtoTop" :option="toTopopt" @click="clicktoTop"></mescroll-top>
		
		<!-- 多规格弹框 -->
		<wishSpecSelector v-if="linkProduct && specPropInfo"
							:specPropInfo="specPropInfo" 
							:ifshow.sync="showSelector"
							:defaultProTitle="linkProduct.title"
							:defaultProPrice="linkProduct.priceRange"
							@finishSelect="specFinishSelect">
		</wishSpecSelector>
		
	</view>
</template>

<script>
	
	var _this

	import mescrollTop from '@/components/mescroll-uni/components/mescroll-top.vue'
	import wishSpecSelector from '@/components/base/wishspecselector.vue'; // 多规格选择器
	
	export default {
		
		components: {
			mescrollTop,
			wishSpecSelector
		},
		
		data() {
			return {
				
				ifloading: false, // 是否正在加载
				lang: 'zh', // 语言
				
				type: 'searchText', // searchText代表通过搜索文本进行搜索  thirdPid代表通过第三方pid进行搜索
				
				searchText: '', // 搜索文本
				thirdPid: '', // 第三方pid
				
				linkProduct: null, // 外链商品详情
				attributeList: [], // 属性数组
				specPropInfo: null, // 规格对象
				
				swiperIndex: 0, // 索引
				isFavor: false, // 是否收藏
				
				TabCur: 0, // tab索引
				tabArr: [], // tab数据
				
				tradeprotocolcontent: '', // 交易须知富文本内容 
				
				showSelector: false, // 是否显示多规格选择器
				
				ifshowtoTop: false, // 是否显示向上按钮 默认一直显示
				toTopopt: {
					// 回到顶部按钮,需配置src才显示
					src: "http://www.mescroll.com/img/mescroll-totop.png?v=1", // 图片路径 (建议放入static目录, 如 /static/img/mescroll-totop.png )
					offset: 1000, // 列表滚动多少距离才显示回到顶部按钮,默认1000px
					right: 20, // 到右边的距离, 默认20 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
					bottom: 120, // 到底部的距离, 默认120 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
					width: 72 ,// 回到顶部图标的宽度, 默认72 (支持"20rpx", "20px", "20%"格式的值, 纯数字则默认单位rpx)
					radius: '50%'
				},
				
			};
		},
		
		computed: {
			
			// sticky的偏高值
			stickyTop() {
				// #ifdef H5
				return 0
				// #endif
				
				// #ifndef H5
				let toprpx = this.CustomBar / uni.getSystemInfoSync().windowWidth * 750
				console.log(`当前导航栏高度为:${this.CustomBar}`);
				console.log(`当前计算的top值为${toprpx}`);// 注意转成rpx单位
				return toprpx
				// #endif
			}
			
		},
		
		onPageScroll({scrollTop}) {
			this.ifshowtoTop = Boolean(scrollTop > this.toTopopt.offset)
		},
		
		onLoad(option) {
			
			_this = this
			
			if(option.type) {
				this.type = option.type
			}
			
			if(option.searchText) {
				// let searchText = uni.getStorageSync('linkprosearchtext')
				
				let searchText = decodeURIComponent(option.searchText)
				this.searchText = searchText
				// uni.removeStorageSync('linkprosearchtext')
			}
			
			let thirdPid = option.thirdPid
			if(thirdPid) this.thirdPid = thirdPid
			
			this.loadDetailData()
			
		},
		
		methods: {
			
			// 翻译属性值和属性名
			translateattribute() {
				
				let data = {
					lang: _this.currentLang,
					pid: _this.linkProduct.pid
				}
				
				// 开始加载规格信息
				uni.showLoading();
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'gettranslateattribute',
						info: data
					},
					success(res) {
						uni.hideLoading()
						if(res.result.code == 0) {
							
							let attributeList = res.result.data.list
							
							console.log(`当前的数据信息为`);
							console.log(attributeList);
							_this.attributeList = attributeList // 属性数组
							
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
						}
						
					},
					fail(error) {
						uni.hideLoading()
						console.log(`获取失败${JSON.stringify(error)}`);
						console.log(error.message);
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					}
				})
				
			},
			
			// 加载详情数据
			loadDetailData() {
				
				_this.ifloading = true
				let data = {
					text: this.searchText,
					thirdPid: this.thirdPid
				}
				// 开始加载规格信息
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getlinkdetail',
						info: data,
					},
					success(res) {
						
						_this.ifloading = false
						// console.log(`获取成功${JSON.stringify(res)}`);
						if(res.result.code == 0) {
							
							let linkProduct = res.result.data.product
							
							// console.log(`当前的数据信息为`);
							// console.log(linkProduct);
							_this.attributeList = linkProduct.attributeList // 属性数组
							_this.specPropInfo = linkProduct.specPropInfo // 规格对象
							_this.isFavor = linkProduct.favorFlag == 1 // 是否收藏
							
							_this.linkProduct = linkProduct
							
							// 获取翻译版本的属性列表
							// _this.$nextTick(function(){
							// 	_this.translateattribute()
							// })
							
							// 设置tab切换
							_this.setTabData()
							
						}
						else {
							
							uni.showModal({
								content: _this.i18n.wishlist.prodetail.havenolinkprodata,
								showCancel: true,
								cancelText: _this.i18n.base.cancel,
								confirmText: _this.i18n.base.confirm,
								success: res => {
									if(res.confirm) {
										uni.redirectTo({
											url: '/pages/wishlist/handlewish?type=add'
										});
									} 
								}
							});
							
						}
						
					},
					fail(error) {
						_this.ifloading = false
						console.log(error.message);
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					}
				})
				
				// _this.$api.productapi.get1688prodetail(data).then(response => {
					
				// 	_this.ifloading = false
					
				// 	let linkProduct = response.data.product
					
				// 	console.log(`当前的数据信息为`);
				// 	console.log(linkProduct);
				// 	_this.attributeList = linkProduct.attributeList // 属性数组
				// 	_this.specPropInfo = linkProduct.specPropInfo // 规格对象
					
				// 	_this.linkProduct = linkProduct
					
				// 	// 设置tab切换
				// 	_this.setTabData()
					
				// }).catch(error => {
				// 	_this.ifloading = false
				// 	console.log(`获取失败${JSON.stringify(error)}`);
				// 	console.log(error.msg || error);
				// 	// uni.showToast({
				// 	// 	title: error.msg,
				// 	// 	icon: 'none'
				// 	// });
					
				// 	uni.showModal({
				// 		content: `系统暂未找到该商品,是否手动添加心愿单`,
				// 		showCancel: true,
				// 		cancelText: _this.i18n.base.cancel,
				// 		confirmText: _this.i18n.base.confirm,
				// 		success: res => {
				// 			if(res.confirm) {
				// 				uni.redirectTo({
				// 					url: '/pages/wishlist/handlewish?type=add'
				// 				});
				// 			} 
				// 		}
				// 	});
					
				// })
				
			},
			
			// 点击向上按钮
			clicktoTop() {
				uni.pageScrollTo({
					scrollTop:0,
					duration: 300,
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
						title: _this.i18n.wishlist.prodetail.detail,
						key: "detail"
					},
					{
						title: _this.i18n.wishlist.prodetail.attribute,
						key: "attribute"
					},
					{
						title: _this.i18n.wishlist.prodetail.tradeprotocol,
						key: "tradeprotocol"
					}
				]
				
				this.tabArr = tabs
				
				// 设置交易须知内容
				let tradeprotocolcontent = this.$store.getters.configData.tradeprotolrichtext || ''
				this.tradeprotocolcontent = tradeprotocolcontent
			},
			
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			
			// 收藏商品
			favorPro() {
				let linkProduct = this.linkProduct
				const db = uniCloud.database();
				
				// 如果是收藏则添加记录  如果是取消收藏则删除记录
				if(this.isFavor) {
					// 取消收藏
					const dbCmd = db.command
					db.collection('favorpro').where(dbCmd.or({thirdPid: linkProduct.thirdPid},{pid: linkProduct.pid})).remove()
					.then(res => {
						
						if(res.result.code == 0) {
							uni.showToast({
								title: this.i18n.tip.optionsuccess,
								icon: 'none'
							});
							_this.isFavor = false
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
						}
						
					}).catch(error => {
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					})
				}
				else {
					// 开始收藏
					let data = {thirdPid: linkProduct.thirdPid,pid: linkProduct.pid}
					db.collection('favorpro').add(data).then(res => {
						if(res.result.code == 0) {
							uni.showToast({
								title: this.i18n.tip.optionsuccess,
								icon: 'none'
							});
							_this.isFavor = true
						}
						else {
							uni.showToast({
								title: res.result.message,
								icon: 'none'
							});
						}
						
					}).catch(error => {
						uni.showToast({
							title: error.message,
							icon: 'none'
						});
					})
				}
				
			},
			
			// 选择完规格
			specFinishSelect(selectSpecPropInfo) {
				console.log(`当前选择完规格的数据为`);
				console.log(selectSpecPropInfo);
				// 跳转心愿单发布详情页面 替换规格对象为选择过之后的规格对象
				if(selectSpecPropInfo) {
					let newLinkProduct = {...this.linkProduct, ...{specPropInfo: selectSpecPropInfo}, ...{sourceLink: this.searchText}}
					console.log(newLinkProduct);
					uni.setStorageSync('productInfo1688', newLinkProduct)
					uni.redirectTo({
						url: '/pages/wishlist/handlewish?type=add'
					});
				}
				
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	.linkprodetailview{
		
		padding-bottom: 50px;
		
		.bottomoptionview{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
		}
	}
</style>
