<template>
	<view class="handletimelineview content">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{ type === 'found' ? i18n.wishlist.found : type === 'addcomment' ? i18n.wishlist.timeline.updatetimeline : i18n.wishlist.title }}</block>
		</cu-custom>
		
		<!-- 该心愿详情信息 -->
		<view class="wishdetailview bg-white padding-sm solid-bottom">
			
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
					<view class="text-bold margin-bottom-sm t_twoline">{{ wishinfo.productTitle }}</view>
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
			
			<!-- 选择更新时间轴的类型 -->
			<view class="cu-bar btn-group">
				<button class="cu-btn shadow-blur round" :class="[type === 'addcomment' ? 'bg-blue' : 'line-blue' ]" @tap.stop="type='addcomment'">{{ i18n.wishlist.timeline.updatetimeline }}</button>
				<text class="text-gray">/</text>
				<button class="cu-btn shadow-blur round" :class="[type === 'found' ? 'bg-pink' : 'line-pink' ]" @tap.stop="type='found'">{{ i18n.wishlist.found }}</button>
			</view>
			
			<!-- 表单区域 -->
			<form>
				
				<!-- 目标价格 仅当发现新商品时才有 -->
				<view v-if="type==='found'" class="cu-form-group">
					
					<text class="cuIcon cuIcon-moneybag text-red"></text>
					
					<view class="title">{{i18n.wishlist.targetprice}} :</view>
					
					<view class="content flex-sub flex align-center">
						<text :class="[ targetMoneyType == 'RMB' ? 'text-red' : 'text-blue', 'margin-right-sm' ]">{{ targetMoneyType == 'RMB' ? 'RMB' : 'THB' }}</text>
						<input type="digit" class="borderCDCDCD radius" v-model="targetPrice" />
					</view>
					
					<!-- 目标货币种类选择 -->
					<view class="flex align-center margin-left">
						<button class="cu-btn sm round margin-right" :class="targetMoneyType === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="targetMoneyType='RMB'">¥</button>
						<button class="cu-btn sm round " :class="targetMoneyType === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="targetMoneyType='THB'">฿</button>
					</view>
					
				</view>
				
				<!-- 目标网站链接 仅当发现新商品时才有 -->
				<view v-if="type==='found'" class="cu-form-group ">
					
					<text class="cuIcon cuIcon-link text-green"></text>
					
					<view class="title">{{i18n.wishlist.targetlink}} :</view>
					<input type="text" confirm-type="next" v-model="targetLink" />
					
					<!-- 粘贴按钮 -->
					<!-- #ifndef H5 -->
					<button class="cu-btn bg-cyan shadow" @tap.stop="pastesourelink('targetLink')">{{i18n.base.paste}}</button>
					<!-- #endif -->
					
				</view>
				
				<!-- 备注 -->
				<view class="cu-form-group solid-bottom">
					<textarea maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="60" v-model="remark" :placeholder="i18n.wishlist.remark" />
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
				type: "addcomment", // 页面类型 found 发现新商品 addcomment 添加普通评论
				pagetype: 'add', // 页面自身的类型  add为新增 edit为编辑  默认为add
				wishId: null, // 当前时间轴的心愿id
				wishinfo: null, // 当前心愿详情
				timelineId: null, // 当前时间轴id
				timelineInfo: null, // 时间轴数据
				
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
			
			let wishId = option.wishId
			_this.wishId = wishId
			
			// 获取当前心愿的详情
			_this.getwishdetail()
			
			// 如果是编辑状态则获取时间轴数据
			if(option.type == 'edit') {
				_this.pagetype = 'edit'
				let timelineId = option.timelineId
				_this.timelineId = timelineId
				_this.gettimelinedetail()
			}
			
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
							_id: this.wishId
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
					
				}).catch(error => {
					
					_this.ifloading = false // 结束加载动画
					
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 获取时间轴详情
			gettimelinedetail() {
				
				_this.ifloading = true // 开始加载动画
				
				uniCloud.callFunction({
					name: 'wishlisttimeline',
					data: {
						type: 'getdetail',
						info: {
							_id: _this.timelineId
						}
					}
				}).then(response => {
					
					_this.ifloading = false // 结束加载动画
					
					// 获取数据成功
					let info = response.result.data[0]
					
					// 时间轴类型
					// type: timelinetype, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
					let type = info.type
					_this.type = type == 1 ? 'addcomment' : 'found'
					_this.remark = info.content || ''
					_this.imgArr = info.imgs && info.imgs.length > 0 ? info.imgs.split(',') : []
					_this.targetMoneyType = info.moneyType || 'RMB'
					_this.targetPrice = info.price || ''
					_this.targetLink = info.link || ''
					
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
					if(_this.pagetype === 'add') {
						
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
					else if(_this.pagetype === 'edit') {
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
				
				// 添加普通更新内容时
				if(this.type === 'addcomment') {
					
					// 检查是否有评论内容
					if(!this.remark) {
						uni.showToast({
							title: this.i18n.wishlist.timeline.timelinecontenterror,
							icon: 'none'
						});
						return false
					}
					
				}
				// 添加发现新商品时
				else if(this.type === 'found') {
					
					// 检查是否有目标价格
					if(!this.targetPrice) {
						uni.showToast({
							title: this.i18n.wishlist.timeline.targetpriceerror,
							icon: 'none'
						});
						return false
					}
					
				}
				
				// 检查是否有图片
				// else if(this.imgArr.length == 0) {
				// 	uni.showToast({
				// 		title: this.i18n.error.lackgoodsmainpic,
				// 		icon: 'none'
				// 	});
				// 	return false
				// }
				
				// 其余项均为选填项
				
				// 开始上传图片
				this.uploadpic(this.imgArr).then(imgs => {
					// 上传图片成功 开始上传所有数据
					console.log(`获得的图片链接为${imgs}`);
					// 根据当前页面类型选择更新的时间轴类型
					let timelinetype = _this.type === 'addcomment' ? 1 : _this.type === 'found' ? 3 : 1
					
					let commoninfo = {
						wishId: _this.wishId, // 当前心愿的id
						_id: _this.pagetype == 'edit' ? _this.timelineId : null,
						user: _this.user, // 当前发布人的信息
						content: _this.remark, // 内容信息
						imgs: imgs, // 图片字符串集合
						type: timelinetype, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
					}
					
					let foundinfo = {}
					// 如果是发现新商品类型则添加价格和链接地址
					if(_this.type === 'found') {
						foundinfo = {
							link: _this.targetLink, // 链接地址
							price: _this.targetPrice, // 价格
							moneyType: _this.targetMoneyType, // 价格币种 默认为RMB  RMB人民币 THB泰铢
						}
					}
					
					let uploaddata = {...commoninfo,...foundinfo}
					console.log(`即将上传的数据为${JSON.stringify(uploaddata)}`);
					
					// 开始上传云函数
					uniCloud.callFunction({
						name: 'wishlisttimeline',
						data: {
							type: _this.pagetype == 'add' ? 'add' : 'edit',
							info: uploaddata
						}
					}).then(response => {
						// 发布成功
						// 更新事件轴数据
						uni.$emit('updatetimeline')
						
						// 如果是待确认状态则更新心愿单列表和详情
						if(uploaddata.type == 3) {
							uni.$emit('updatewishlist')
							uni.$emit('updatewishdetail')
						}
						
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
					console.log(``);
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
