<template>
	<view class="content addwishview bg-gray">
		
		<cu-custom bgColor="bg-gradual-pink" isBackConfirm>
			<block slot="content">{{i18n.nav.wish}}</block>
		</cu-custom>

		<!-- 填写的表单信息 -->
		<form class="fillcontentform">
			
			<!-- 我发现区域 -->
			<template v-if="false">
				
				<!-- 我发现 -->
				<view class="cu-bar bg-white margin-top">
					<view class="action">
						<text class="cuIcon cuIcon-titles text-green"></text>
						<text class="text-xl text-bold">{{ i18n.wishlist.handlewish.ifound }}</text>
					</view>
				</view>
				
				<!-- 源网站链接 -->
				<view class="cu-form-group">
					<view class="title">
						<!-- <text class="cuIcon cuIcon-info" @tap.stop="showTipModal('sourceLink')"></text> -->
						{{i18n.wishlist.common.link}}:
					</view>
					<input type="text" v-model="sourceLink" @blur="analysisUrl" />
					<button class="cu-btn bg-cyan shadow margin-right-sm" @tap.stop="pasteData('sourceLink')">{{i18n.base.paste}}</button>
					
				</view>
				
				<!-- 链接解析结果 -->
				<view class="cu-form-group flex" v-if="productSecretCode || productPureUrl">
					<view v-if="productSecretCode" class="flex-sub bg-blue light padding-sm margin-xs radius text-cut" @tap.stop="$basejs.copytoclipboard(productSecretCode)">{{ productSecretCode }}</view>
					<view v-if="productPureUrl" class="flex-sub bg-yellow light padding-sm margin-xs radius text-cut" @tap.stop="$basejs.copytoclipboard(productPureUrl)">{{ productPureUrl }}</view>
				</view>
				
				<!-- 商品标题 -->
				<view class="cu-form-group">
					<view class="title">{{i18n.wishlist.common.title}} :</view>
					<textarea v-model="productTitle" :placeholder="i18n.placeholder.handlewish.title"
					auto-height
					:show-confirm-bar="false" 
					disable-default-padding
					/>
					<button class="cu-btn bg-cyan shadow margin-left" @tap.stop="pasteData('productTitle')">{{i18n.base.paste}}</button>
				</view>
				
				<!-- 商品价格 -->
				<view class="cu-form-group">
					
					<view class="title">{{i18n.wishlist.common.price}} :</view>
					
					<view class="content flex-sub flex align-center">
						<text :class="[ sourceMoneyType == 'RMB' ? 'text-red' : 'text-blue', 'margin-right-sm' ]">{{ sourceMoneyType == 'RMB' ? 'RMB' : 'THB' }}</text>
						<input type="text" :style="{color: 'red'}" disabled v-model="sourcePrice" @input="typesourcePrice" />
					</view>
					
					<!-- 源网站货币种类选择 -->
					<!-- <view class="flex align-center margin-left">
						<button class="cu-btn sm round margin-right" :class="sourceMoneyType === 'RMB' ? 'bg-red shadow' : 'line-red' " @tap.stop="sourceMoneyType='RMB'">¥</button>
						<button class="cu-btn sm round " :class="sourceMoneyType === 'THB' ? 'bg-blue shadow' : 'line-blue' " @tap.stop="sourceMoneyType='THB'">฿</button>
					</view> -->
				
				</view>
				
			</template>
			
			<!-- 我想要 -->
			<view class="cu-bar bg-white margin-top">
				<view class="action">
					<text class="cuIcon cuIcon-titles text-pink"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.handlewish.iwant }}</text>
				</view>
			</view>
			
			<!-- 商品别名 -->
			<view class="cu-form-group">
				
				<view class="title">{{i18n.wishlist.common.aliasname}} :</view>
				
				<view class="content flex-sub flex align-center">
					<input class="text-right" :auto-focus=" type == 'add' " type="text" placeholder-class=" text-sm text-grey " v-model="aliasName" :placeholder="i18n.placeholder.handlewish.aliasname" />
				</view>
				
			</view>
			
			<!-- 输入规格数量 -->
			<view v-if="!specPropInfo" class="cu-form-group">
				<view class="title">{{i18n.wishlist.common.amount}} :</view>
				<input class="text-right" maxlength="-1" disable-default-padding :cursor-spacing="100" v-model="targetAmount" :placeholder="i18n.placeholder.handlewish.amount" />
			</view>
			
			<!-- 选择仓库 -->
			<view v-if="false" class="cu-form-group" @tap.stop="selectshow = !selectshow">
				<view class="title">{{i18n.wishlist.common.warehouse}}</view>
				<view class="content flex align-center justify-end">
					<view class="selectcontent text-right">
						<text :class="[ selectwarehouseinfo ? 'text-black' : 'text-sm text-gray' ]">{{ selectwarehouseinfo ? `${selectwarehouseinfo.company.label}->${selectwarehouseinfo.city.label}->${selectwarehouseinfo.shippingway.label}` : i18n.placeholder.handlewish.warehouse }}</text>
						<text v-if="selectwarehouseinfo" class="text-red text-sm block">≈{{ selectwarehouseinfo.price.value }}</text>
					</view>
					<text class="cuIcon cuIcon-right"></text>
				</view>
			</view>
			
			<!-- 唛头 -->
			<view v-if="false" class="cu-form-group pos-relative">
				<view class="title">{{i18n.wishlist.common.shippingcode}}</view>
				<view class="inputview pos-relative">
					<input class="text-right" :placeholder="i18n.placeholder.handlewish.shippingcode" name="shippingcode" :value="shippingCode" @focus="typeshippingcodefocus" @blur="typeshippingcodeblur" @input="typeshippingcode"></input>
					
					<!-- 提示信息 -->
					<view v-show="ifshowcodetip && codelistsearchresult && codelistsearchresult.length > 0" class="tipsview pos-absolute shadow shadow-blur bg-white"
								style="top: 35px; left: 0; right: 0;z-index: 10;"
					>
						
						<view class="contentview padding-sm" style="max-height: 200rpx;overflow: scroll;">
							<view v-for="(item,index) in codelistsearchresult" :key="item" class="text-grey padding-sm" @tap.stop="shippingCode = item">{{ item }}</view>
						</view>
						
					</view>
					
				</view>
				
			</view>
			
			<!-- 备注 -->
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="100" v-model="remark" :placeholder="i18n.placeholder.handlewish.remark" />
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
			
		</form>
		
		<!-- 确定按钮 -->
		<view class="cu-bar btn-group padding-xl">
			<button class="cu-btn round bg-pink" @tap.stop="uploaddata">{{i18n.base.confirm}}</button>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 中间弹出框 -->
		<u-popup class="popupview" v-model="showModal" mode="center" border-radius="10" width="80%" z-index="600" :mask-close-able="false">
			
			<!-- 图片展示 -->
			<view v-if="modalType == 'img'" class="contentview t_center">
				
				<image :src="modalImg" :style="{width: '100%'}" mode="widthFix"></image>
				<text class="cuIcon cuIcon-roundclosefill text-white margin-top" :style="{fontSize: '40px',display: 'inline-block'}" @click="showModal = false"></text>
				
			</view>
			
			<!-- 文字展示 -->
			<view v-if="modalType == 'content'" class="bg-white contentview">
				
				<view class="titleview padding-xl text-lg text-center text-bold text-black">{{ modalTitle }}</view>
				
				<view class="contentview padding text-df text-center">{{ modalContent }}</view>
				
				<view class="cu-bar bg-white">
					<view class="action">
						<button class="cu-btn bg-grey" @tap="hideModal">{{ i18n.base.cancel }}</button>
					</view>
					<view class="action">
						<button class="cu-btn bg-gradual-pink margin-left" @tap="confirmModal">{{ i18n.base.confirm }}</button>
					</view>
				</view>
				
			</view>
			
			<!-- 同商店心愿展示 -->
			<view v-if="modalType == 'samestorewish'" class="bg-white contentview">
				
				<view class="contentview padding text-df text-center">{{ modalContent }}</view>
				
				<scroll-view scroll-x class="width100 padding-left padding-right shadow-blur flex align-center">
					
					<view class="eachwish" v-for="(item, index) in samestorewishlist" :key="item._id">
						{{ JSON.stringify(item) }}
					</view>
					
				</scroll-view>
				
				<view class="cu-bar bg-white">
					<view class="action">
						<button class="cu-btn bg-grey" @tap="hideModal">{{ i18n.base.cancel }}</button>
					</view>
					<view class="action">
						<button class="cu-btn bg-gradual-pink margin-left" @tap="confirmModal">{{ i18n.base.confirm }}</button>
					</view>
				</view>
				
			</view>
			
		</u-popup>
		
		<!-- 仓库地址选择器 -->
		<u-select v-model="selectshow" mode="mutil-column-auto" :list="warehouseselectlist" @confirm="confirmselect"></u-select>
		
	</view>
</template>

<script>
		
	var _this
	
	export default {
		
		components: {
			
		},
				
		data() {
			return {
				
				type: 'add', // 页面状态 add新增 edit编辑 copy 拷贝
				id: null, // 当前心愿详情id
				productTitle: '', // 商品标题
				aliasName: '', // 别名
				sourceLink: '', // 源网站链接
				sellerInfo: null, // 卖家信息
				selectshow: false, // 是否显示仓库选择器
				warehouseselectlist: [], // 仓库地址选择器数据
				selectwarehouseinfo: null, // 当前选择的仓库信息
				shippingCode: '', // 仓库代码
				ifshowcodetip: false, // 是否显示仓库代码提示
				codelistsearchresult: null, // 仓库代码提示数组
				merchantcodeshipcodelist: null, // 商家个人仓库代码列表数据
				
								
				productSecretCode: '', // 商品编码口令
				productPureUrl: '', //商品纯链接
				
				sourcePrice: '', // 源网站价格
				sourceMoneyType: 'RMB', // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
				
				productInfo1688: null, // 1688上的商品信息
				thirdPidType: '', // 第三方商品类型
				thirdPid: '', // 第三方商品pid
				
				targetPrice: '', // 目标价格
				targetMoneyType: 'RMB', // 期望价格币种 默认为RMB  RMB人民币 THB泰铢
				unitCommissionFee: '20', // 服务费单价
				targetAmount: '', // 目标数量
				specPropInfo: null, // 心愿规格数组
				hurryLevel: 0, // 紧急程度 默认为2级 int 类型
				hurrylevelDataArr: [], // 紧急程度数据源数组
				mainpiclimitnum: 9, // 图片上传的数量限制
				imgArr: [], // 图片数组
				ifloading: false, // 是否正在加载中 
				remark: '', // 备注
				remarkFocus: false, // 备注是否聚焦 默认否
				
				modalTitle: '弹框标题',
				modalContent: '弹框内容',
				modalType: 'content', // 弹框类型 默认为文本
				showModal: false, // 是否显示modal
				modalImg: '', // 图片提示框中的图片地址
				
				showSelector: false, // 是否显示多规格选择器  默认为否
				
				samestorewishlist: null, // 同商店心愿列表
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			this.type = option.type // add 新增  edit编辑 copy拷贝
			
			// 设置收货仓库地址
			this.getwarehousedatalist()
			
			// 设置紧急程度数组
			this.setHurryLevelArr()
			
			// 如果是新增
			if(this.type === 'add') {
				// 如果有第三方商品信息则自动加载数据
				let productInfo1688 = uni.getStorageSync('productInfo1688')
				if(productInfo1688) {
					// 设置1688数据
					this.set1688productInfo(productInfo1688)
					uni.removeStorageSync('productInfo1688')
					
					// 同商家检测
					this.getsamestorewishinfo()
				}
			}
			
			// 如果是编辑或者拷贝状态则获取心愿详情
			if(this.type === 'edit' || this.type === 'copy') {
				this.id = option.id // 心愿详情id(编辑或者拷贝的原心愿id)
				this.getwishdetail()
			}
			
		},
		
		computed: {
			
			// 选中规格数量总和
			selectShowTotalAmount() {
				
				let totalAmount = 0
				if(this.specPropInfo) {
					
					this.specPropInfo.propValList.forEach((firstitem) => {
						firstitem.specStockList.forEach((seconditem) => {
							totalAmount += Number(seconditem.amount)
						})
					})
					
				}
				
				return totalAmount
				
			},
			
		},
		
		methods: {
			
			// 获取同商家心愿单信息
			getsamestorewishinfo() {
				
				return
				const db = uniCloud.database();
				// 心愿状态在待确认之前并且拥有相同的卖家id
				db.collection('wishlist')
				.where(`creatUser == '${this.user._id}' && achieveFlag < 2 && sellerInfo.sellerId == '${this.sellerInfo.sellerId}'`)
				.get()
				.then(response => {
					
					if(response.result.code == 0) {
						let datalist = response.result.data
						
						// this.samestorewishlist = datalist
						// this.modalTitle = ''
						// this.modalContent = `还有这些心愿来自同一个商店, 是否进行关联?关联后心愿单将进行合并。`
						// this.showModal = true
						
					}
					else {
						uni.showToast({
							title: response.result.message,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 获取心愿详情
			getwishdetail() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用opendb获取详情数据
				const db = uniCloud.database();
				let wherestr = ` _id == '${_this.id}' `
				db.collection('wishlist,uni-id-users')
				.where(wherestr)
				.field('creatUser{nickname,avatar,unitCommissionFee},_id,achieveFlag,productTitle,aliasName,hurryLevel,imgs,targetAmount,targetPrice,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,remark,creatTime,optionTime,productExt,specPropInfo,thirdPidType,thirdPid,sellerInfo,warehouse')
				.get({
					getOne:true
				})
				.then(res => {
					if(res.result.code == 0) {
						// 获取数据成功
						let info = res.result.data
						
						this.productTitle = info.productTitle // 商品标题
						this.aliasName = info.aliasName // 商品别名
						this.sourceLink = info.sourceLink // 源网站链接
						// 解析商品链接
						this.analysisUrl()
						this.sourcePrice = info.sourcePrice // 源网站价格
						this.sourceMoneyType = info.sourceMoneyType // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
						this.targetPrice = info.targetPrice // 目标价格
						this.targetMoneyType = info.targetMoneyType // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
						this.unitCommissionFee = info.creatUser[0].unitCommissionFee
						this.hurryLevel = info.hurryLevel // 紧急程度 默认为2级 int 类型
						this.remark = info.remark // 备注信息
						let imgsArr = info.imgs.split(',') // 商品图片
						this.imgArr = imgsArr.map(item => ({url: item}))
						
						this.thirdPidType = info.thirdPidType
						this.thirdPid = info.thirdPid
						
						this.productExt = info.productExt
						this.specPropInfo = info.specPropInfo
						this.sellerInfo = info.sellerInfo
						
						// 获取仓库信息
						let warehouse = info.warehouse
						let selectwarehouseinfo = {}
						
						if(warehouse) {
							console.log(warehouse);
							console.log(this.warehouseselectlist);
							// 根据warehouse的值进行遍历找到对应的选中项
							this.warehouseselectlist.forEach(companyitem => {
								if(companyitem.value == warehouse.company) {
									selectwarehouseinfo.company = {
										label: companyitem.label,
										value: companyitem.value
									}
									
									companyitem.children.forEach(cityitem => {
										if(cityitem.value == warehouse.city) {
											selectwarehouseinfo.city = {
												label: cityitem.label,
												value: cityitem.value
											}
											
											cityitem.children.forEach(shippingwayitem => {
												if(shippingwayitem.value == warehouse.shippingWay) {
													selectwarehouseinfo.shippingway = {
														label: shippingwayitem.label,
														value: shippingwayitem.value
													}
													
													selectwarehouseinfo.price = {
														label: 'price',
														value: shippingwayitem.extra
													}
												}
											})
										}
									})
								}
							})
							
							if(selectwarehouseinfo && selectwarehouseinfo.company && selectwarehouseinfo.city && selectwarehouseinfo.shippingway && selectwarehouseinfo.price) {
								this.selectwarehouseinfo = selectwarehouseinfo
							}
							
							this.shippingCode = warehouse.shippingCode
						}
						
						// 同商家检测
						this.getsamestorewishinfo()
						
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
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
			},
			
			// 解析1688商品数据
			set1688productInfo(productInfo1688) {
				
				_this.ifloading = true
				
				_this.productInfo1688 = productInfo1688
				_this.sourceLink = productInfo1688.sourceLink
				_this.analysisUrl() // 解析链接
				_this.sellerInfo = productInfo1688.sellerInfo
				_this.productTitle = productInfo1688.title
				_this.sourcePrice = productInfo1688.priceRange
				let imgsArr = productInfo1688.imgs.split(',') // 商品图片
				_this.imgArr = imgsArr.map(item => ({url: item}))
				_this.specPropInfo = productInfo1688.specPropInfo // 心愿单规格数据
				_this.thirdPidType = 'pro-1688' // 默认第三方商品类型为1688
				_this.thirdPid = productInfo1688.thirdPid // 第三方商品pid
				
				_this.$nextTick(function(){
					_this.ifloading = false
				})
				
			},
			
			// 设置紧急程度数组
			setHurryLevelArr() {
				
				let hurrylevelDataArr = [
					{
						level: 1,
						name: this.i18n.wishlist.common.hurryleveldata.level1
					},
					{
						level: 2,
						name: this.i18n.wishlist.common.hurryleveldata.level2
					},
					{
						level: 3,
						name: this.i18n.wishlist.common.hurryleveldata.level3
					},
					{
						level: 4,
						name: this.i18n.wishlist.common.hurryleveldata.level4
					},
					{
						level: 5,
						name: this.i18n.wishlist.common.hurryleveldata.level5
					}
				]
				
				this.hurrylevelDataArr = hurrylevelDataArr
				
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
				// 匹配口令内容
				let patt = new RegExp(`(￥\\S+￥)\\S+(https?:\\S+)`)
				let resultArr = patt.exec(content)
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
			
			// 获取收货仓库数据
			getwarehousedatalist() {
				
				let list = [
					{
						value: 'aat',
						label: 'AAT',
						children: [
							{
								value: 'any',
								label: '任意/AnyCity',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3300/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							},
							{
								value: 'gz',
								label: '广州/GuangZhou',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3300/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							},
							{
								value: 'yw',
								label: '义乌/YiWu',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3300/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							}
						]
					},
					{
						value: 'tlm',
						label: 'TLM',
						children: [
							{
								value: 'any',
								label: '任意/AnyCity',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3650/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5700/m³'
									}
								]
							},
							{
								value: 'gz',
								label: '广州/GuangZhou',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3650/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5700/m³'
									}
								]
							},
							{
								value: 'yw',
								label: '义乌/YiWu',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3650/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5700/m³'
									}
								]
							}
						]
					},
					{
						value: 'cargo',
						label: 'Cargo',
						children: [
							{
								value: 'any',
								label: '任意/AnyCity',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3500/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							},
							{
								value: 'gz',
								label: '广州/GuangZhou',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3500/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							},
							{
								value: 'yw',
								label: '义乌/YiWu',
								children: [
									{
										value: 'sea',
										label: '海运/Sea',
										extra: '฿3500/kg'
									},
									{
										value: 'car',
										label: '陆运/Car',
										extra: '฿5500/m³'
									}
								]
							}
						]
					}
				]
				
				this.warehouseselectlist = list
				
				// 加载个人仓库代码集合
				if(this.user && this.user._id == '61081eaecd84d6000127f027') {
					let merchantshippingcodelist = [
						'AAT/0046/SEA',
						'BL-SMARII(M)',
						'TLM-5369sea'
					]
					
					this.merchantcodeshipcodelist = merchantshippingcodelist
				}
				
			},
			
			// 选择收货仓库
			confirmselect(e) {
				this.selectwarehouseinfo = {
					company: {
						label: e[0].label,
						value: e[0].value
					},
					city: {
						label: e[1].label,
						value: e[1].value
					},
					shippingway: {
						label: e[2].label,
						value: e[2].value
					},
					price: {
						label: 'price',
						value: e[2].extra
					},
				}
				console.log(this.selectwarehouseinfo);
			},
			
			// 输入仓库代码
			typeshippingcode(e) {
				let shippingCode = e.detail.value
				this.shippingCode = shippingCode
				// 根据输入的内容进行搜索
				this.$u.debounce(this.searchshippingcode, 500)
			},
			
			// 输入仓库代码聚焦
			typeshippingcodefocus() {
				this.ifshowcodetip = true
				this.searchshippingcode() // 手动调用一次搜索方法
			},
			
			// 输入仓库代码失去焦点后
			typeshippingcodeblur() {
				// 加个延时 否则数据点击事件不生效
				setTimeout(function() {
					_this.ifshowcodetip = false
				}, 100);
			},
			
			// 搜索仓库代码结果
			searchshippingcode() {
				let typeshippingcode = this.shippingCode
				
				// 从该供应商的仓库代码中选择匹配的仓库代码
				if(this.merchantcodeshipcodelist) {
					let codelistsearchresult = this.merchantcodeshipcodelist.filter((item) => {
						return item.indexOf(typeshippingcode) > -1
					})
					
					this.codelistsearchresult = codelistsearchresult
				}
				
			},
			
			// 输入价格
			typesourcePrice(e) {
				let sourcePrice = e.detail.value
				this.sourcePrice = sourcePrice
				this.targetMoneyType = this.sourceMoneyType
			},
			
			// 紧急程度更改
			hurrylevelchange(e) {
				this.hurryLevel = Number(e.detail.value) + 1
			},
			
			// 选择图片成功
			fileselect(e) {
				this.imgArr.push.apply(this.imgArr, e.tempFiles)
				// this.imgArr =  this.imgArr.concat(e.tempFiles)
				console.log(`选择图片成功`);
			},
			
			// 图片删除
			filedelete(e) {
				let deleteIndex = this.imgArr.findIndex(item => {
					return e.tempFilePath == item.path
				})
				if(deleteIndex > -1) {
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
			
			// 获取当前选中规格的大类型数量
			getBigTypeAmount() {
				
				let bigTypeAmount = 0
				
				if(!this.specPropInfo) {
					return bigTypeAmount
				}
				
				let firstList =  this.specPropInfo.propValList
				
				firstList.forEach(firstitem => {
					let secondTotalAmount = 0
					
					// 遍历二级属性
					firstitem.specStockList.forEach(seconditem => {
						
						if(seconditem.amount) {
							secondTotalAmount += Number(seconditem.amount)
						}
						
					})
					
					// 如果该一级分类下的选中数量大于0则将大类型数量增加1
					if(secondTotalAmount > 0) {
						bigTypeAmount += 1
					}
					
				})
				
				console.log(`当前获取的选中大类型数量为${bigTypeAmount}`);
				
				return bigTypeAmount
				
			},
			
			// 上传数据
			uploaddata() {
				
				// 进行数据检查	
						
				// 检查是否有商品标题
				if(!this.productTitle) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.title,
						icon: 'none'
					});
					return false
				}
				// 检查是否有源价格
				else if(!this.sourcePrice) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.price,
						icon: 'none'
					});
					return false
				}
				// 检查是否有选择的数量
				else if(!this.selectShowTotalAmount && !this.targetAmount) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.amount,
						icon: 'none'
					});
					return false
				}
				// 检查是否有选择的仓库
				else if(!this.selectwarehouseinfo) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.warehouse,
						icon: 'none'
					});
					return false
				}
				// 检查是否有唛头
				else if(!this.shippingCode) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.shippingcode,
						icon: 'none'
					});
					return false
				}
				// 检查是否有图片
				else if(this.imgArr.length == 0) {
					uni.showToast({
						title: this.i18n.placeholder.handlewish.image,
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
				
				// 计算当前用户的服务费单价(默认为服务费单价 * 大类型数量)
				let unitCommissionFee = this.unitCommissionFee
				let bigTypeAmount = this.getBigTypeAmount() || 1
				let commissionFee = parseFloat(parseFloat(unitCommissionFee) * parseInt(bigTypeAmount)).toFixed(2)
				
				// 商品拓展字段
				let productExt = {
					secretCode: this.productSecretCode,// 商品口令
					pureUrl: this.productPureUrl, // 商品纯链接
					commissionFee: commissionFee, // 该心愿单的初始化服务费
				}
				let uploadProductExt = {...this.producExt, ...productExt}
				
				// 上传图片成功 开始上传所有数据
				let info = {
					productTitle: _this.productTitle, // 商品标题
					aliasName: _this.aliasName, // 商品别名
					warehouse: {
						company: _this.selectwarehouseinfo.company.value,
						city: _this.selectwarehouseinfo.city.value,
						shippingWay: _this.selectwarehouseinfo.shippingway.value,
						price: _this.selectwarehouseinfo.price.value,
						shippingCode: _this.shippingCode
					},
					sourceLink: _this.sourceLink, // 源网站链接
					sellerInfo: _this.sellerInfo, // 商品卖家信息
					sourcePrice: _this.sourcePrice, // 源网站价格
					sourceMoneyType: _this.sourceMoneyType, // 源网站价格币种 默认为RMB  RMB人民币 THB泰铢
					targetPrice: _this.targetPrice, // 目标价格
					targetMoneyType: _this.targetMoneyType, // 目标价格币种 默认为RMB  RMB人民币 THB泰铢
					targetAmount: _this.selectShowTotalAmount || _this.targetAmount, // 选购数量
					specPropInfo: _this.specPropInfo, // 规格对象
					productExt: uploadProductExt, // 商品的拓展字段
					hurryLevel: _this.hurryLevel, // 紧急程度  int 类型
					remark: _this.remark, // 备注信息
					imgs: imgs, // 图片字符串集合
					thirdPidType: _this.thirdPidType, // 第三方商品类型
					thirdPid: _this.thirdPid, // 第三方商品pid
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
						db.collection('wishlisttimeline').add(timelineinfo)
						
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
						// 增加一个编辑的时间轴
						let timelineinfo = {
							type: 2,
							wishId: _this.id,
						}
						db.collection('wishlisttimeline').add(timelineinfo).then(response => {
							// 新增编辑时间轴成功
							
							// 更新成功
							uni.$emit('updatewishdetail')
							uni.$emit('updatewishlist')
							// 更新事件轴数据
							uni.$emit('updatetimeline')
							
							let modalTitle = _this.i18n.tip.fixsuccess
							_this.checksubscribe(modalTitle) // 更新成功后检查订阅消息
							
						}).catch(err => {
							console.log(`新增编辑时间轴失败,原因为${err.message}`);
							uni.showToast({
								title: _this.i18n.error.fixerror,
								icon: 'none'
							});
						})
						
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
					duration: 1000
				});
				setTimeout(function() {
					uni.navigateBack();
				}, 1000);
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
				let agentbindwishId = this.$store.getters.configData.wxminiNoticeTemplateDic.agentbindwish
				let confirmquotationId = this.$store.getters.configData.wxminiNoticeTemplateDic.confirmquotation
				
				uni.requestSubscribeMessage({
					tmplIds: [agentbindwishId,confirmquotationId],
					success(res){
						let errMsg = res.errMsg
						console.log(errMsg);
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[agentbindwishId]);
							// 用户同意订阅
							if(res[agentbindwishId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[agentbindwishId] == 'reject') {
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
		
		/deep/.popupview{
			.u-mode-center-box{
				background-color: transparent !important;
			}
		}
	}
</style>
