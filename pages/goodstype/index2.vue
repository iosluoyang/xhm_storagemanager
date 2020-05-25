<template>
	<view class="goodstypeview" :style="[{paddingTop: ( 50) + 'px'}]">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-red" isBack>
			<block slot="content">{{i18n.nav.goodstype}}</block>
		</cu-custom>
		
		<!-- 搜索框 -->
		<view class="cu-bar bg-white search fixed" :style="[{top:CustomBar + 'px'}]">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" :placeholder="i18n.tip.searchtype" v-model="searchText" confirm-type="search"></input>
			</view>
			<view class="action">
				<button class="cu-btn bg-gradual-red shadow round" @tap.stop="starttosearch">{{i18n.base.confirm}}</button>
			</view>
		</view>
		
		<!-- 左右两侧垂直滚动区域 -->
		<view class="VerticalBox" style="height:calc(100vh - 50px - 55px)">
			
			<!-- 左侧滚动区域 -->
			<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:100%">
				<view class="cu-item" :class="index==tabCur?'text-red cur':''" v-for="(typeinfo,index) in typelist" :key="index" @tap="TabSelect"
				 :data-id="index">
					{{ typeinfo.typeName }}
				</view>
			</scroll-view>
			
			<!-- 右侧滚动区域 -->
			<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:100%"
			 :scroll-into-view="'main-'+mainCur" @scroll="VerticalMain">
				<view class="padding-top padding-lr" v-for="(typeinfo,index) in typelist" :key="index" :id="'main-'+index">
					
					<!-- 标题头 -->
					<view class="cu-bar solid-bottom bg-white">
						<view class="action">
							<text class="cuIcon-title text-green"></text> {{ typeinfo.typeName }}</view>
					</view>
					
					<!-- 附属的二级分类 -->
					<view class="cu-list menu-avatar">
						
						<view class="cu-item" :class="modalName=='move-box-'+ secondtypeinfo.typeId.toString()?'move-cur':''" v-for="(secondtypeinfo,index) in typeinfo.childList" :key="index"
						 @touchstart="ListTouchStart" @touchmove="ListTouchMove" @touchend="ListTouchEnd" :data-target=" 'move-box-' + secondtypeinfo.typeId.toString()">
							<view class="cu-avatar round lg secondtypeimgview"></view>
							<view class="content">
								<view class="text-grey">文晓港</view>
								<view class="text-gray text-sm">
									<text class="cuIcon-infofill text-red  margin-right-xs"></text> 消息未送达</view>
							</view>
							<view class="action">
								<view class="text-grey text-xs">22:20</view>
								<view class="cu-tag round bg-grey sm">5</view>
							</view>
							<view class="move">
								<view class="bg-grey">置顶</view>
								<view class="bg-red">删除</view>
							</view>
						</view>
					
					</view>
				
				</view>
			</scroll-view>
		
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifshowloading"></loading>
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				searchText: '', // 搜索文本
				
				typelist: [], // 分类数据列表
				modalName: null,
				listTouchStart: 0,
				listTouchDirection: null,
				
				list: [],
				tabCur: 0,
				mainCur: 0,
				verticalNavTop: 0,
				load: true
			};
		},
		onLoad() {
			
			_this = this
			
			let list = [{}];
			for (let i = 0; i < 26; i++) {
				list[i] = {};
				list[i].name = String.fromCharCode(65 + i);
				list[i].id = i;
			}
			this.list = list;
			this.listCur = list[0];
			
			
			// 加载分类数据
			this.loadgoodstypelist()
			
		},
		onReady() {
			uni.hideLoading()
		},
		methods: {
			
			// 加载商品分类数据
			loadgoodstypelist() {
				
				this.ifshowloading = true // 显示加载条
				
				// 加载分类数据
				this.$api.goodsapi.gettypelist().then(response => {
					
					this.ifshowloading = false // 隐藏加载条
					
					// 获取分类列表成功
					let typelist = response.data.list
					
					let newtypelist = []
					
					// 将系统添加的分类名称找到对应的国际化名称
					typelist.forEach((firsttypeinfo, firstindex) => {
						firsttypeinfo.typeName = firsttypeinfo.sysFlag === 1 ? _this.i18n.base[firsttypeinfo.typeName] : firsttypeinfo.typeName
						if(firsttypeinfo.childList && firsttypeinfo.childList.length > 0) {
							firsttypeinfo.childList.forEach((secondtypeinfo, secondindex) => {
								secondtypeinfo.typeName = secondtypeinfo.sysFlag === 1 ? _this.i18n.base[secondtypeinfo.typeName] : secondtypeinfo.typeName
							})
						}
						newtypelist.push(firsttypeinfo)
					})
					
					_this.typelist = newtypelist
					
					
				}).catch(error => {
					
					this.ifshowloading = false // 隐藏加载条
					
					// 获取分类失败
					uni.showToast({
						title: this.i18n.error.getgoodstypeerror,
						icon: 'none'
					});
				})
				
			},
			
			// 开始搜索
			starttosearch() {
				let searchText = this.searchText
				console.log(`当前的搜索文本是${searchText}`);
			},
			
			TabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.mainCur = e.currentTarget.dataset.id;
				this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50
			},
			
			VerticalMain(e) {
				// #ifdef MP-ALIPAY
				   return false  //支付宝小程序暂时不支持双向联动 
				// #endif
				let that = this;
				let tabHeight = 0;
				if (this.load) {
					for (let i = 0; i < this.list.length; i++) {
						let view = uni.createSelectorQuery().select("#main-" + this.list[i].id);
						view.fields({
							size: true
						}, data => {
							this.list[i].top = tabHeight;
							tabHeight = tabHeight + data.height;
							this.list[i].bottom = tabHeight;
						}).exec();
					}
					this.load = false
				}
				let scrollTop = e.detail.scrollTop + 10;
				for (let i = 0; i < this.list.length; i++) {
					if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
						this.verticalNavTop = (this.list[i].id - 1) * 50
						this.tabCur = this.list[i].id
						console.log(scrollTop)
						return false
					}
				}
			},
			
			// ListTouch触摸开始
			ListTouchStart(e) {
				this.listTouchStart = e.touches[0].pageX
			},
			
			// ListTouch计算方向
			ListTouchMove(e) {
				this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left'
			},
			
			// ListTouch计算滚动
			ListTouchEnd(e) {
				if (this.listTouchDirection == 'left') {
					this.modalName = e.currentTarget.dataset.target
				} else {
					this.modalName = null
				}
				this.listTouchDirection = null
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	
	.VerticalNav.nav {
		width: 250upx;
		white-space: initial;
	}

	.VerticalNav.nav .cu-item {
		width: 100%;
		text-align: center;
		background-color: #fff;
		margin: 0;
		border: none;
		height: 50px;
		position: relative;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: "";
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
		
		.secondtypeimgview{
			background-image: url('~@/static/publicicon/logo.png');
		}
		
	}
</style>
