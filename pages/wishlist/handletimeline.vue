<template>
	<view class="handletimelineview content">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.wishlist.found}}</block>
		</cu-custom>
		
		<!-- 该心愿详情信息 -->
		<view class="wishdetailview bg-white padding-sm">
			
			<view class="cu-bar">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-bold text-black">{{i18n.wishlist.wishdetail}}</text>
				</view>
			</view>
			
			<!-- 心愿商品基本信息 -->
			<view v-if="wishinfo" class="prodetailview padding-sm flex align-center">
				
				<!-- 商品轮播图 -->
				<swiper class="screen-swiper square-dot" indicator-dots circular
				 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;">
					<swiper-item class="radius" v-for="(img,index) in swiperimgArr" :key="index">
						<image :src="imgUrl + img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注 -->
				<view class="procontentview flex-sub margin-left-sm">
					<view class="text-bold margin-bottom-sm">{{ wishinfo.productTitle }}</view>
					<view class="tipsview radius bg-gray padding-sm text-sm text-light">{{wishinfo.remark}}</view>
					<view class="priceview">
						<text class="text-red text-xl margin-right">{{ `${wishinfo.targetMoneyType === 'RMB' ? '¥' : wishinfo.targetMoneyType === 'THB' ? '฿' : ''}${wishinfo.targetPrice}` }}</text>
						<text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!-- 时间轴更新内容 -->
		<view class="timelinecontentview bg-white padding-sm">
			
			<view class="cu-bar">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-pink"></text>
					<text>{{ i18n.wishlist.timeline.updatetimeline }}</text>
				</view>
			</view>
			
			<!-- 表单区域  填写相关数据 -->
			<form>
				
				<!-- 目标价格 -->
				<view class="cu-form-group">
					
					<view class="title">{{i18n.wishlist.targetprice}} :</view>
					
					<input type="digit" class="borderCDCDCD" v-model="targetPrice" />
					
					<!-- 货币种类选择 -->
					<view class="flex align-center margin-left">
						<button class="cu-btn sm round margin-right" :class="targetMoneyType === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="targetMoneyType='RMB'">¥</button>
						<button class="cu-btn sm round " :class="targetMoneyType === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="targetMoneyType='THB'">฿</button>
					</view>
				
				</view>
				
				<!-- 目标网站链接 -->
				<view class="cu-form-group ">
					
					<view class="title">{{i18n.wishlist.targetlink}} :</view>
					<input type="text" confirm-type="next" v-model="targetLink" />
					
					<!-- 粘贴按钮 -->
					<!-- #ifndef H5 -->
					<button class="cu-btn bg-cyan shadow" @tap.stop="pastesourelink('targetLink')">{{i18n.base.paste}}</button>
					<!-- #endif -->
					
				</view>
				
				<!-- 备注 -->
				<view class="cu-form-group solid-bottom">
					<textarea maxlength="-1" v-model="remark" :placeholder="i18n.wishlist.remark" />
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
				
			</form>
			
		</view>
		
		
		<!-- 确定按钮 -->
		<view class="cu-bar btn-group margin">
			<button class="cu-btn round bg-pink lg" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
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
				type: 'add', // 页面类型  目前暂时只有add一种类型
				wishid: null, // 当前时间轴的心愿id
				wishinfo: null, // 当前心愿详情
				
				swiperimgArr: [], // 轮播图片数组
				
				targetPrice: '', // 目标价格
				targetMoneyType: 'RMB', // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
				targetAmount: '', // 目标数量
				mainpiclimitnum: 5, // 图片上传的数量限制
				targetLink: '', // 目标网站链接
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				remark: '', // 备注
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let wishid = option.wishid
			_this.wishid = wishid || '5f549a632805da0001929aaf'
			
			// 获取当前心愿的详情
			_this.getwishdetail()
			
		},
		
		methods: {
		
			// 获取心愿详情
			getwishdetail() {
				
				_this.ifloading = true // 开始加载动画
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.wishid
						}
					}
				}).then(response => {
					
					_this.ifloading = false // 结束加载动画
					
					// 获取数据成功
					let info = response.result.data[0]
					
					this.wishinfo = info
					
					// 轮播数据
					let swiperimgArr = info.imgs.split(',') // 图片数组
					this.swiperimgArr = swiperimgArr
					
					// this.productTitle = info.productTitle // 商品标题
					// this.sourceLink = info.sourceLink // 源网站链接
					// this.platformPrice = info.platformPrice // 源网站价格
					// this.platformmoneytype = info.platformmoneytype // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
					// this.expectPrice = info.expectPrice // 期望价格
					// this.expectmoneytype = info.expectmoneytype // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
					// this.expectAmount = info.expectAmount // 期望数量
					// this.hurryLevel = info.hurryLevel // 紧急程度 默认为2级 int 类型
					// this.imgArr = info.imgs.split(',') // 图片数组
					// this.remark = info.remark // 备注信息
					
				}).catch(error => {
					
					_this.ifloading = false // 结束加载动画
					
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 粘贴源网站链接
			pastesourelink(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
						}
					}
				})
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
							let copyimgArr = [..._this.imgArr]
							imgUrls.forEach((imgUrl, index) => {
								copyimgArr.splice(needtoindexArr[index], 1, imgUrl)
							})
							let imgs = copyimgArr.join(',')
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
			
			// 上传时间轴数据
			uploaddata() {
				
				// 进行数据检查
				
				// 检查是否有目标价格
				if(!this.targetPrice) {
					uni.showToast({
						title: this.i18n.wishlist.timeline.targetpriceerror,
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
				
				// 开始上传图片(仅包含新增)
				this.uploadpic(this.imgArr).then(imgs => {
					// 上传图片成功 开始上传所有数据
					let info = {
						wishid: _this.wishid, // 当前心愿的id
						user: _this.user, // 当前发布人的信息
						content: _this.remark, // 内容信息
						link: _this.targetLink, // 链接地址
						price: _this.targetPrice, // 价格
						moneytype: _this.targetMoneyType, // 价格币种 默认为RMB  RMB人民币 THB泰铢
						imgs: imgs, // 图片字符串集合
						type: 2, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新  2心愿单待确认  3心愿单确认通过  4心愿单确认拒绝  5心愿单完成
					}
					
					// 新增
					if(_this.type == 'add') {
						
						// 开始上传云函数
						uniCloud.callFunction({
							name: 'wishlisttimeline',
							data: {
								type: 'add',
								info: info
							}
						}).then(response => {
							// 发布成功
							uni.$emit('updatetimeline')
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
						
					}
					
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

</style>
