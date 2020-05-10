<template>
	<view class="home">
		
		<!-- 菜单列表 -->
		<scroll-view scroll-y class="page">
			
			<!-- 头部背景图片 -->
			<image src="/static/bgimgs/bg-sky.png" mode="widthFix" class="response"></image>
			
			<!-- 操作区域 -->
			<view class="nav-list">
				
				<block v-for="(item,index) in elements" :key="index">
					
					<view class="jumpitem nav-li" 
						:class="'bg-'+item.color"
						:style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
						@tap.stop="clickitem(item)"
					>
						<view class="nav-title">{{item.title}}</view>
						<view class="nav-name">{{item.name}}</view>
						<text :class="'cuIcon-' + item.cuIcon"></text>
					</view>
					
				</block>
				
			</view>
			
		</scroll-view>
		
		<!-- 切换语言按钮 -->
		<button class="languagebtn xl cu-btn radius bg-white text-black" @tap.stop="ifshowmodal=true">{{ showlanguagestr }}</button>
		
		<!-- 切换语言单选框弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''" @tap.stop="ifshowmodal=false">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block" @change="changelanguage">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(language,index) in languageArr" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{language.name}}</view>
								<radio class="round" :class=" currentlanguage === language.id ? 'checked' : '' " :checked=" currentlanguage === language.id "
								 :value="language.id"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				elements: [],
				languageArr: [], // 当前语言数组
				ifshowmodal: false, // 是否显示单选切换弹框  默认为否
			}
		},
		
		onLoad() {
			
			_this = this
			
			
			// 设置语言包
			this.setlanguage()
			
			
			// 设置主操作区域
			this.setmainoption()
			
		},
		
		computed: {
			
			currentlanguage() {
				return this._i18n.locale
			},
			
			showlanguagestr() {
				let language =  this.languageArr.find((language,index) => {
					return language.id === _this.currentlanguage
				})
				return language ? language.name : ''
			}
			
		},
		
		methods: {
			
			// 设置语言数组
			setlanguage() {
				
				let languageArr = [
					{
						name: '中文',
						id: 'zh',
					},
					{
						name: 'English',
						id: 'en',
					},
					{
						name: 'ภาษาไทย',
						id: 'th',
					}
				]
				this.languageArr = languageArr
				
			},
			
			// 设置主操作区域
			setmainoption() {
				
				// 加载完成之后开始设置数据源
				
				// 扫描功能
				let scanitem = {
					title: this.i18n.nav.scan,
					id: 'scan',
					name: 'Scan the QR',
					color: 'cyan',
					cuIcon: 'scan'
				}
				
				// 分类管理功能
				let typeitem = {
					title: this.i18n.nav.goodstype,
					id: 'producttype',
					name: 'Different Types',
					color: 'red',
					cuIcon: 'sort'
				}
				
				// 商品功能
				let goodsitem = {
					title: this.i18n.nav.goodslist,
					id: 'productlist',
					name: 'All the Product',
					color: 'blue',
					cuIcon: 'goodsfavor'
				}
				
				// 人员管理功能
				let memberitem = {
					title: this.i18n.nav.managepeople,
					id: 'management',
					name: 'About Member',
					color: 'purple',
					cuIcon: 'peoplelist'
				}
				
				// 库存管理功能
				let stockitem = {
					title: this.i18n.nav.stock,
					id: 'stockinout',
					name: 'Stock IN/OUT',
					color: 'green',
					cuIcon: 'order'
				}
				
				// 个人中心功能
				let personalitem = {
					title: this.i18n.nav.me,
					id: 'me',
					name: 'Personal',
					color: 'orange',
					cuIcon: 'people'
				}
				let elements = []
				// 根据当前的用户标识选择部分的功能显示(因为支持游客模式 所以只有登录状态下的管理员才能展示全部功能)
				// 超级管理员
				if(this.$basejs.ifloginflag() && this.user.type === 0){
					elements = [scanitem,typeitem,goodsitem,memberitem,stockitem,personalitem]
				}
				else{
					elements = [scanitem,typeitem,goodsitem,stockitem,personalitem]
				}
				
				this.elements = elements
				
			},
			
			// 跳转操作
			clickitem(item) {
				
				// 检查登录状态
				_this.$basejs.checklogin().then(() => {
					
					switch (item.id){
						// 扫一扫
						case 'scan':
						{
							// 开始扫一扫
							_this.$basejs.scanQR().then(vaildcontent => {
								
								// 扫描成功
								
								// 调用接口获取对应的pid
								_this.$api.goodsapi.getpidbyqrcode({barCode: vaildcontent}).then(response => {
									let pid = response.data.pid
									// 找到了对应的pid  直接跳转至商品详情页
									if(pid) {
										uni.navigateTo({
											url: `/pages/goods/goodsdetail?pid=${pid}`
										});
									}
									// 未找到pid 说明有该二维码但是没有对应的商品 提示用户
									else {
										uni.showModal({
											title: _this.i18n.base.tip,
											content: _this.i18n.error.qrcodewithoutgoods,
											showCancel: false,
											confirmText: _this.i18n.base.confirm
										});
									}
								}).catch(error => {
									uni.showModal({
										title: _this.i18n.base.tip,
										content: _this.i18n.error.scanerror,
										showCancel: false,
										confirmText: _this.i18n.base.confirm
									});
								})
								
							}).catch((othercontent) => {
								uni.showModal({
									content: othercontent,
									showCancel: false,
									confirmText: _this.i18n.base.confirm
								});
							})
						}
							break;
						// 商品分类
						case 'producttype':
						{
							uni.navigateTo({
								url: `/pages/goodstype/index`
							});
						}
							break;
						// 商品列表
						case 'productlist':
						{
							uni.navigateTo({
								url: `/pages/goods/goodslist`
							});
						}
							break;
						// 人员管理
						case 'management':
						{
							uni.navigateTo({
								url: `/pages/managepeople/index`
							});
						}
							break;
						// 库存管理
						case 'stockinout':
						{
							uni.showToast({
								title: _this.i18n.base.needtowait,
								icon: 'none'
							});
							// uni.navigateTo({
							// 	url: `/pages/stock/index`
							// });
						}
							break;
						// 我
						case 'me':
						{
							uni.navigateTo({
								url: `/pages/me/index`
							});
						}
							break;
						default:
							break;
					}
					
					
				})
				
			},
			
			// 切换语言
			changelanguage(e) {
				let selectlanguage = e.detail.value
				console.log(`当前选中的语言为:${JSON.stringify(selectlanguage)}`);
				let tempi18n = this._i18n
				tempi18n.locale = selectlanguage
				uni.setStorageSync('lang', selectlanguage)
				this.ifshowmodal = false
				this.setmainoption()
			},
			
			//
			
		}
	}
</script>

<style scoped lang="scss">
	
	page{
		background: #FFFFFF;
	}
	
	.home {
		height: 100vh;
		
		.languagebtn{
			position: fixed;
			top: 200upx;
			right: 20upx;
		}
		
	}
</style>
