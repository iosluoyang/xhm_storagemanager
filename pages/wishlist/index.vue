<template>
	<view class="wishlistview content">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.wish}}</block>
		</cu-custom>
		
		<!-- 搜索区域 -->
		<view class="searchview margin">
			
			<!-- 搜索框 -->
			<u-field class="round"
					style="background-color: #F5F5F5;"
					v-model="searchText" :placeholder="i18n.wishlist.index.searchplaceholder"
					:border-bottom="false" label-width="0"
					clear-size="45"
			>
				<!-- #ifndef H5 -->
				<button slot="right" class="cu-btn round bg-cyan shadow" @tap.stop="pasteData('searchText')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</u-field>
			
			<!-- 搜索按钮 -->
			<view class="cu-bar btn-group margin-top">
				<button class="cu-btn bg-gradual-pink shadow-blur round lg width100" @click="startSearch">{{ i18n.base.search }}</button>
			</view>
			
			<!-- 搜索记录区域  暂时屏蔽 -->
			<view v-if="false && searchrecord && searchrecord.length > 0" class="searchrecord bg-white">
				
				<view class="titleview flex margin align-center text-sm">
					{{ i18n.base.searchhistory }}
					<text class="cuIcon cuIcon-deletefill margin-left-sm text-red" @tap.stop="deleteAllRecord"></text>
				</view>
				
				<scroll-view scroll-x class="recordlistview padding-sm bg-gray" :style="{whiteSpace: 'nowrap'}">
					
					<view class="eachsearchrecord margin-left-sm shadow-blur shadow-warp bg-white radius padding-bottom-sm pos-relative" :style="{display: 'inline-block'}" v-for="(item, index) in searchrecord" :key="index" @tap.stop="searchRecord(item)">
						<!-- 删除按钮 -->
						<text class="cuIcon cuIcon-roundclosefill text-white pos-absolute" :style="{right: '10rpx', top: '10rpx', zIndex: 100}" @tap.stop="deleteRecord(index)"></text>
						<!-- 图片 -->
						<u-image :src="item.imgs.split(',')[0]" mode="aspectFill" width="150rpx" height="150rpx"></u-image>
						<!-- 标题 -->
						<view class="title margin-top-sm text-sm text-cut padding-left-sm" :style="{width: '150rpx', height: '30rpx', boxSizing: 'border-box'}">{{ item.title }}</view>
					</view>
					
				</scroll-view>
				
			</view>
			
		</view>
		
		<!-- 功能区域 -->
		<view class="grid col-2 padding-left padding-right margin-top-sm">
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-warp bg-gradual-pink" @tap.stop="checkwishlist">
					<view class="text-xsl">
						<text class="cuIcon cuIcon-likefill text-white"></text>
					</view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.wishlist }}</view>
				</view>
			</view>
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-warp bg-gradual-purple" @tap.stop="jumptoshoppingcart">
					<view class="text-xsl">
						<text class="cuIcon cuIcon-cartfill text-white pos-relative">
							<text v-if="shoppingCartNum" class="cu-tag badge">{{ shoppingCartNum }}</text>
						</text>
					</view>
					
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.shoppingcart }}</view>
					
				</view>
			</view>
			
			<!-- 暂时注释 -->
			<!-- <view class="padding-sm">
				<view class="padding radius text-center shadow-warp bg-gradual-blue" @tap.stop="gotoproductcategory">
					<view class="cuIcon-cascades text-white u-font-18"></view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.procategory }}</view>
				</view>
			</view> -->
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-warp bg-gradual-orange" @tap.stop="checkwishlistfavor">
					<view class="text-xsl">
						<text class="cuIcon cuIcon-favorfill text-white"></text>
					</view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.profavor }}</view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	
	var _this
	export default {
		
		data() {
			return {
				searchText: '', // 搜索文本
				searchrecord: null, // 搜索历史
			};
		},
		
		onLoad() {
			_this = this
			// 获取购物车数据
			this.$store.dispatch('user/getshoppingcartnum')
		},
		
		onShow() {
			// 加载搜索历史
			let searchrecord = uni.getStorageSync('searchrecordarr')
			this.searchrecord = searchrecord
		},
		
		computed: {
			// 购物车数量
			shoppingCartNum() {
				return this.$store.getters.shoppingcartNum
			},
		},
		
		methods: {
			
			// 粘贴内容
			pasteData(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
						}
					}
				})
			},
			
			// 开始搜索
			startSearch() {
				
				if(!this.searchText) {
					uni.showToast({
						title: this.i18n.wishlist.index.searchplaceholder,
						icon: 'none'
					});
					return
				}
				else {
					
					// 将搜索文本存储在本地
					let searchText = encodeURIComponent(this.searchText)
					uni.navigateTo({
						url: `/pages/product/prodetail?searchText=${searchText}&platform=1688`
					});
					
					// 清空搜索文本
					this.searchText = ''
					
				}
				
			},
			
			// 删除搜索记录
			deleteRecord(index) {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.cancel,
					confirmText: _this.i18n.confirm,
					success: res => {
						if(res.confirm) {
							
							_this.searchrecord.splice(index, 1)
							let searchrecordArr = uni.getStorageSync('searchrecordarr') || []
							searchrecordArr.splice(index, 1)
							uni.setStorageSync('searchrecordarr', searchrecordArr)
							
						}
					}
				});
				
				
			},
			
			// 删除所有搜索记录
			deleteAllRecord() {
				
				uni.showModal({
					content: `${this.i18n.tip.deleteconfirm}`,
					showCancel: true,
					cancelText: this.i18n.base.cancel,
					confirmText: this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							this.searchrecord = null
							uni.removeStorageSync('searchrecordarr')
						}
					}
				});
				
			},
			
			// 点击记录进行搜索
			searchRecord(item) {
				uni.navigateTo({
					url: `/pages/product/prodetail?pid=${item.pid}`
				});
			},
			
			// 查看心愿列表
			checkwishlist() {
				uni.navigateTo({
					url: '/pages/wishlist/list'
				});
			},
			
			// 跳转购物车页面
			jumptoshoppingcart() {
				uni.navigateTo({
					url: '/pages/makeorder/shoppingcart'
				});
			},
			
			// 跳转商品分类页面
			gotoproductcategory() {
				uni.navigateTo({
					url: '/pages/product/category'
				});
			},
			
			// 跳转商品收藏页面
			checkwishlistfavor() {
				uni.navigateTo({
					url: '/pages/product/favorlist'
				});
			},
			
			
			
			//
		},
	}

</script>

<style lang="scss" scoped>
	
	

</style>
