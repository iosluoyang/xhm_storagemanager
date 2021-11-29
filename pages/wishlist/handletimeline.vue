<template>
	<view class="handletimelineview content">
		
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{ i18n.nav.wishdetail }}</block>
		</cu-custom>
		
		<!-- 心愿详情信息 -->
		<view v-if="false && wishInfo" class="wishdetailview bg-white padding-sm solid-bottom">
			
			<!-- 心愿商品基本信息 -->
			<view class="prodetailview padding-sm flex align-center">
				
				<!-- 商品轮播图 -->
				<swiper class="screen-swiper square-dot" indicator-dots circular
				 autoplay interval="3000" duration="500" style="width: 40%;height: 200rpx;min-height: auto;flex-shrink: 0;">
					<swiper-item class="radius" v-for="(img,index) in wishInfo.imgs.split(',')" :key="index">
						<image :src="img" mode="aspectFill"></image>
					</swiper-item>
				</swiper>
				
				<!-- 商品标题和备注 链接 -->
				<view class="procontentview flex-sub margin-left-sm" style="flex-shrink: 1;">
					<view class="text-bold margin-bottom-sm t_twoline">{{ wishInfo.productTitle }}</view>
					<view v-if="wishInfo.remark" class="tipsview radius bg-gray padding-sm text-sm text-light" style="word-break: break-all;" @longpress="$basejs.copytoclipboard(wishInfo.remark)">{{wishInfo.remark}}</view>
					<view class="bottomview margin-top-sm flex justify-between align-center">
						<view class="priceview flex align-center">
							<text class="text-red text-xl margin-right">{{ `${wishInfo.sourceMoneyType === 'RMB' ? '¥' : wishInfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishInfo.sourcePrice}` }}</text>
							<!-- <text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishInfo.sourceMoneyType === 'RMB' ? '¥' : wishInfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishInfo.sourcePrice}` }}</text> -->
							<view class="cu-tag radius bg-cyan">{{ wishInfo.targetAmount }}</view>
						</view>
						
					</view>
				</view>
				
			</view>
			
		</view>
		
		<!-- 时间轴更新内容 -->
		<view v-if="false && wishInfo" class="timelinecontentview bg-white padding-sm">
			
			<!-- 选择更新时间轴的类型 -->
			<view v-if="user.role == $basejs.roleEnum.productAgent && wishInfo.agentUser == user._id" class="cu-bar btn-group">
				
				<!-- 普通时间轴 -->
				<button class="cu-btn shadow-blur round" :class="[type === 'addcomment' ? 'bg-blue' : 'line-blue sm' ]" @tap.stop="type='addcomment'">{{ i18n.wishlist.timeline.addcomment }}</button>
				
				<!-- 补充心愿拓展信息 -->
				<button class="cu-btn shadow-blur round" :class="[type === 'addext' ? 'bg-orange' : 'line-orange sm' ]" @tap.stop="type='addext'">{{ i18n.wishlist.timeline.addext }}</button>
				
				<!-- 确定报价单信息 -->
				<button class="cu-btn shadow-blur round" :class="[type === 'confirmquotation' ? 'bg-gradual-purple' : 'line-purple sm' ]" @tap.stop="type='confirmquotation'">{{ i18n.wishlist.timeline.confirmquotation }}</button>
				
			</view>
			
			<!-- 表单区域 -->
			<form>
				
				<!-- 普通时间轴区域 -->
				<view v-show=" type == 'addcomment' ">
					
					<!-- 备注 -->
					<view class="cu-form-group solid-bottom pos-relative">
						
						<textarea class="contenttextarea" :style="{height: textareaHighScreen ? '400rpx' : '100rpx' }" maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="60" v-model="content" :placeholder="i18n.placeholder.handletimeline.typecontent" :focus="textareaHighScreen" />
						<cover-view class="cuIcon text-pink pos-absolute" :class="[textareaHighScreen ? 'cuIcon-fold' : 'cuIcon-full']" style="right: 10rpx;bottom: 10rpx;z-index: 9999;font-size: 24px;" @tap.stop="textareaHighScreen = !textareaHighScreen"></cover-view>
						
					</view>
					
					<!-- 图片上传 -->
					<view class="cu-bar bg-white margin-top">
						<view class="action">{{i18n.base.uploadimg}}</view>
						<view class="action">{{`${imgArr.length} / ${mainpiclimitnum}`}}</view>
					</view>
					
					<view class="bg-white padding">
						<uni-file-picker ref="filepickerref" v-model="imgArr" :limit="mainpiclimitnum"
						return-type="array" :del-icon="true" :auto-upload="false" mode='grid' :disable-preview="false" file-mediatype="image" 
						@select="fileselect" @delete="filedelete" @progress="fileprogress" @success="filesuccess" @fail="filefail">
						</uni-file-picker>
					</view>
					
				</view>
				
				<!-- 拓展信息区域 -->
				<view v-show=" type == 'addext' ">
					
					<!-- 装箱数量 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.boxcontainernum }}</view>
						<input class="borderbottom text-center" style="max-width: 50%;" type="number" cursor-spacing="60" v-model="productExt.boxContainerNum" />
						<text>pcs/box</text>
					</view>
					
					<!-- 单件尺寸 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.boxsize }}</view>
						<view class="flex align-center justify-around" style="max-width: 60%;">
							<input class="borderbottom text-center" cursor-spacing="60" type="digit" v-model="productExt.boxLength" @blur="finishtypesize" />cm * 
							<input class="borderbottom text-center" cursor-spacing="60" type="digit" v-model="productExt.boxWidth" @blur="finishtypesize" />cm *
							<input class="borderbottom text-center" cursor-spacing="60" type="digit" v-model="productExt.boxHeight" @blur="finishtypesize" />cm
						</view>
					</view>
					
					<!-- 单件体积 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.boxvolume }}</view>
						<view class=""></view>
						<input class="text-right" type="digit" v-model="productExt.boxVolume" />
						<text>m³</text>
					</view>
					
					<!-- 单件重量 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.boxweight }}</view>
						<view class=""></view>
						<input class="text-right" type="digit" v-model="productExt.boxWeight" />
						<text>kg</text>
					</view>
					
				</view>
				
				<!-- 确认报价区域 -->
				<view v-show=" type == 'confirmquotation' ">
					
					<wishTableSpec ref="wishtablespec" v-if="tmpWishInfo" :wishInfo="tmpWishInfo" sourcefrom="handletimeline"></wishTableSpec>
					
					<!-- 编辑价格区域 -->
					<view class="editpriceview padding-sm">
						
						<!-- 按钮区域 -->
						<view class="btnsview flex align-center">
							
							<template v-if="!iseditprice">
								<button class="cu-btn round bg-gradual-purple" @tap.stop="starttoeditprice">
									<text class="cuIcon cuIcon-edit margin-right-sm"></text>
									{{ `${i18n.base.edit} ${i18n.wishlist.common.price}` }}
								</button>
								
								<button class="cu-btn round bg-gradual-pink margin-left" @tap.stop="showSelector = true">
									<text class="cuIcon cuIcon-edit margin-right-sm"></text>
									{{ `${i18n.base.edit} ${i18n.wishlist.common.amount}` }}
								</button>
								
							</template>
							
							<template v-if="iseditprice">
								<button class="cu-btn round sm bg-grey cuIcon cuIcon-close" @tap.stop="iseditprice = false"></button>
								<button class="cu-btn margin-left round sm bg-cyan cuIcon cuIcon-check" @tap.stop=" finisheditprice "></button>
							</template>
							
						</view>
						
						<view v-if="iseditprice" class="editpriceview cu-list menu">
							
							<!-- 商品总价 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.price }}</view>
								<input class="text-right" type="digit" v-model="tmpProductExt.proPrice" />
								<text>RMB</text>
							</view>
							
							<!-- 国内运费 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.domesticshippingfee }}</view>
								<input class="text-right" type="digit" v-model="tmpProductExt.domesticShippingFee" />
								<text>RMB</text>
							</view>
							
							<!-- 服务费 -->
							<view class="cu-form-group">
								<view class="title">{{ i18n.wishlist.common.tabledata.commissionfee }}</view>
								<input class="text-right" type="digit" v-model="tmpProductExt.commissionFee" />
								<text>RMB</text>
							</view>
							
						</view>
						
					</view>
					
				</view>
				
			</form>
			
		</view>
		
		<!-- 心愿单更新区域 -->
		<view v-if="wishInfo" class="updateview">
			
			<!-- 心愿基本信息 -->
			<view class="wishbaseinfoview margin-top">
				
				<!-- 标题栏 -->
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon-likefill text-pink"></text>
						<text>{{ `心愿详情` }}</text>
					</view>
				</view>
				
				<!-- 列表信息展示 -->
				<view class="cu-list menu">
					
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-timefill text-grey"></text>
							<uni-dateformat class="text-grey" :date="wishInfo.creatTime" />
						</view>
					</view>
					
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-shopfill text-grey"></text>
							<text class="text-grey">{{ wishInfo.sellerInfo.nickName }}</text>
						</view>
					</view>
					
					<view class="cu-item">
						<view class="content">
							<text class="cuIcon cuIcon-peoplefill text-grey"></text>
							<u-avatar :src="wishInfo.creatUser.avatar" size="mini"></u-avatar>
						</view>
						
						<view v-if="wishInfo.agentUser" class="action">
							<u-avatar :src="wishInfo.agentUser.avatar" size="mini" show-level level-icon="kefu-ermai" level-bg-color="#0081ff"></u-avatar>
						</view>
					</view>
					
				</view>
				
			</view>
			
			<!-- 商品信息 -->
			<view class="productsview margin-top">
				
				<view class="cu-bar bg-white solid-bottom">
					<view class="action">
						<text class="cuIcon cuIcon-goods text-orange"></text>
						<text>{{ `商品信息` }}</text>
					</view>
				</view>
				
				<!-- 商品规格table -->
				<view class="wishspecview margin">
					<wishTableSpec ref="wishtablespec" :wishInfo="wishInfo" type="quotation"></wishTableSpec>
				</view>
				
			</view>
			
		</view>
		
		<!-- 确定按钮 -->
		<view v-if="wishInfo && !iseditprice" class="cu-bar btn-group margin">
			<button class="cu-btn round bg-pink lg" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
	</view>
</template>

<script>
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
		
	var _this
	
	
	export default {
		
		components: {
			wishTableSpec,
		},
		
		data() {
			return {
				type: "addcomment", // 页面类型  addcomment 添加普通评论	addext为补充商品资料信息	confirmquotation为确认报价单
				pagetype: 'add', // 页面自身的类型  add为新增 edit为编辑  默认为add 为普通时间轴时使用
				wishId: null, // 当前时间轴的心愿id
				wishInfo: null, // 当前心愿详情
				tmpWishInfo: null, // 临时心愿变量
				productExt: {
					boxContainerNum: '',
					boxLength: '',
					boxWidth: '',
					boxHeight: '',
					boxVolume: '',
					domesticShippingFee: '',
					proPrice: '',
					commissionFee: '',
				} ,// 心愿商品的拓展字段
				tmpProductExt: null, // 信息临时变量
				specPropInfo: null, // 规格信息
				timelineId: null, // 当前时间轴id
				timelineInfo: null, // 时间轴数据
				
				swiperimgArr: [], // 轮播图片数组
				
				price: '', // 目标价格
				moneyType: 'RMB', // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
				mainpiclimitnum: 9, // 图片上传的数量限制
				targetLink: '', // 目标网站链接
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				showSelector: false, // 是否显示规格选择器
				content: '', // 备注
				textareaHighScreen: false, // textarea是否高屏显示
				iseditprice: false, // 是否正在编辑价格
				
				
				
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
				db.collection('wish,uni-id-users')
					.doc(_this.wishId)
					.field('creatUid{username,nickname,avatar} as creatUser,agentUid{username,nickname,avatar} as agentUser,creatTime,updateTime,status,productList,quotationInfo')
					.get({
						getOne:true
					})
					.then(res => {
						
						if(res.result.code == 0) {
							
							let detaildata = res.result.data
							
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							if(detaildata.productList.length > 0) {
								let sellerInfo = detaildata.productList[0].sellerInfo
								detaildata['sellerInfo'] = sellerInfo
							}
							
							_this.wishInfo = detaildata
							_this.tmpWishInfo = {..._this.wishInfo}
							
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
				db.collection('wishlisttimeline')
				.doc(_this.timelineId)
				.get({getOne: true})
				.then(res => {
					
					if(res.result.code == 0) {
						console.log(`获取时间轴详情数据成功`);
						console.log(res.result.data);
						let info = res.result.data
						_this.timelineInfo = info
						
						// 时间轴类型
						// type: timelinetype, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认  4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
						_this.type = info.type == 1 ? 'addcomment' : _this.type
						_this.content = info.content || ''
						
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
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			// 输入完箱体长宽高之后
			finishtypesize() {
				let boxLength = this.productExt.boxLength
				let boxWidth = this.productExt.boxWidth
				let boxHeight = this.productExt.boxHeight
								
				// 当长宽高均存在时自动开始计算箱体体积
				if(boxLength && boxWidth && boxHeight) {
					this.calculatevalume()
				}
			},
			
			// 计算货物体积
			calculatevalume() {
				// 如果商品的长宽高没有填完则提示用户 否则进行计算
				if(this.productExt && this.productExt.boxLength && this.productExt.boxWidth && this.productExt.boxHeight) {
					let boxVolume = parseFloat(parseFloat(this.productExt.boxLength/100) * parseFloat(this.productExt.boxWidth/100) * parseFloat(this.productExt.boxHeight/100)).toFixed(4)
					this.$set(this.productExt, 'boxVolume', boxVolume)
					console.log(this.productExt);
				}
				else {
					this.$set(this.productExt, 'boxVolume', '')
				}
			},
			
			// 开始编辑价格
			starttoeditprice() {
				// 将商品总价设置为规格表格中的商品总价为初始值
				let priceInfo = this.$refs.wishtablespec.getPriceInfo()
				let proPrice = priceInfo.totalProPrice
				
				this.tmpProductExt = {...this.productExt, ...{proPrice: proPrice}}
				
				this.iseditprice = true
			},
			
			// 编辑完价格
			finisheditprice() {
				this.productExt = this.tmpProductExt
				this.$set(this.tmpWishInfo, 'productExt', this.productExt) // 变更临时变量的规格数据
				this.iseditprice = false
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
			
			// 更新拓展信息
			updateproext() {
				
				// 将服务费和运费保留两位小数
				this.productExt.domesticShippingFee = this.productExt.domesticShippingFee && this.productExt.domesticShippingFee != 'NaN' ? parseFloat(this.productExt.domesticShippingFee).toFixed(2) : ''
				this.productExt.commissionFee = this.productExt.commissionFee ? parseFloat(this.productExt.commissionFee).toFixed(2) : ''
				
				_this.ifloading = true
				const db = uniCloud.database();
				db.collection('wishlist')
				.doc(this.wishId)
				.update({productExt: this.productExt, optionTime: db.env.now})
				.then(res => {
					if(res.result.code == 0) {
						// 更新成功
						uni.$emit('updatewishdetail')
						
						uni.showToast({
							title: _this.i18n.tip.fixsuccess,
							icon: 'none'
						});
						setTimeout(function() {
							uni.navigateBack();
						}, 1500);
					}
				})
				.catch(err => {
					console.log(err.message);
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				.finally( () => {
					_this.ifloading = false
				})
				
			},
			
			// 选择完规格
			specFinishSelect(selectSpecPropInfo) {
				// console.log(`当前选择完规格的数据为`);
				// console.log(selectSpecPropInfo);
				this.$set(this.tmpWishInfo, 'specPropInfo', selectSpecPropInfo) // 变更临时变量的规格数据
				// console.log(this.tmpWishInfo);
			},
			
			// 上传数据
			uploaddata() {
				
				// 进行数据检查
				
				// 添加普通更新内容时
				if(this.type === 'addcomment') {
					
					// 检查是否有评论内容
					if(!this.content) {
						uni.showToast({
							title: this.i18n.placeholder.handletimeline.typecontent,
							icon: 'none'
						});
						return false
					}
					
				}
				// 补充拓展信息时
				else if(this.type === 'addext') {
					// productExt不能所有数值均为空
					let productExt = this.productExt
					if(!productExt.boxContainerNum && !productExt.boxLength && !productExt.boxWidth && !productExt.boxHeight 
						&& !productExt.boxVolume) 
					{
						uni.showToast({
							title: this.i18n.placeholder.handletimeline.typecontent,
							icon: 'none'
						});
						return
					}
					
					// 开始更新补充信息
					_this.updateproext()
					return
				}
				// 确认报价单时
				else if(this.type === 'confirmquotation') {
					
					// 上传规格数据前校验国内运费
					if(!_this.productExt.domesticShippingFee || _this.productExt.domesticShippingFee == '') {
						
						uni.showToast({
							title: _this.i18n.placeholder.handletimeline.typedomesticshippingfee,
							icon: 'none'
						});
						
						_this.iseditprice = true
						
						return
					}
					// 上传规格数据前校验服务费
					else if(_this.productExt.commissionFee == '') {
						
						uni.showToast({
							title: _this.i18n.placeholder.handletimeline.typecommissionfee,
							icon: 'none'
						});
						
						_this.iseditprice = true
						
						return
						
					}
					
					// 进行二次确认提醒代理员
					uni.showModal({
						content: _this.i18n.wishlist.timeline.confirmquotationtip,
						showCancel: true,
						cancelText: _this.i18n.base.cancel,
						confirmText: _this.i18n.base.confirm,
						success: res => {
							if(res.confirm) {
								
								// 获取当前各类价格进行计算
								let priceInfo = _this.$refs.wishtablespec.getPriceInfo()
								let priceUpdateInfo = {
									domesticShippingFee: priceInfo.totalDomesticShippingFee,
									commissionFee: priceInfo.totalCommissionFee,
									proPrice: priceInfo.totalProPrice,
									totalPrice: priceInfo.totalPrice
								}
								let newProductExt = {..._this.tmpWishInfo.productExt, ...priceUpdateInfo}
								
								// 开始上传确认的规格数据
								const db = uniCloud.database();
								db.collection('wishlist')
								.doc(_this.wishId)
								.update({specPropInfo: _this.tmpWishInfo.specPropInfo, achieveFlag: 1, productExt: newProductExt, optionTime: db.env.now})
								.then(response => {
									
									// 更新成功
									
																		
									// 新增一条待确认时间轴
									let timelineinfo = {
										wishId: _this.wishId, // 当前心愿单的id
										price: priceInfo.totalPrice, // 当前报价单的总价
										type: 3, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认 4心愿单确认通过  5心愿单确认拒绝  6心愿单完成  99 代理人关联心愿
									}
									db.collection('wishlisttimeline')
									.add(timelineinfo)
									.then(res => {
										// 新增成功
										if(res.result.code == 0) {
											
											// 更新事件轴数据
											uni.$emit('updatetimeline')
											// 更新心愿单列表和详情
											uni.$emit('updatewishlist')
											uni.$emit('updatewishdetail')
											
											uni.showToast({
												title: _this.i18n.tip.fixsuccess,
												icon: 'none',
											});
										
											// 推送确认报价单的提醒消息
											_this.pushnoticemsg('confirmquotation')
											
											// 代理员订阅消息
											_this.subscribenoticemsg()
		
										}
										// 新增失败
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
									
								})
								.catch(error => {
									console.log(error.message);
									uni.showToast({
										title: _this.i18n.error.fixerror,
										icon: 'none'
									});
								})
								
							}
						}
					});
					
					return
				}
				
				// 开始上传普通时间轴数据
				// 检查是否需要上传图片
				if(this.imgArr.find(item => { return item.progress == 0 })) {
					// 开始上传图片
					this.ifloading = true
					this.$refs.filepickerref.upload()
					return
				}
				
				// 上传图片已经成功 此时开始提交其他数据
				let imgs = this.imgArr.map(item => (item.url)).join(',')
				
				// 根据上传的类型不同选择不同的接口调用
				
				// 上传数据
				let info = {
					wishId: _this.wishId, // 当前心愿单的id
					content: _this.content, // 内容信息
					imgs: imgs, // 图片字符串集合
					type: 1, // 时间轴类型  0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认 4心愿单确认通过  5心愿单确认拒绝  6心愿单完成  
				}
				
				// 开始提交数据
				
				// 新增
				if(_this.pagetype == 'add') {

					// 如果是普通时间轴操作
					if( this.type === 'addcomment' ) {
						// 开始使用openDB进行数据上传
						_this.ifloading = true
						
						const db = uniCloud.database();
						db.collection('wishlisttimeline').add(info)
						.then(res => {
							// 新增成功
							if(res.result.code == 0) {
								
								// 发布成功
								// 更新对应的心愿操作时间
								db.collection('wishlist').doc(info.wishId).update({optionTime: db.env.now})
								
								// 更新事件轴数据
								uni.$emit('updatetimeline')
								
								uni.showToast({
									title: _this.i18n.tip.addsuccess,
									icon: 'none',
								});
								
								setTimeout(function() {
									uni.navigateBack();
								}, 1000);
								
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
					
				}
				// 编辑
				else if(_this.pagetype == 'edit') {
					
					// 如果是普通时间轴操作
					if( this.type === 'addcomment' ) {
						// 开始使用openDB进行数据上传
						_this.ifloading = true
						
						const db = uniCloud.database();
						// 增加编辑时间
						info['editTime'] = db.env.now
						info['editUser'] = db.env.uid
						
						db.collection('wishlisttimeline').doc(_this.timelineId)
						.update(info)
						.then(res => {
							// 编辑成功
							if(res.result.code == 0) {
								
								// 更新对应的心愿操作时间
								db.collection('wishlist').doc(info.wishId).update({optionTime: db.env.now})
								
								// 更新事件轴数据
								uni.$emit('updatetimeline')
								
								uni.showToast({
									title: _this.i18n.tip.fixsuccess,
									icon: 'none',
								});
								
								setTimeout(function() {
									uni.navigateBack();
								}, 1000);
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
						.finally(() => {
							_this.ifloading = false
						})
						
					}
					
				}
				
			},
			
			// 订阅消息  订阅后返回
			subscribenoticemsg() {
				
				// 开始获取订阅
				// #ifdef MP-WEIXIN
				
				// 增加订阅模板消息的功能
				let finishpayId = this.$store.getters.configData.wxminiNoticeTemplateDic.finishpay
				let confirmquotationId = this.$store.getters.configData.wxminiNoticeTemplateDic.confirmquotation
				
				uni.requestSubscribeMessage({
					tmplIds: [finishpayId,confirmquotationId],
					success(res){
						let errMsg = res.errMsg
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[finishpayId]);
							// 用户同意订阅
							if(res[confirmquotationId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[finishpayId] == 'reject') {
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
						uni.navigateBack();
					}
				})
				
				// #endif
				
				// #ifndef MP-WEIXIN
				uni.navigateBack();
				// #endif
				
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: {
							msgtype: msgtype,
							wishId: _this.wishId
						}
					}
				}).then(response => {
					// 发送微信消息成功
					if(response.result.errCode == 0) {
						console.log(`发送微信订阅消息成功`);
					}
					else {
						console.log(`发送微信订阅消息失败,原因是:${response.result.message}`);
					}
						
				}).catch(error => {
					console.log(error.message);
				})

			},
			
		},
	}
</script>

<style lang="scss" scoped>
</style>
