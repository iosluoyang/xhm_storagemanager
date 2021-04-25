<template>
	<view class="content addwishview bg-gray">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>

		<!-- 填写的表单信息 -->
		<form>
			
			<!-- 我发现 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">I Found</text>
				</view>
			</view>
			
			<!-- 商品标题 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.wishlist.producttitle}} :</view>
				<textarea v-model="productTitle" :placeholder="i18n.error.lackgoodstitle"
				auto-height
				:show-confirm-bar="false" 
				disable-default-padding
				/>
				<!-- #ifndef H5 -->
				<button class="cu-btn bg-cyan shadow margin-left" @tap.stop="pastesourelink('productTitle')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</view>
			
			<!-- 源网站链接 -->
			<view class="cu-form-group">
				<view class="title">{{i18n.wishlist.sourcelink}} :</view>
				<!-- <input type="text" confirm-type="next" v-model="sourceLink" /> -->
				<textarea auto-height :show-confirm-bar="false" v-model="sourceLink" />
				<!-- #ifndef H5 -->
				<button class="cu-btn bg-cyan shadow" @tap.stop="pastesourelink('sourceLink')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</view>
			
			<!-- 源网站价格 -->
			<view class="cu-form-group">
				
				<view class="title">{{i18n.wishlist.sourceprice}} :</view>
				
				<view class="content flex-sub flex align-center">
					<text :class="[ sourceMoneyType == 'RMB' ? 'text-red' : 'text-blue', 'margin-right-sm' ]">{{ sourceMoneyType == 'RMB' ? 'RMB' : 'THB' }}</text>
					<input type="digit" class="borderCDCDCD radius" v-model="sourcePrice" @input="typesourcePrice" />
				</view>
				
				<!-- 源网站货币种类选择 -->
				<view class="flex align-center margin-left">
					<button class="cu-btn sm round margin-right" :class="sourceMoneyType === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="sourceMoneyType='RMB'">¥</button>
					<button class="cu-btn sm round " :class="sourceMoneyType === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="sourceMoneyType='THB'">฿</button>
				</view>

			</view>
			
			<!-- 我想要 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-pink"></text>
					<text class="text-xl text-bold">I Want</text>
				</view>
			</view>
			
			<!-- 目标价格 -->
			<view class="cu-form-group">
				
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
			
			<!-- 目标数量 -->
			<view class="cu-form-group solid-bottom">
				<view class="title">{{i18n.wishlist.targetamount}} :</view>
				<input type="text" v-model="targetAmount" />
			</view>
			
			<!-- 备注 -->
			<view class="cu-form-group">
				<textarea maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="60" v-model="remark" :placeholder="i18n.wishlist.remark" />
			</view>
			
			<!-- 紧急程度 -->
			<view class="cu-form-group solid-bottom">
				<view class="title">{{i18n.wishlist.hurrylevel}}</view>
				<picker :range="hurrylevelDataArr" range-key="name" :value="hurryLevel - 1" @change="hurrylevelchange">
					<view class="picker">
						<text v-for="item in hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
						<text class="margin-left-sm">{{ hurrylevelDataArr[hurryLevel - 1].name }}</text>
					</view>
				</picker>
			</view>
			
			<!-- 图片上传 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">{{i18n.wishlist.uploadimg}}</view>
				<view class="action">{{`${imgArr.length} / ${mainpiclimitnum}`}}</view>
			</view>
			
			<view class="bg-white padding">
				<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="mainpiclimitnum"
				return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
				@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
				</uni-file-picker>
			</view>
			
		</form>
		
		<!-- 确定按钮 -->
		<view class="cu-bar btn-group padding-xl">
			<button class="cu-btn round bg-pink lg" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 订阅消息modal框 -->
		<view class="cu-modal" :class=" showModal ? 'show' : '' ">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ modalTitle }}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-pink"></text>
					</view>
				</view>
				<view class="padding-xl">
					{{ modalContent }}
				</view>
				<view class="cu-bar bg-white justify-around">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">{{ i18n.base.cancel }}</button>
						<button class="cu-btn bg-green margin-left" @tap="confirmModal">{{ i18n.base.confirm }}</button>
					</view>
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
				
				type: 'add', // 页面状态 add新增 edit编辑 
				id: null, // 当前心愿详情id
				productTitle: '', // 商品标题
				sourceLink: '', // 源网站链接
				sourcePrice: '', // 源网站价格
				sourceMoneyType: 'RMB', // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
				targetPrice: '', // 目标价格
				targetMoneyType: 'RMB', // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
				targetAmount: '', // 目标数量
				hurryLevel: 2, // 紧急程度 默认为2级 int 类型
				hurrylevelDataArr: [], // 紧急程度数据源数组
				mainpiclimitnum: 5, // 图片上传的数量限制
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				remark: '', // 备注
				
				modalTitle: '弹框标题',
				modalContent: '弹框内容',
				showModal: false, // 是否显示modal
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			this.type = option.type // add 新增  edit编辑 copy拷贝
			this.id = option.id // 心愿详情id(编辑或者拷贝的原心愿id)
			
			// 如果是编辑或者拷贝状态则获取心愿详情
			if(this.type === 'edit' || this.type === 'copy') {
				this.getwishdetail()
			}
			
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
			
			// 获取心愿详情
			getwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				uniCloud.callFunction({
					name: 'wishlist',
					data: {
						type: 'getdetail',
						info: {
							_id: this.id
						}
					}
				}).then(response => {
					
					_this.ifloading = false // 结束缓冲动画
					
					// 获取数据成功
					let info = response.result.data[0]
					
					this.productTitle = info.productTitle // 商品标题
					this.sourceLink = info.sourceLink // 源网站链接
					this.sourcePrice = info.sourcePrice // 源网站价格
					this.sourceMoneyType = info.sourceMoneyType // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
					this.targetPrice = info.targetPrice // 目标价格
					this.targetMoneyType = info.targetMoneyType // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
					this.targetAmount = info.targetAmount // 目标数量
					this.hurryLevel = info.hurryLevel // 紧急程度 默认为2级 int 类型
					this.remark = info.remark // 备注信息
					
					// 获取图片数组将其放入返显中
					let imgsarr = info.imgs.split(',') // 图片数组
					let imgsobjarr = imgsarr.map(item => {
						let imgobj = {
							url: item
						}
						return imgobj
					})
					this.imgArr = imgsobjarr
					
				}).catch(error => {
					
					_this.ifloading = false // 结束缓冲动画
					
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
			
			// 输入源网站价格
			typesourcePrice(e) {
				let sourcePrice = e.detail.value
				this.targetPrice = sourcePrice
				this.targetMoneyType = this.sourceMoneyType
			},
			
			// 紧急程度更改
			hurrylevelchange(e) {
				this.hurryLevel = Number(e.detail.value) + 1
			},
			
			// 选择图片成功
			fileselect(e) {
				console.log(`图片选择成功`);
				console.log(e);
				this.imgArr.push.apply(this.imgArr, e.tempFiles)
				// this.imgArr =  this.imgArr.concat(e.tempFiles)
				console.log(this.imgArr);
			},
			
			// 图片删除
			filedelete(e) {
				console.log(`图片删除成功`);
				let deleteIndex = this.imgArr.findIndex(item => {
					return e.tempFilePath == item.path
				})
				if(deleteIndex > -1) {
					console.log(`删除了第${deleteIndex}张图片`);
					this.imgArr.splice(deleteIndex,1)
				}
			},
			
			// 图片上传
			fileprogress(e) {
				console.log(`上传图片中`);
				console.log(e);
			},
			
			// 上传图片成功
			filesuccess(e) {
				console.log(`上传图片成功,`);
				console.log(e);
				
				this.ifloading = false
				
				// 继续提交数据
				this.uploaddata()
			},
			
			// 上传图片失败
			filefail(e) {
				// 上传图片失败
				console.log(`上传图片失败`);
				console.log(e);
				
				this.ifloading = false
				uni.showToast({
					title: this.i18n.error.uploaderror,
					icon: 'none'
				});
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
										
					// 区分新增和编辑以及拷贝状态
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
					else if(_this.type === 'edit' || _this.type === 'copy') {
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
				// 检查是否有目标价格
				else if(!this.targetPrice) {
					uni.showToast({
						title: this.i18n.wishlist.timeline.targetpriceerror,
						icon: 'none'
					});
					return false
				}
				// 检查是否有目标数量
				else if(!this.targetAmount) {
					uni.showToast({
						title: this.i18n.wishlist.targetamount,
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
				
				// 开始上传
				// 检查是否需要上传图片
				if(this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					this.ifloading = true
					this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = this.imgArr.map(item => (item.url)).join(',')
				// 上传图片成功 开始上传所有数据
				let info = {
					productTitle: _this.productTitle, // 商品标题
					sourceLink: _this.sourceLink, // 源网站链接
					sourcePrice: _this.sourcePrice, // 源网站价格
					sourceMoneyType: _this.sourceMoneyType, // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
					targetPrice: _this.targetPrice, // 目标价格
					targetMoneyType: _this.targetMoneyType, // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
					targetAmount: _this.targetAmount, // 目标数量
					hurryLevel: _this.hurryLevel, // 紧急程度  int 类型
					remark: _this.remark, // 备注信息
					imgs: imgs, // 图片字符串集合
				}
				
				// 新增
				if(_this.type == 'add') {
					
					// 使用openDB进行数据写入
					const db = uniCloud.database();
					db.collection('wishlist').add(info).then(res => {
						
						// 增加一条默认的时间轴数据
						let timelineinfo = {
							wishId: res.result.id,
							type: 0, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
						}
						db.collection('wishlisttimeline').add(timelineinfo).then(res => {
							console.log(`创建默认时间轴成功`);
						}).catch(err => {
							console.log(`创建默认时间轴失败`);
						})
						
						// 发布成功
						uni.$emit('updatewishlist')
						
						// 如果是在小程序端则进行订阅消息
						// #ifdef MP-WEIXIN
						this.modalTitle = this.i18n.tip.addsuccess
						this.modalContent = '点击订阅消息即可在该心愿单变更时及时通知到您'
						this.showModal = true
						// #endif
						
						// 非小程序则直接返回
						// #ifndef MP-WEIXIN
						uni.showToast({
							title: _this.i18n.tip.addsuccess,
							icon: 'none',
							duration: 1500
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
						// #endif
						
					}).catch(err => {
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
					})
					
					return
					
					// // 开始上传云函数
					// uniCloud.callFunction({
					// 	name: 'wishlist',
					// 	data: {
					// 		type: 'add',
					// 		info: info
					// 	}
					// }).then(response => {
					// 	// 发布成功
					// 	uni.$emit('updatewishlist')
						
					// 	// 如果是在小程序端则进行订阅消息
					// 	// #ifdef MP-WEIXIN
					// 	this.modalTitle = this.i18n.tip.addsuccess
					// 	this.modalContent = '点击订阅消息即可在该心愿单变更时及时通知到您'
					// 	this.showModal = true
					// 	// #endif
						
					// 	// 非小程序则直接返回
					// 	// #ifndef MP-WEIXIN
					// 	uni.showToast({
					// 		title: _this.i18n.tip.addsuccess,
					// 		icon: 'none',
					// 		duration: 1500
					// 	});
					// 	setTimeout(function() {
					// 		uni.navigateBack();
					// 	}, 1500);
					// 	// #endif
						
					// }).catch(error => {
					// 	// 发布失败
					// 	uni.showToast({
					// 		title: _this.i18n.error.adderror,
					// 		icon: 'none'
					// 	});
					// })
					
				}
				// 编辑
				else if(_this.type == 'edit') {
					
					info = {...info, ...{_id: _this.id}} // 编辑状态下传递_id字段
					
					// 开始上传云函数
					uniCloud.callFunction({
						name: 'wishlist',
						data: {
							type: 'edit',
							info: info
						}
					}).then(response => {
						// 发布成功
						uni.$emit('updatewishlist')
						uni.$emit('updatewishdetail')
						
						this.modalTitle = this.i18n.tip.fixsuccess
						this.modalContent = '订阅消息通知以便于心愿单变更时及时通知到您'
						this.showModal = true
						
						// uni.showToast({
						// 	title: _this.i18n.tip.fixsuccess,
						// 	icon: 'none',
						// 	duration: 1500
						// });
						// setTimeout(function() {
						// 	uni.navigateBack();
						// }, 1500);
					}).catch(error => {
						// 发布失败
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
					})
				}
				// 拷贝
				else if(_this.type == 'copy') {
					// 开始上传云函数
					uniCloud.callFunction({
						name: 'wishlist',
						data: {
							type: 'add',
							info: info
						}
					}).then(response => {
						// 发布成功
						uni.$emit('updatewishlist', {type: 'copywish'})
						
						this.modalTitle = this.i18n.tip.addsuccess
						this.modalContent = '订阅消息通知以便于心愿单变更时及时通知到您'
						this.showModal = true
						
						// uni.showToast({
						// 	title: _this.i18n.tip.addsuccess,
						// 	icon: 'none',
						// 	duration: 1500
						// });
						
						// setTimeout(function() {
						// 	uni.navigateBack();
						// }, 1500);
					}).catch(error => {
						// 发布失败
						uni.showToast({
							title: _this.i18n.error.adderror,
							icon: 'none'
						});
					})
				}
				
				
				// 开始上传图片(包含新增和编辑)
				// this.uploadpic(this.imgArr).then(imgs => {
					
				// 	// 上传图片成功 开始上传所有数据
				// 	let info = {
				// 		productTitle: _this.productTitle, // 商品标题
				// 		sourceLink: _this.sourceLink, // 源网站链接
				// 		sourcePrice: _this.sourcePrice, // 源网站价格
				// 		sourceMoneyType: _this.sourceMoneyType, // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
				// 		targetPrice: _this.targetPrice, // 目标价格
				// 		targetMoneyType: _this.targetMoneyType, // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
				// 		targetAmount: _this.targetAmount, // 目标数量
				// 		hurryLevel: _this.hurryLevel, // 紧急程度  int 类型
				// 		remark: _this.remark, // 备注信息
				// 		imgs: imgs, // 图片字符串集合
				// 		user: _this.user, // 当前发布人的信息
				// 	}
					
				// 	// 新增
				// 	if(_this.type == 'add') {
						
				// 		// 开始上传云函数
				// 		uniCloud.callFunction({
				// 			name: 'wishlist',
				// 			data: {
				// 				type: 'add',
				// 				info: info
				// 			}
				// 		}).then(response => {
				// 			// 发布成功
				// 			uni.$emit('updatewishlist')
							
				// 			this.modalTitle = this.i18n.tip.addsuccess
				// 			this.modalContent = '订阅消息通知以便于心愿单变更时及时通知到您'
				// 			this.showModal = true

				// 			// uni.showToast({
				// 			// 	title: _this.i18n.tip.addsuccess,
				// 			// 	icon: 'none',
				// 			// 	duration: 1500
				// 			// });
				// 			// setTimeout(function() {
				// 			// 	uni.navigateBack();
				// 			// }, 1500);
							
				// 		}).catch(error => {
				// 			// 发布失败
				// 			uni.showToast({
				// 				title: _this.i18n.error.adderror,
				// 				icon: 'none'
				// 			});
				// 		})
						
				// 	}
				// 	// 编辑
				// 	else if(_this.type == 'edit') {
						
				// 		info = {...info, ...{_id: _this.id}} // 编辑状态下传递_id字段
						
				// 		// 开始上传云函数
				// 		uniCloud.callFunction({
				// 			name: 'wishlist',
				// 			data: {
				// 				type: 'edit',
				// 				info: info
				// 			}
				// 		}).then(response => {
				// 			// 发布成功
				// 			uni.$emit('updatewishlist')
				// 			uni.$emit('updatewishdetail')
							
				// 			this.modalTitle = this.i18n.tip.fixsuccess
				// 			this.modalContent = '订阅消息通知以便于心愿单变更时及时通知到您'
				// 			this.showModal = true
							
				// 			// uni.showToast({
				// 			// 	title: _this.i18n.tip.fixsuccess,
				// 			// 	icon: 'none',
				// 			// 	duration: 1500
				// 			// });
				// 			// setTimeout(function() {
				// 			// 	uni.navigateBack();
				// 			// }, 1500);
				// 		}).catch(error => {
				// 			// 发布失败
				// 			uni.showToast({
				// 				title: _this.i18n.error.fixerror,
				// 				icon: 'none'
				// 			});
				// 		})
				// 	}
				// 	// 拷贝
				// 	else if(_this.type == 'copy') {
				// 		// 开始上传云函数
				// 		uniCloud.callFunction({
				// 			name: 'wishlist',
				// 			data: {
				// 				type: 'add',
				// 				info: info
				// 			}
				// 		}).then(response => {
				// 			// 发布成功
				// 			uni.$emit('updatewishlist', {type: 'copywish'})
							
				// 			this.modalTitle = this.i18n.tip.addsuccess
				// 			this.modalContent = '订阅消息通知以便于心愿单变更时及时通知到您'
				// 			this.showModal = true
							
				// 			// uni.showToast({
				// 			// 	title: _this.i18n.tip.addsuccess,
				// 			// 	icon: 'none',
				// 			// 	duration: 1500
				// 			// });
							
				// 			// setTimeout(function() {
				// 			// 	uni.navigateBack();
				// 			// }, 1500);
				// 		}).catch(error => {
				// 			// 发布失败
				// 			uni.showToast({
				// 				title: _this.i18n.error.adderror,
				// 				icon: 'none'
				// 			});
				// 		})
				// 	}
					
				// }).catch(error => {
				// 	console.log(`上传失败`);
				// 	console.log(JSON.stringify(error));
				// 	// 上传图片失败
				// 	uni.showToast({
				// 		title: this.i18n.error.uploaderror,
				// 		icon: 'none'
				// 	});
				// })
				
			},
			
			hideModal() {
				this.showModal = false
				uni.navigateBack();
			},
			
			confirmModal() {
				this.showModal = false
				
				// 开始获取订阅
				// #ifdef MP-WEIXIN
				
				// 增加订阅模板消息的功能
				let orderchangetmpId = 'dMO7jl3o1lgYqd3PrcgALPn_1s87YUdwZXcsorRpx5U'
				uni.requestSubscribeMessage({
					tmplIds: [orderchangetmpId],
					success(res){
						let errMsg = res.errMsg
						console.log(errMsg);
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[orderchangetmpId]);
							// 用户同意订阅
							if(res[orderchangetmpId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[orderchangetmpId] == 'reject') {
								console.log(`用户拒绝订阅消息`);
							}
						}
						else {
							console.log(`订阅消息失败`);
						}
					},
					fail(err) {
						console.log(`订阅消息失败`);
						console.log(err.errMsg);
					},
					complete() {
						console.log(`订阅消息接口完成`);
						uni.navigateBack();
					}
				})
				
				// #endif
			}
			
		},
	}
</script>

<style lang="scss" scoped>
	
</style>
