<template>
	<view class="wishlistview content">
		
		<!-- 导航栏 -->
		<cu-custom bgColor="bg-gradual-pink" isBack>
			<block slot="content">{{i18n.nav.wishlist}}</block>
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
				<button class="cu-btn bg-gradual-orange shadow-blur round lg width100" @click="startSearch">{{ i18n.base.search }}</button>
			</view>
			
			<!-- 搜索记录区域 -->
			<view v-if="searchrecord1688 && searchrecord1688.length > 0" class="searchrecord bg-white">
				
				<view class="titleview flex margin align-center text-sm">
					{{ i18n.base.searchhistory }}
					<text class="cuIcon cuIcon-deletefill margin-left-sm text-red" @tap.stop="deleteAllRecord"></text>
				</view>
				
				<scroll-view scroll-x class="recordlistview padding-sm bg-gray" :style="{whiteSpace: 'nowrap'}">
					
					<view class="eachsearchrecord margin-left-sm shadow-blur shadow-warp bg-white radius padding-bottom-sm" :style="{display: 'inline-block'}" v-for="(item, index) in searchrecord1688" :key="index" @tap.stop="searchRecord(item)" @longpress="deleteRecord(index)">
												
						<!-- 图片 -->
						<u-image :src="item.img" mode="aspectFill" width="150rpx" height="150rpx"></u-image>
						<!-- 标题 -->
						<view class="title margin-top-sm text-sm text-cut" :style="{width: '150rpx', height: '30rpx', boxSizing: 'border-box'}">{{ item.title }}</view>
					</view>
					
				</scroll-view>
				
			</view>
			
		</view>
		
		<!-- 功能区域 -->
		<view class="grid col-2 padding-left padding-right margin-top-sm">
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-gradual-pink" @tap.stop="checkwishlist">
					<view class="cuIcon-likefill text-white u-font-18"></view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.mywishlist }}</view>
				</view>
			</view>
			
			<!-- 暂时注释 -->
			<!-- <view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-gradual-blue" @tap.stop="gotoproductcategory">
					<view class="cuIcon-cascades text-white u-font-18"></view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.procategory }}</view>
				</view>
			</view> -->
			
			<view class="padding-sm">
				<view class="padding radius text-center shadow-blur shadow-warp bg-gradual-orange" @tap.stop="checkwishlistfavor">
					<view class="cuIcon-favorfill text-white u-font-18"></view>
					<view class="margin-top-sm text-Abc text-bold">{{ i18n.nav.mywishlistfavor }}</view>
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
				searchrecord1688: null, // 搜索历史
			};
		},
		
		onLoad() {
			_this = this
			
		},
		
		onShow() {
			// 加载搜索历史
			let searchrecord1688 = uni.getStorageSync('searchrecordarr1688')
			this.searchrecord1688 = searchrecord1688
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
					// uni.setStorageSync('linkprosearchtext',this.searchText)
					let searchText = encodeURIComponent(this.searchText)
					
					uni.navigateTo({
						url: `/pages/wishlist/linkprodetail?type=searchText&searchText=${searchText}`
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
							
							_this.searchrecord1688.splice(index, 1)
							let searchrecord1688Arr = uni.getStorageSync('searchrecordarr1688') || []
							searchrecord1688Arr.splice(index, 1)
							uni.setStorageSync('searchrecordarr1688', searchrecord1688Arr)
							
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
							this.searchrecord1688 = null
							uni.removeStorageSync('searchrecordarr1688')
						}
					}
				});
				
			},
			
			// 点击记录进行搜索
			searchRecord(item) {
				let thirdPid = item.thirdPid
				uni.navigateTo({
					url: '/pages/wishlist/linkprodetail?thirdPid=' + thirdPid
				});
			},
			
			// 查看心愿列表
			checkwishlist() {
				uni.navigateTo({
					url: '/pages/wishlist/list'
				});
			},
			
			// 跳转商品分类页面
			gotoproductcategory() {
				uni.navigateTo({
					url: '/pages/wishlist/linkprocategory'
				});
			},
			
			// 跳转心愿收藏页面
			checkwishlistfavor() {
				uni.navigateTo({
					url: '/pages/wishlist/wishlistfavor'
				});
			},
			
		},
	}

</script>

<style lang="scss" scoped>
	
	

</style>
