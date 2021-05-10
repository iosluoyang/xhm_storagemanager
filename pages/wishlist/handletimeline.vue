<template>
	<view class="handletimelineview content">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{ type === 'found' ? i18n.wishlist.found : type === 'addcomment' ? i18n.wishlist.timeline.saysometing : i18n.wishlist.title }}</block>
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
				 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;flex-shrink: 0;">
					<swiper-item class="radius" v-for="(img,index) in wishinfo.imgs.split(',')" :key="index">
						<image :src="img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注 链接 -->
				<view class="procontentview flex-sub margin-left-sm" style="flex-shrink: 1;">
					<view class="text-bold margin-bottom-sm t_twoline">{{ wishinfo.productTitle }}</view>
					<view v-if="wishinfo.remark" class="tipsview radius bg-gray padding-sm text-sm text-light" style="word-break: break-all;" @longtap="$basejs.copytoclipboard(wishinfo.remark)">{{wishinfo.remark}}</view>
					<view class="bottomview margin-top-sm flex justify-between align-center">
						<view class="priceview flex align-center">
							<text class="text-red text-xl margin-right">{{ `${wishinfo.targetMoneyType === 'RMB' ? '¥' : wishinfo.targetMoneyType === 'THB' ? '฿' : ''}${wishinfo.targetPrice}` }}</text>
							<!-- <text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text> -->
							<view class="cu-tag radius bg-cyan">{{ wishinfo.targetAmount }}</view>
						</view>
						
						<!-- #ifndef H5 -->
						<!-- 复制源网站链接按钮 非H5平台且有源网站链接时出现-->
						<button v-if="wishinfo.sourceLink" class="cu-btn round sm bg-gradual-green cuIcon-link margin-right-sm" @tap.stop="ifshowbottommodal = true"></button>
						<!-- #endif -->
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!-- 时间轴更新内容 -->
		<view class="timelinecontentview bg-white padding-sm">
			
			<view class="cu-bar">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-pink"></text>
					<text>{{ i18n.wishlist.timeline.saysometing }}</text>
				</view>
			</view>
			
			<!-- 选择更新时间轴的类型 -->
			<view class="cu-bar btn-group">
				<button class="cu-btn shadow-blur round" :class="[type === 'addcomment' ? 'bg-blue' : 'line-blue' ]" @tap.stop="type='addcomment'">{{ i18n.wishlist.timeline.saysometing }}</button>
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
					<button class="cu-btn bg-cyan shadow" @tap.stop="pastefromclipboard('targetLink')">{{i18n.base.paste}}</button>
					<!-- #endif -->
					
				</view>
				
				<!-- 备注 -->
				<view class="cu-form-group solid-bottom pos-relative">
					<textarea :style="{height: textareaHighScreen ? '400rpx' : '100rpx' }" maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="60" v-model="remark" :placeholder="i18n.wishlist.remark" />
				
					<view class="cuIcon text-pink pos-absolute" :class="[textareaHighScreen ? 'cuIcon-fold' : 'cuIcon-unfold']" style="right: 10rpx;bottom: 10rpx;" @tap.stop="textareaHighScreen = !textareaHighScreen"></view>
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
			
		</view>
		
		<!-- 确定按钮 -->
		<view class="cu-bar btn-group margin">
			<button class="cu-btn round bg-pink lg" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 底部弹出框 -->
		<view class="cu-modal bottom-modal" :class="{'show': ifshowbottommodal}" @tap.stop="ifshowbottommodal = false">
			<view class="cu-dialog" @tap.stop="">
				
				<view v-if="productExt" class="cu-list menu text-left">
					
					<!-- 口令 -->
					<view class="cu-item">
						<view class="content padding-tb-sm" style="max-width: 70%;">
							<view>
								<text class="cuIcon-explorefill text-blue margin-right-xs"></text>
								{{ productExt.secretCode }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.secretcodetip }}
							</view>
						</view>
						
						<!-- #ifndef H5 -->
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow" @click="$basejs.copytoclipboard(productExt.secretCode)">
								<text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> 
							</button>
						</view>
						<!-- #endif -->
						
					</view>
					
					<!-- 纯链接 -->
					<view class="cu-item">
						<view class="content padding-tb-sm" style="max-width: 70%;">
							<view>
								<text class="cuIcon-link text-yellow margin-right-xs"></text>
								{{ productExt.pureUrl }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.pureurltip }}
							</view>
						</view>
						
						<!-- #ifndef H5 -->
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow" @click="$basejs.copytoclipboard(productExt.pureUrl)">
								<text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> 
							</button>
						</view>
						<!-- #endif -->
						
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
				type: "addcomment", // 页面类型 found 发现新商品 addcomment 添加普通评论
				pagetype: 'add', // 页面自身的类型  add为新增 edit为编辑  默认为add
				wishId: null, // 当前时间轴的心愿id
				wishinfo: null, // 当前心愿详情
				productExt: null ,// 心愿商品的拓展字段
				timelineId: null, // 当前时间轴id
				timelineInfo: null, // 时间轴数据
				
				swiperimgArr: [], // 轮播图片数组
				
				targetPrice: '', // 目标价格
				targetMoneyType: 'RMB', // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
				targetAmount: '', // 目标数量
				mainpiclimitnum: 9, // 图片上传的数量限制
				targetLink: '', // 目标网站链接
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				ifshowbottommodal: false, // 是否显示底部弹框
				remark: '', // 备注
				textareaHighScreen: true, // textarea是否高屏显示
				
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
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wishlist')
					.doc(_this.wishId)
					.get({
						getOne:true
					})
					.then(res => {
						console.log(`获取详情信息成功`);
						console.log(res);
						if(res.result.code == 0) {
							let detaildata = res.result.data
							_this.wishinfo = detaildata
							
							if(_this.wishinfo.productExt) {
								_this.productExt = _this.wishinfo.productExt
							}
							
						}
						else {
							uni.showToast({
								title: _this.i18n.error.loaderror,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					})
					.finally(() => {
						_this.ifloading = false // 结束缓冲动画
					})

			},
			
			// 获取时间轴详情
			gettimelinedetail() {
				
				_this.ifloading = true // 开始加载动画
				
				const db = uniCloud.database();
				db.collection('wishlisttimeline').doc(_this.timelineId).get()
				.then(res => {
					
					if(res.result.code == 0) {
						console.log(`获取时间轴详情数据成功`);
						console.log(res.result.data);
						let info = res.result.data
						_this.timelineInfo = info
						
						// 时间轴类型
						// type: timelinetype, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
						_this.type = info.type == 1 ? 'addcomment' : 'found'
						_this.remark = info.content || ''
						_this.targetMoneyType = info.moneyType || 'RMB'
						_this.targetPrice = info.price || ''
						_this.targetLink = info.link || ''
						
						// 遍历图片
						let imgArr = []
						if(info.imgs && info.imgs.length > 0) {
							imgArr = info.imgs.split(',').map(item => ( {url: item} ))
						}
						_this.imgArr = imgArr
						
					}
					else {
						console.log(res.result.message);
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
					
				})
				.catch(err => {
					console.log(err.message);
				})
				.finally(() => {
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 从粘贴板粘贴内容
			pastefromclipboard(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
						}
					}
				})
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
				
				// 检查是否需要上传图片
				if(this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					this.ifloading = true
					this.$refs.filepickerref.upload()
					return
				}
				
				// 其余项均为选填项
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = this.imgArr.map(item => (item.url)).join(',')
				
				// 上传数据
				let info = {
					wishId: _this.wishId, // 当前心愿单的id
					content: _this.remark, // 内容信息
					imgs: imgs, // 图片字符串集合
					type: 1, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认 4心愿单确认通过  5心愿单确认拒绝  6心愿单完成  
				}
				
				// 如果是发现新产品则需要上传链接 金额和货币类型等额外的参数
				if(_this.type == 'found') {
					let foundinfo = {
						type: 3, // 如果是发现新产品则时间轴类型为3待确认
						link: _this.targetLink, // 链接地址
						price: _this.targetPrice, // 价格
						moneyType: _this.targetMoneyType, // 价格币种 默认为RMB  RMB人民币 THB泰铢
					}
					info = {...info, ...foundinfo}  // 合并基础参数和发现新产品的参数
				}
				
				// 新增时间轴
				if(_this.pagetype == 'add') {
					
					// 开始使用openDB进行数据上传
					_this.ifloading = true
					const db = uniCloud.database();
					db.collection('wishlisttimeline').add(info)
					.then(res => {
						// 新增成功
						if(res.result.code == 0) {
							
							// 发布成功
							
							// 更新事件轴数据
							uni.$emit('updatetimeline')
							
							// 如果是待确认状态则更新心愿单列表和详情
							if(info.type == 3) {
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
							}
							
							uni.showToast({
								title: _this.i18n.tip.addsuccess,
								icon: 'none',
							});
							
							setTimeout(function() {
								uni.navigateBack();
							}, 1500);
							
						}
						// 新增失败
						else{
							uni.showToast({
								title: _this.i18n.error.adderror,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						console.log(`新增失败-${err.message}`);
						// 发布失败
						uni.showToast({
							title: _this.i18n.error.adderror,
							icon: 'none'
						});
					})
					.finally(() => {
						_this.ifloading = false
					})
					
				}
				// 编辑时间轴
				else if(_this.pagetype == 'edit') {
					_this.ifloading = true
					const db = uniCloud.database();
					db.collection('wishlisttimeline').doc(_this.timelineId)
					.update(info)
					.then(res => {
						// 编辑成功
						if(res.result.code == 0) {
							
							// 更新事件轴数据
							uni.$emit('updatetimeline')
							
							// 如果是待确认状态则更新心愿单列表和详情
							if(info.type == 3) {
								uni.$emit('updatewishlist')
								uni.$emit('updatewishdetail')
							}
							
							uni.showToast({
								title: _this.i18n.tip.fixsuccess,
								icon: 'none',
							});
							
							setTimeout(function() {
								uni.navigateBack();
							}, 1500);
						}
						// 编辑失败
						else {
							console.log(res.result.message);
							// 发布失败
							uni.showToast({
								title: _this.i18n.error.fixerror,
								icon: 'none'
							});
						}
					})
					.catch(err => {
						console.log(err.message);
						// 发布失败
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
					})
				}
				
			},
			
		},
	}
</script>

<style lang="scss" scoped>

</style>
