<template>
	<view class="content addwishview">
		
		<cu-custom isBack bgColor="bg-gradual-pink">
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>
		
		<!-- 填写的表单信息 -->
		<form>
			
			<!-- 商品标题 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.wishlist.producttitle}} :</view>
				<input type="text" v-model="productTitle" />
			</view>
			
			<!-- 源网站链接 -->
			<view class="cu-form-group margin-top">
				<view class="title">{{i18n.wishlist.sourcelink}} :</view>
				<input type="text" v-model="sourceLink" />
			</view>
			
			<!-- 源网站价格 -->
			<view class="cu-form-group">
				
				<view class="title">{{i18n.wishlist.sourceprice}} :</view>
				
				<input type="digit" class="borderCDCDCD" v-model="platformPrice" />
				
				<!-- 货币种类选择 -->
				<view class="flex align-center margin-left">
					<button class="cu-btn sm round margin-right" :class="platformmoneytype === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="platformmoneytype='RMB'">¥</button>
					<button class="cu-btn sm round " :class="platformmoneytype === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="platformmoneytype='THB'">฿</button>
				</view>

			</view>
			
			<!-- 期望价格 -->
			<view class="cu-form-group margin-top">
				
				<view class="title">{{i18n.wishlist.expectprice}} :</view>
				
				<input type="digit" class="borderCDCDCD" v-model="expectPrice" />
				
				<!-- 货币种类选择 -->
				<view class="flex align-center margin-left">
					<button class="cu-btn sm round margin-right" :class="expectmoneytype === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="expectmoneytype='RMB'">¥</button>
					<button class="cu-btn sm round " :class="expectmoneytype === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="expectmoneytype='THB'">฿</button>
				</view>
				
			</view>
			
			<!-- 期望数量 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.wishlist.expectamount}} :</view>
				<input type="text" v-model="expectAmount" />
			</view>
			
			<!-- 紧急程度 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.wishlist.hurrylevel}}</view>
				<picker :range="hurrylevelDataArr" range-key="name" :value="hurryLevel - 1" @change="hurrylevelchange">
					<view class="picker">
						<text v-for="item in (6-hurryLevel)" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
						<text class="margin-left-sm">{{ hurrylevelDataArr[hurryLevel - 1].name }}</text>
					</view>
				</picker>
			</view>
			
			<!-- 图片上传 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">{{i18n.wishlist.uploadimg}}</view>
				<view class="action">{{`${imgArr.length} / ${mainpiclimitnum}`}}</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					
					<view class="bg-img" v-for="(item, index) in imgArr" :key="index" @tap.stop="previewImg(index)">
						<image :src="item.path ? item.path : (imgUrl + item)" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="deleteimg(index)"><text class="cuIcon-close"></text></view>
					</view>
					
					<view v-if="imgArr.length < mainpiclimitnum" class="solids" @tap.stop="addImg">
						<text class="cuIcon cuIcon-cameraadd"></text>
					</view>

				</view>
			</view>
			
			<!-- 确定按钮 -->
			<view class="padding-xl" style="bottom: 0;position: fixed; left: 0; right: 0;">
				<button class="cu-btn block bg-gradual-pink lg" @tap.stop="uploaddata">
					<text v-if="ifloading" class="cuIcon-loading2 cuIconfont-spin"></text>
					<text>{{ ifloading ? `${i18n.tip.loadingstr}` : `${i18n.base.confirm}` }}</text>
				</button>
			</view>
			
			
		</form>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				
				type: 'add', // 页面状态 add新增 edit编辑
				productTitle: '', // 商品标题
				sourceLink: '', // 源网站链接
				platformPrice: '', // 源网站价格
				platformmoneytype: 'RMB', // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
				expectPrice: '', // 期望价格
				expectmoneytype: 'RMB', // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
				expectAmount: '', // 期望数量
				hurryLevel: 2, // 紧急程度 默认为2级 int 类型
				hurrylevelDataArr: [], // 紧急程度数据源数组
				mainpiclimitnum: 5, // 图片上传的数量限制
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				
			};
		},
		
		onLoad() {
			
			_this = this
			
			// 加载紧急程度数据源数组
			let hurrylevelDataArr = [
				{
					level: 1,
					name: this.i18n.wishlist.hurryleveldata.level1
				},
				{
					level: 2,
					name: this.i18n.wishlist.hurryleveldata.level2
				},
				{
					level: 3,
					name: this.i18n.wishlist.hurryleveldata.level3
				},
				{
					level: 4,
					name: this.i18n.wishlist.hurryleveldata.level4
				},
				{
					level: 5,
					name: this.i18n.wishlist.hurryleveldata.level5
				}
			]
			
			this.hurrylevelDataArr = hurrylevelDataArr
			
		},
		
		methods: {
			
			// 源网站价格币种选择
			platformmoneytypechange(e) {
				this.platformmoneytype = e.detail.value
			},
			
			// 期望价格币种选择
			expectmoneytypechange(e) {
				this.expectmoneytype = e.detail.value
			},
			
			// 紧急程度更改
			hurrylevelchange(e) {
				this.hurryLevel = e.detail.value + 1
			},
			
			// 添加图片
			addImg() {
				
				// 可添加的图片数量
				let canaddnum = this.mainpiclimitnum - this.imgArr.length
				this.$basejs.chooseImage({
					count: canaddnum,
					success(res) {
						// 如果选择数量超过可选数量则提示超出数量
						if(res.tempFiles.length > canaddnum) {
							uni.showToast({
								title: _this.i18n.error.chooseimgovererror,
								icon: 'none'
							});
							return
						}
						else {
							_this.imgArr = _this.imgArr.concat(res.tempFiles)
						}
					}
				})
				
			},
			
			// 查看大图
			previewImg(index) {
				
				// 组装预览图的数据
				let previewimgArr = []
				this.imgArr.forEach((imgitem, index) => {
					if(imgitem.path) {
						previewimgArr.push(imgitem.path)
					}
					// 带有标识的图片链接  即为后台返回的图片链接  此时要加上前缀
					else if(imgitem.indexOf(_this.imgTagStr) != -1) {
						previewimgArr.push(_this.imgUrl + imgitem)
					}
					// 未带有标识的图片链接 直接加入预览数组
					else {
						previewimgArr.push(imgitem)
					}
				})
				
				// 开始预览
				uni.previewImage({
					urls: previewimgArr,
					current: index
				})
				
			},
			
			// 删除图片
			deleteimg(index) {
				this.imgArr.splice(index,1)
			},
			
			// 上传图片
			uploadpic(imgArr) {
				
				return new Promise((resolve,reject) => {
					
					// 图片长度为空则直接返回resolve
					if(!imgArr || imgArr.length == 0) {
						resolve('')
						return
					}
										
					// 区分新增和编辑状态
					if(_this.type === 'add') {
						
						_this.ifloading = true // 开始加载动画
						// 开始上送图片
						let tempimgArr = [...imgArr]
						
						_this.$basejs.uploadmultipleimgs(tempimgArr).then(imgUrls => {
							// 上传图片成功
							_this.ifloading = false // 结束加载动画
							let imgs = imgUrls.join(',')
							resolve(imgs)
						}).catch(error => {
							_this.ifloading = false // 结束加载动画
							reject(error)
						})
						
					}
					else if(_this.type === 'edit') {
						// 编辑状态下
						_this.ifloading = true // 开始加载动画
						let needtoindexArr = []
						let needtouploadArr = []
						imgArr.forEach((imgitem,index) => {
							// 如果是本地文件则会有path值
							if(imgitem.path) {
								needtoindexArr.push(index)
								needtouploadArr.push(imgitem)
							}
						})
						
						_this.$basejs.uploadmultipleimgs(needtouploadArr).then(imgUrls => {
														
							// 上传图片成功
							_this.ifloading = false // 结束加载动画
							let copymainimgArr = [..._this.mainimgArr]
							imgUrls.forEach((imgUrl, index) => {
								copymainimgArr.splice(needtoindexArr[index], 1, imgUrl)
							})
							let imgs = copymainimgArr.join(',')
							resolve(imgs)
						
						}).catch(error => {
							_this.ifloading = false // 结束加载动画
							reject(error)
						})
						
					}
					else {
						reject()
					}
					
				})
				
			},
			
			// 上传数据
			uploaddata() {
				
				// 进行数据检查
				
				// 检查是否有商品标题
				if(!this.productTitle) {
					uni.showToast({
						title: this.i18n.error.lackgoodstitle,
						icon: 'none'
					});
					return false
				}
				// 检查是否有图片
				else if(this.imgArr.length == 0) {
					uni.showToast({
						title: this.i18n.error.lackgoodsmainpic,
						icon: 'none'
					});
					return false
				}
				
				// 其余项均为选填项
				
				// 开始上传图片
				this.uploadpic(this.imgArr).then(imgs => {
					
					// 上传图片成功 开始上传所有数据
					let info = {
						productTitle: _this.productTitle, // 商品标题
						sourceLink: _this.sourceLink, // 源网站链接
						platformPrice: _this.platformPrice, // 源网站价格
						platformmoneytype: _this.platformmoneytype, // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
						expectPrice: _this.expectPrice, // 期望价格
						expectmoneytype: _this.expectmoneytype, // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
						expectAmount: _this.expectAmount, // 期望数量
						hurryLevel: _this.hurryLevel, // 紧急程度  int 类型
						imgs: imgs, // 图片字符串集合
					}
					
					// 开始上传云函数
					uniCloud.callFunction({
						name: 'wishlist',
						data: {
							type: 'add',
							info: info
						}
					}).then(response => {
						// 发布成功
						uni.$emit('updatewishlist')
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none',
							duration: 1500
						});
						
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}).catch(error => {
						// 发布失败
						uni.showToast({
							title: _this.i18n.error.adderror,
							icon: 'none'
						});
					})

					
				}).catch(error => {
					console.log(`上传失败`);
					// 上传图片失败
					uni.showToast({
						title: this.i18n.error.uploaderror,
						icon: 'none'
					});
				})
				
			},
			
			
		},
	}
</script>

<style lang="scss" scoped>
	.content{
		padding-bottom: 90px;
	}
</style>
