<template>
	<view class="content addwishview bg-gray">
		
		<cu-custom isBack bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wishlist}}</block>
		</cu-custom>

		<!-- 填写的表单信息 -->
		<form class="fillcontentform">
			
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
				<button class="cu-btn bg-cyan shadow margin-left" @tap.stop="pasteData('productTitle')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</view>
			
			<!-- 源网站链接 -->
			<view class="cu-form-group">
				<view class="title">
					<text class="cuIcon cuIcon-info" @tap.stop="showTipModal('sourceLink')"></text>
					{{i18n.wishlist.sourcelink}}:
				</view>
				<input type="text" confirm-type="next" v-model="sourceLink" @blur="analysisUrl" />
				<!-- <textarea auto-height :show-confirm-bar="false" v-model="sourceLink" @blur="analysisUrl" /> -->
				<!-- #ifndef H5 -->
				<button class="cu-btn bg-cyan shadow" @tap.stop="pasteData('sourceLink')">{{i18n.base.paste}}</button>
				<!-- #endif -->
			</view>
			
			<!-- 链接解析结果 -->
			<view class="cu-form-group flex" v-if="productSecretCode || productPureUrl">
				<view v-if="productSecretCode" class="flex-sub bg-blue light padding-sm margin-xs radius text-cut" @tap.stop="copyStr(productSecretCode)">{{ productSecretCode }}</view>
				<view v-if="productPureUrl" class="flex-sub bg-yellow light padding-sm margin-xs radius text-cut" @tap.stop="copyStr(productPureUrl)">{{ productPureUrl }}</view>
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
			
			<!-- 目标价格 暂时屏蔽 -->
			<view v-if="false" class="cu-form-group">
				
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
				<!-- <textarea maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="100" v-model="targetAmount" /> -->
			</view>
			
			<!-- 紧急程度  暂时屏蔽 -->
			<view v-if="false" class="cu-form-group solid-bottom">
				<view class="title">{{i18n.wishlist.hurrylevel}}</view>
				<picker :range="hurrylevelDataArr" range-key="name" :value="hurryLevel - 1" @change="hurrylevelchange">
					<view class="picker">
						<text v-for="item in hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
						<text class="margin-left-sm">{{ hurrylevelDataArr[hurryLevel - 1].name }}</text>
					</view>
				</picker>
			</view>
			
			<!-- 备注 -->
			<view class="cu-form-group">
				<textarea maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="100" v-model="remark" :placeholder="i18n.wishlist.remark" />
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
			<button class="cu-btn round bg-pink" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 订阅消息modal框 -->
		<view class="cu-modal" :class=" showModal ? 'show' : '' ">
			
			<template>
				
				<!-- 图片弹框内容 -->
				<view class="cu-dialog" v-if="modalType == 'img'">
					<view class="bg-img" :style="{ backgroundImage: 'url('+modalImg+')',height: '700rpx' }"></view>
					
					<view class="cu-bar bg-gradual-pink">
						<view class="action margin-0 flex-sub  solid-left" @tap="showModal = false">{{ i18n.base.confirm }}</view>
					</view>
				</view>
				
				<!-- 文字弹框内容 -->
				<view class="cu-dialog" v-if="modalType == 'content'">
					
					<view class="cu-bar bg-white justify-end">
						<view class="content">{{ modalTitle }}</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-pink"></text>
						</view>
					</view>
					
					<view class="padding-xl">
						{{ modalContent }}
					</view>
					
					<view class="cu-bar bg-white">
						<view class="action">
							<button class="cu-btn bg-grey" @tap="hideModal">{{ i18n.base.cancel }}</button>
						</view>
						<view class="action">
							<button class="cu-btn bg-green margin-left" @tap="confirmModal">{{ i18n.base.confirm }}</button>
						</view>
					</view>
					
				</view>
				
			</template>
			
		</view>
				
	</view>
</template>

<script>
	
	var _this
	
	export default {
		data() {
			return {
				
				type: 'add', // 页面状态 add新增 edit编辑 copy 拷贝
				id: null, // 当前心愿详情id
				productTitle: '', // 商品标题
				sourceLink: '', // 源网站链接
				
				productSecretCode: '', // 商品编码口令
				productPureUrl: '', //商品纯链接
				
				sourcePrice: '', // 源网站价格
				sourceMoneyType: 'RMB', // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
				collapseOpen: false, // 是否展开商品更多  默认不展开
				
				boxContainNum: '', // 一箱有几个
				boxLength: '', // 箱子长度
				boxWidth: '', // 箱子宽度
				boxHeight: '', // 箱子高度
				boxValume: '', // 箱子体积
				interShippingSingleFeeStr: '', // 国际运费单价
				
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
				modalType: 'content', // 弹框类型 默认为文本
				showModal: false, // 是否显示modal
				modalImg: '', // 图片提示框中的图片地址
				
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
		
		computed: {
			
			// 国际运费总价
			interShippingTotalFeeStr() {
				
				// 如果是体积和单价存在的情况下则正常返回 否则返回计算中
				if(this.boxValume && this.interShippingSingleFeeStr) {
					let interShippingTotalFee = parseFloat(parseFloat(this.boxValume) * parseFloat(this.interShippingSingleFeeStr)).toFixed(2)
					let interShippingTotalFeeStr = `${this.boxValume}m³ * ${this.interShippingSingleFeeStr} /m³ ≈ ${interShippingTotalFee}`
					return interShippingTotalFeeStr
				}
				else {
					return '……'
				}
			},
			
			//
		},
		
		methods: {
			
			// 获取心愿详情
			getwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用opendb获取详情数据
				const db = uniCloud.database();
				let wherestr = ` creatUser._id == $cloudEnv_uid && _id == '${_this.id}' `
				db.collection('wishlist,uni-id-users')
				.where(wherestr)
				.field('creatUser{nickname,avatar},_id,achieveFlag,productTitle,hurryLevel,imgs,targetAmount,targetPrice,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,remark,creatTime,productExt')
				.get({
					getOne:true
				})
				.then(res => {
					if(res.result.code == 0) {
						// 获取数据成功
						let info = res.result.data
						console.log(`详情数据为`);
						console.log(info);
						
						this.productTitle = info.productTitle // 商品标题
						this.sourceLink = info.sourceLink // 源网站链接
						this.sourcePrice = info.sourcePrice // 源网站价格
						this.sourceMoneyType = info.sourceMoneyType // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
						this.targetPrice = info.targetPrice // 目标价格
						this.targetMoneyType = info.targetMoneyType // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
						this.targetAmount = info.targetAmount // 目标数量
						this.hurryLevel = info.hurryLevel // 紧急程度 默认为2级 int 类型
						this.remark = info.remark // 备注信息
						let imgsArr = info.imgs.split(',') // 商品图片
						this.imgArr = imgsArr.map(item => ({url: item}))
						
						// 解析商品链接
						this.analysisUrl()
						
						// 解析心愿商品拓展字段
						let productExt = info.productExt
						if(productExt) {
							let boxContainNum = productExt.boxContainNum
							let boxLength = productExt.boxLength
							let boxWidth = productExt.boxWidth
							let boxHeight = productExt.boxHeight
							
							if(boxContainNum) {this.boxContainNum = boxContainNum}
							if(boxLength && boxWidth && boxHeight) {
								this.boxLength = boxLength
								this.boxWidth = boxWidth
								this.boxHeight = boxHeight
								// 计算体积
								this.calculatevalume()
							}
							
							if(boxContainNum || boxLength || boxWidth || boxHeight) {
								this.collapseOpen = true
							}
							
						}
						
					}
					else {
						// 获取数据失败
						uni.showToast({
							title: this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					console.log(`获取数据失败-${err.message}`);
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			// 显示提示弹框
			showTipModal(type) {
				let modalImg = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/32115416-4de9-439e-9cd3-ce844306167c.gif'
				console.log(type);
				// 来源链接
				if(type == 'sourceLink') {
					modalImg = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-444a0d7a-4a95-4237-9dec-e7b434d01cda/32115416-4de9-439e-9cd3-ce844306167c.gif'
				}
				
				this.modalImg = modalImg
				this.modalType = 'img'
				this.showModal = true
			},
			
			// 粘贴内容
			pasteData(datatype) {
				uni.getClipboardData({
					success(res) {
						let content = res.data
						if(content) {
							_this[datatype] = content
							// 如果是拷贝链接的话则执行链接提取
							if(datatype == 'sourceLink') {
								_this.analysisUrl()
							}
						}
					}
				})
			},
			
			// 解析链接
			analysisUrl() {
				
				let content = this.sourceLink
				console.log(content);
				// 匹配口令内容
				let patt = new RegExp(`(￥\\S+￥)\\S+(https?:\\S+)`)
				let resultArr = patt.exec(content)
				console.log(resultArr);
				if(resultArr && resultArr.length > 1) {
					let productSecretCode = RegExp.$1
					let productPureUrl = RegExp.$2
					console.log(productSecretCode);
					console.log(productPureUrl);
					if(productSecretCode) {
						this.productSecretCode = productSecretCode
					}
					if(productPureUrl) {
						this.productPureUrl = productPureUrl
					}
				}
				
			},
			
			// 复制内容
			copyStr(content) {
				
				// #ifndef H5
				uni.setClipboardData({
					data: content,
					success() {
						uni.showToast({
							title: this.i18n.tip.copysuccess,
							icon: 'none'
						});
					}
				})
				// #endif
				
			},
			
			// 输入源网站价格
			typesourcePrice(e) {
				let sourcePrice = e.detail.value
				this.targetPrice = sourcePrice
				this.targetMoneyType = this.sourceMoneyType
			},
			
			// 计算货物体积
			calculatevalume() {
				// 如果商品的长宽高没有填完则提示用户 否则进行计算
				if(this.boxLength && this.boxWidth && this.boxHeight) {
					this.boxValume = parseFloat(parseFloat(this.boxLength/100) * parseFloat(this.boxWidth/100) * parseFloat(this.boxHeight/100)).toFixed(4)
				}
				else {
					this.boxValume = ''
					uni.showToast({
						title: '请输入长宽高',
						icon: 'none'
					});
				}
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
			
			// 查看大图
			previewImg(index) {
				
				// 组装预览图的数据
				let previewimgArr = this.imgArr.map(item => (item.path))
				// 开始预览
				uni.previewImage({
					urls: previewimgArr,
					current: index
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
				
				// 商品拓展字段
				let productExt = {
					secretCode: this.productSecretCode,// 商品口令
					pureUrl: this.productPureUrl, // 商品纯链接
					boxContainNum: this.boxContainNum,
					boxLength: this.boxLength,
					boxWidth: this.boxWidth,
					boxHeight: this.boxHeight,
				}
				
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
					productExt: productExt, // 商品的拓展字段
				}
				
				// 新增 或者 拷贝
				if(_this.type == 'add' || _this.type == 'copy') {
					
					// 使用openDB进行数据写入
					const db = uniCloud.database();
					_this.ifloading = true
					
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
						
						let modalTitle = this.i18n.tip.addsuccess
						_this.checksubscribe(modalTitle) // 添加成功后检查订阅消息
						
					})
					.catch(err => {
						uni.showToast({
							title: err.message,
							icon: 'none'
						});
					})
					.finally(() => {
						_this.ifloading = false
					})
										
				}
				
				// 编辑
				else if(_this.type == 'edit') {
					
					// 使用openDB更新数据
					_this.ifloading = true
					const db = uniCloud.database();
					db.collection('wishlist').doc(_this.id).update(info)
					.then(res => {
						// 更新成功
						uni.$emit('updatewishdetail')
						uni.$emit('updatewishlist')
						
						let modalTitle = _this.i18n.tip.fixsuccess
						_this.checksubscribe(modalTitle) // 更新成功后检查订阅消息
						
					})
					.catch(err => {
						console.log(`更新失败,原因为${err.message}`);
						uni.showToast({
							title: _this.i18n.error.fixerror,
							icon: 'none'
						});
					})
					.finally(() => {
						_this.ifloading = false
					})
					
				}
				
			},
			
			// 检查订阅消息
			checksubscribe(modalTitle) {
				
				// 如果是在小程序端则进行订阅消息
				// #ifdef MP-WEIXIN
				this.modalTitle = modalTitle
				this.modalContent = this.i18n.tip.subsribewxmsg
				this.modalType = 'content'
				this.showModal = true
				// #endif
				
				// 非小程序则直接返回
				// #ifndef MP-WEIXIN
				uni.showToast({
					title: modalTitle,
					icon: 'none',
					duration: 1500
				});
				setTimeout(function() {
					uni.navigateBack();
				}, 1500);
				// #endif
				
			},
			
			// 隐藏弹出框
			hideModal() {
				this.showModal = false
				uni.navigateBack();
			},
			
			// 点击弹出框确定按钮  开始订阅消息
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
	.content{
		/deep/.fillcontentform{
			.uni-collapse-cell{
				border: none !important;
				.uni-collapse-cell__content{
					background-color: #FFFFFF;
				}
			}
		}
	}
</style>
