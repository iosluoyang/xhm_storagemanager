<template>
	<view class="pagecontent wishdetailview">
		
		<!-- 导航栏 -->
		<cu-custom :bgColor=" wishinfo ? wishbgcolor : 'bg-white' " isBack isOwnBackPage @ownbackpage="ownBackPage">
			<block slot="content">{{i18n.nav.wishdetail}}</block>
		</cu-custom>
		
		<!-- 商品信息区域 -->
		<view v-if="wishinfo" class="wishinfoview">
			
			<!-- 详情区域 -->
			<view class="detailview cu-card">
				
				<!-- 基本信息区域 -->
				<view class="cu-item shadow-warp bg-white">
					
					<!-- 图片区域 -->
					<view class="picview pos-relative">
						
						<!-- 状态标签 -->
						<view class="cu-tag pos-absolute radius" style="right: 0;top: 0;z-index: 10;" :class="wishbgcolor">{{ wishtagtext }}</view>
						
						<!-- 轮播图 -->
						<swiper class="screen-swiper round-dot radius" indicator-dots circular
						 :autoplay="swiperautoplay" :duration="500" :interval="3000" :current="swiperCur" @change="changeSwiper" indicator-color="#8799a3"
						 indicator-active-color="#0081ff">
							<swiper-item v-for="(img,index) in wishinfo.imgs.split(',')" :key="index" :class="swiperCur==index?'cur':''" @tap.stop="previewImgs(wishinfo.imgs, index)">
								<image :src="img" mode="aspectFill"></image>
							</swiper-item>
						</swiper>
						
					</view>
					
					<!-- 创建者信息及留言 -->
					<view class="headerview flex align-center justify-between padding-sm">
						
						<view class="publisherandremarkview flex align-center width100">
							
							<!-- 头像 -->
							<view class="avatarview flex align-center" style="flex-shrink: 0;">
								<image v-if="wishinfo.creatUser && wishinfo.creatUser.avatar" class="cu-avatar round" :src="wishinfo.creatUser.avatar"></image>
								<view v-else class="cu-avatar round sm">
									<text class="cuIcon-people"></text>
								</view>
							</view>
							
							<!-- 右侧区域 -->
							<template>
							
								<!-- 显示备注 -->
								<view v-if="wishinfo.remark" class="margin-left bg-grey round text-sm padding-left padding-right padding-top-sm padding-bottom-sm" @longpress="$basejs.copytoclipboard(wishinfo.remark)">{{ wishinfo.remark }}</view>
								
								<!-- 没有备注时显示昵称和时间 -->
								<view v-else class="publishcontent flex-sub margin-left">
									<view>{{wishinfo.creatUser.nickname || 'XXX'}}</view>
									<view class="text-gray text-sm flex justify-between">
										<uni-dateformat :date="wishinfo.creatTime" />
									</view>
								</view>
								
							</template>
							
						</view>
						
					</view>
					
					<!-- 商品标题和价格区域 -->
					<view class="text-content padding-left-sm padding-right-sm padding-bottom-sm">
						
						<view class="text-bold text-xl">
							
							<!-- 紧急程度 -->
							<!-- <text class="hurryleveltext margin-right-sm">
								<text v-for="item in wishinfo.hurryLevel" :key="item" class="cuIcon cuIcon-lightfill text-red"></text>
							</text> -->
							
							<!-- 商品标题 -->
							<text class="protitle">{{ `${wishinfo.productTitle}`}}</text>
							<view v-if="wishinfo.aliasName" class="margin-left cu-tag radius bg-pink">
								{{ wishinfo.aliasName }}
							</view>
			
						</view>
						
						<!-- 商品价格和数量 -->
						<view class="priceandamountview margin-top-sm flex align-center justify-between">
							
							<view class="priceview">
								<text class="text-red text-xl margin-right">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
								<!-- <text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text> -->
							</view>

							<view class="cu-tag radius bg-cyan">
								{{ i18n.wishlist.common.amount }}:
								{{ wishinfo.targetAmount }}
							</view>
							
						</view>
						
					</view>
					
					<!-- 操作区域 -->
					<view class="btnsview flex align-center padding-sm" :style="{overFlow: 'auto'}">
						
						<!-- 分享按钮 小程序平台有 -->
						<!-- #ifdef MP -->
						<button class="cu-btn round bg-orange cuIcon-share margin-right-sm" open-type="share"></button>
						<!-- #endif -->
						
						<!-- 再次购买按钮 -->
						<button v-if="user && (user.role == 'MERCHANT_ADMIN' || user.role == 'MERCHANT_EMPLOYEE')" class="cu-btn round bg-pink cuIcon-add margin-right-sm" @tap.stop="buyagain"></button>
						
						<!-- 编辑按钮 仅自己可编辑 且在该心愿单为进行中时显示 -->
						<button v-if="wishinfo.achieveFlag == 0 && wishinfo.creatUser && wishinfo.creatUser._id == user._id" class="cu-btn round bg-gray cuIcon-edit margin-right-sm" @tap.stop="editwish"></button>
						
						<!-- 删除按钮 仅自己可删除 且在该心愿单为进行中和待确认时显示 -->
						<button v-if="(wishinfo.achieveFlag == 0 || wishinfo.achieveFlag == 1) && wishinfo.creatUser && wishinfo.creatUser._id == user._id" class="cu-btn round bg-red cuIcon-delete margin-right-sm" @tap.stop="deletewish"></button>
						
						<!-- 计算国际运费按钮 -->
						<button v-if="productExt && productExt.boxVolume" class="cu-btn round bg-gradual-blue cuIcon-form margin-right-sm" @tap.stop="openshippingtool"></button>
						
						<!-- 查看1688详情按钮 -->
						<button class="cu-btn round bg-gradual-orange cuIcon-goods margin-right-sm" @tap.stop="check1688prodetail"></button>
						
						<!-- 复制源网站链接按钮 非H5平台且有源网站链接时出现-->
						<button v-if="wishinfo.sourceLink" class="cu-btn round bg-gradual-green cuIcon-link margin-right-sm" @tap.stop=" popuptype = 'wishlink'; popmode='bottom'; showpopup=true; "></button>
						
					</view>
					
				</view>
			
			</view>
			
			<!-- 其他信息区域-->
			<view class="detaildataview margin">
				
				<!-- 订购规格table -->
				<view v-if="wishinfo && wishinfo.specPropInfo" class="wishspectable">
					<wishTableSpec ref="wishtablespec" v-if="wishinfo" :wishinfo="wishinfo" sourcefrom="wishdetail" ></wishTableSpec>
				</view>
				
			</view>
			
		</view>
		
		<!-- 时间轴 -->
		<view v-if="wishinfo && timelinearrdic && Object.keys(timelinearrdic).length > 0 " class="timelineview solid-top">
			
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.timeline.title }}</text>
				</view>
			</view>
			
			<view class="cu-timeline" v-for="(timelinearr, timelinekey) in timelinearrdic" :key="timelinekey">
				
				<uni-dateformat class="cu-time" :date="timelinekey" format="MM/dd" />
				
				<wishTimeLineItem class="cu-item" v-for="(timelineitem, timelineindex) in timelinearr" :key="timelineitem._id" :timelineInfo="timelineitem" :wishInfo="wishinfo" @sharetimeline="sharetimeline"></wishTimeLineItem>
				
			</view>
			
		</view>
		
		<!-- 悬浮按钮区域 -->
		<view v-if="wishinfo && user" class="floatview">
			
			<!-- 如果是代理员 且该心愿为进行中 待确认时显示 -->
			<template v-if=" user.role == 'PRODUCT_AGENT' ">
				
				<!-- 没有被关联时显示关联按钮 -->
				<button v-if="wishinfo.agentFlag == 0" class="eachbtn cu-btn bg-gradual-blue shadow-blur cuIcon" @tap.stop="agentBindWish">
					<text class="cuIcon-servicefill"></text>
				</button>
				
				<!-- 被关联时根据是否是自己关联的心愿来显示添加按钮 -->
				<button v-else-if="wishinfo.agentUser && wishinfo.agentUser._id == user._id && (wishinfo.achieveFlag == 0 || wishinfo.achieveFlag == 1)" class="eachbtn cu-btn bg-gradual-purple shadow-blur cuIcon" @tap.stop="updatewishtimeline">
					<text class="cuIcon-add"></text>
				</button>
				
			</template>
			
			<!-- 如果是供应商  当为本人心愿且该心愿为进行中时显示-->
			<template v-else-if="(user.role == 'MERCHANT_ADMIN' || user.role == 'MERCHANT_EMPLOYEE') && user._id == wishinfo.creatUser._id && wishinfo.achieveFlag == 0">
				
				<button class="eachbtn cu-btn bg-gradual-purple shadow-blur cuIcon" @tap.stop="updatewishtimeline">
					<text class="cuIcon-add"></text>
				</button>
				
			</template>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 弹出视图 -->
		<u-popup v-model="showpopup" :mode="popmode" width="80%" border-radius="16" :mask-close-able=" popuptype !== 'share' ">
			
			<!-- 链接展示 -->
			<template v-if="popuptype == 'wishlink' && productExt">
				<view class="cu-list menu text-left">
					
					<!-- 口令 -->
					<view class="cu-item">
						<view class="content padding-tb-sm" style="max-width: 70%;">
							<view>
								<text class="cuIcon-explorefill text-blue margin-right-xs"></text>
								{{ productExt.secretCode || '' }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.common.secretcodetip }}
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
								{{ productExt.pureUrl || '' }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.common.pureurltip }}
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
			</template>
			
			<!-- 运费计算工具 -->
			<template v-if="popuptype === 'shippingtool' && productExt">
				
				<view class="shippingcontentview padding-top padding-bottom">
					
					<view class="titleview text-bold text-xl text-center margin-bottom">
						{{ i18n.wishlist.wishdetail.internationalshippingcalculator }}
					</view>
					
					<!-- 预估国际运费总价 -->
					<view class="cu-form-group padding-top padding-bottom">
						<view class="title" :style="{'flex-shrink': '0'}">{{ i18n.wishlist.wishdetail.approximatefee }}</view>
						<view class="rightcontent">
							<text class="text-sm text-red text-wrap">{{ interShippingTotalFeeStr }}</text>
						</view>
					</view>
					
					<!-- 国际运费单价 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.internationalshippingunitfee }}</view>
						<input class="text-right" type="number" :placeholder="i18n.placeholder.wishdetail.typeinternationshippingfee" :focus="showpopup && popuptype == 'shippingtool' " :cursor-spacing="100" v-model="interShippingSingleFeeStr">
					</view>
					
					<!-- 单件体积 -->
					<view v-if="productExt.boxVolume" class="cu-form-group">
						<view class="title">{{ `${i18n.wishlist.common.boxvolume}(m³)` }}</view>
						<input class="text-right" type="number" disabled v-model="productExt.boxVolume">
					</view>
					
					<!-- 单件重量 -->
					<view v-if="productExt.boxWeight" class="cu-form-group">
						<view class="title">{{ `${i18n.wishlist.common.boxweight}(kg)` }}</view>
						<input class="text-right" type="number" disabled v-model="productExt.boxWeight">
					</view>
					
					<!-- 箱子数量 -->
					<view class="cu-form-group">
						<view class="title">{{ i18n.wishlist.common.boxamount }}</view>
						<u-number-box :min="1" v-model="boxAmount"></u-number-box>
					</view>
					
				</view>
				
			</template>
			
			<!-- 中间输入内容 -->
			<template v-if="popuptype === 'share'">
				
				<view class="cu-dialog">
					
					<view class="cu-bar bg-white">
						<view class="content">{{ i18n.base.share }}</view>
					</view>
					<view class="padding-sm text-left">
						<textarea auto-height disable-default-padding :focus="showpopup" :show-confirm-bar="false" :maxlength="-1" :cursor-spacing="100" :placeholder="i18n.base.setshareparam" v-model="sharecontent"></textarea>
					</view>
					<view class="cu-bar bg-white flex justify-around">
						<button class="cu-btn round bg-gray text-grey" @tap.stop="modalcancel">{{i18n.base.cancel}}</button>
						<button open-type="share" class="cu-btn round bg-gradual-orange">{{i18n.base.confirm}}</button>
					</view>
				
				</view>
				
			</template>
			
		</u-popup>
				
	</view>
</template>

<script>
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	import wishTimeLineItem from '@/components/wishtimelineitem/wishtimelineitem.vue'; // 单个时间轴组件
	
	
	var _this
	
	export default {
		data() {
			return {
				
				id: null, // 当前心愿详情id
				ifShare: false, // 是否是分享来源
				wishinfo: null, // 当前心愿详情
				productExt: null, // 心愿拓展字段
				productInfo1688: null, // 附属的1688商品数据
				timelinearrdic: {}, // 心愿时间轴数据
				
				swiperCur: 0, // 当前轮播图索引
				swiperautoplay: false, // 轮播图是否自动播放  默认为否
				imgsArr: [], // 轮播图的图片数组索引
				
				collapseOpen: false, // 是否展开规格订购信息  默认不展开
				extArr: [], // 拓展信息展示数组
				
				interShippingSingleFeeStr: '', // 国际运费单价
				boxAmount: 1, // 计算运费的箱子数量
				
				temptimelineitem: null, // 临时时间轴变量
				refuseReason: '', // 拒绝原因
				sharecontent: '', // 分享内容文本
				
				fabContentArr: [], // 悬浮按钮展开菜单
				
				popuptype: 'wishlink' , //模态框的类型  shippingtool为运费工具  wishlink为心愿链接展示  inputarea为输入内容类型  默认为心愿链接展示
				popmode: 'bottom', // 模态框的方向类型  默认为bottom
				showpopup: false, // 是否显示模态框
				
				ifshowmodal: false, // 是否显示模态框
				ifloading: false, // 是否加载(仅用于加载时间轴)
				
				showSelector: false, // 是否显示多规格选择器
				
			};
		},
		
		components: {
			wishTableSpec,
			wishTimeLineItem,
		},
		
		computed: {
			
			// 心愿单的背景颜色  根据不同的状态返回不同的颜色
			wishbgcolor() {
				if(this.wishinfo) {
					
					let achieveFlag = this.wishinfo.achieveFlag
					let bgColor = this.$basejs.getwishtagbgcolorclassname(achieveFlag)
					return bgColor
				}
				else {
					return ''
				}
			},
			
			// 心愿单的tag名称
			wishtagtext() {
				
				if(this.wishinfo) {
					let achieveFlag = this.wishinfo.achieveFlag
					let tagName = this.$basejs.getwishtagname(achieveFlag)
					return tagName
				}
				else {
					return ''
				}
				
			},
			
			// 国际运费总价
			interShippingTotalFeeStr() {
				
				// 如果是体积和单价存在的情况下则正常返回 否则返回计算中
				if(this.productExt && this.productExt.boxVolume && this.interShippingSingleFeeStr) {
					let interShippingTotalFee = parseFloat(parseFloat(this.productExt.boxVolume) * parseFloat(this.boxAmount) * parseFloat(this.interShippingSingleFeeStr)).toFixed(2)
					let interShippingTotalFeeStr = `${this.productExt.boxVolume}m³ * ${this.boxAmount} * ${this.interShippingSingleFeeStr} /m³ ≈ ${interShippingTotalFee}`
					return interShippingTotalFeeStr
				}
				else {
					return this.i18n.wishlist.wishdetail.calculatorresulttip
				}
			},
			
		},
		
		onLoad(option) {
			_this = this
			
			let id = option.id
			this.id = id
			
			// 判断是否是分享的内容
			let ifShare = option.ifShare == 'true'
			this.ifShare = ifShare
			
			if(this.id) {
				// 开始加载心愿详情数据
				this.loaddetaildata()
				
				// 加载心愿时间轴数据
				this.loadtimelinedata()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				})
			}
			
			uni.$on('updatewishdetail', function() {
				_this.loaddetaildata()
			})
			
			uni.$on('updatetimeline', function() {
				// 仅更新时间轴
				_this.loadtimelinedata()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
			uni.$off('updatetimeline')
		},
		
		// 页面显示时开始自动播放轮播图
		onShow() {
			// 如果没有登录则跳转登录页
			if(!_this.user) {
				uni.navigateTo({
					url: '/pages/base/login'
				});
			}
			this.swiperautoplay = true
		},
		
		// 页面隐藏时关闭自动播放轮播图
		onHide() {
			this.swiperautoplay = false
		},
		
		onShareAppMessage(res) {
			
			console.log(`当前页面的分享来源为:${res.from === 'button' ? '页面内分享按钮' : '右上角分享按钮' }`);
			
			// 当前要分享出去的时间轴数据
			let sharetimelineitem = this.temptimelineitem
			// 设置分享的内容
			let title = this.sharecontent ? this.sharecontent : `${this.wishinfo.productTitle}`
			let path = sharetimelineitem ? `/pages/wishlist/wishdetail?id=${this.wishinfo._id}&timelineId=${sharetimelineitem._id}&ifShare=true` : `/pages/wishlist/wishdetail?id=${this.wishinfo._id}&ifShare=true`
			let imageUrl = sharetimelineitem && sharetimelineitem.imgs && sharetimelineitem.imgs.length > 0 ? sharetimelineitem.imgs.split(',')[0] : this.wishinfo.imgs.split(',')[0]
			let shareobj = {
				title: title,
				path: path,
				imageUrl: imageUrl
			}
			
			this.ifshowmodal = false
			this.temptimelineitem = null
			this.sharecontent = ''
			
			return shareobj
		},
		
		methods: {
			
			// 返回事件
			ownBackPage() {
				if(this.ifShare) {
					uni.reLaunch({
						url: '/pages/home/index'
					})
				}
				else {
					uni.navigateBack({
						delta: 1
					});
				}
			},
			
			// 获取心愿详情
			loaddetaildata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wishlist,uni-id-users')
					.doc(_this.id)
					.field('creatUser{nickname,avatar},agentUser{avatar,nickname},agentFlag,productTitle,aliasName,imgs,targetPrice,targetAmount,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,achieveFlag,hurryLevel,remark,creatTime,productExt,specPropInfo,thirdPidType,thirdPid,wishOrderId')
					.get({
						getOne:true
					})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							_this.wishinfo = detaildata
							
							// 解析心愿商品拓展字段
							let productExt = detaildata.productExt
							_this.productExt = productExt
							
							// 设置悬浮按钮的展示内容
							// _this.setFabContentArr()
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			// 开启运费小工具
			openshippingtool() {
				let productExt = this.wishinfo.productExt
				if(productExt && productExt.boxVolume) {
					this.popuptype = 'shippingtool'
					this.showpopup = true
					this.popmode = 'center'
				}
				else {
					uni.showToast({
						title: '暂未获取体积信息',
						icon: 'none'
					});
				}
			},
			
			// 计算货物体积
			calculatevalume() {
				// 如果商品的长宽高没有填完则提示用户 否则进行计算
				if(this.productExt && this.productExt.boxLength && this.productExt.boxWidth && this.productExt.boxHeight) {
					let boxVolume = parseFloat(parseFloat(this.productExt.boxLength/100) * parseFloat(this.productExt.boxWidth/100) * parseFloat(this.productExt.boxHeight/100)).toFixed(4)
					this.$set(this.productExt, 'boxVolume', boxVolume)
				}
				else {
					this.$set(this.productExt, 'boxVolume', '')
				}
			},
			
			// 设置悬浮按钮的内容
			setFabContentArr() {
				
				let content = [
					{
						iconPath: '',
						selectedIconPath: '',
						text: '发言',
						active: false,
					},
					{
						iconPath: '',
						selectedIconPath: '',
						text: '更新心愿',
						active: false,
					}
				]
				return content
				
			},
			
			// 加载心愿时间轴数据
			loadtimelinedata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取心愿单对应的时间轴数据
				let wherestr = `wishId == '${_this.id}' `
				const db = uniCloud.database();
				db.collection('wishlisttimeline,uni-id-users')
				.where(wherestr)
				.field('creatUser{avatar,nickname},editUser{avatar,nickname},optionUser{avatar,nickname},content,imgs,price,type,wishId,creatTime,editTime,optionTime')
				.orderBy('creatTime desc')
				.get()
				.then(res => {
					_this.ifloading = false
					// 获取成功
					if(res.result.code == 0) {
						console.log(`时间轴数据获取成功`);
						console.log(res.result.data);
						let timelinelist = res.result.data || []
						
						// 遍历时间轴数据将creatUser和editUser和refuseUser和agreeUser均转换为对象
						timelinelist.forEach(item => {
							if(item.creatUser) {
								item.creatUser = item.creatUser[0] ? item.creatUser[0] : null
							}
							if(item.editUser) {
								item.editUser = item.editUser[0] ? item.editUser[0] : null
							}
							if(item.optionUser) {
								item.optionUser = item.optionUser[0] ? item.optionUser[0] : null
							}
						})
						
						console.log(timelinelist);
						
						// 获取时间轴数据  将时间轴数据整理变更为按照日期来区分
						let newtimelinearrdic = {}
						timelinelist.forEach((timelineitem, index) => {
							let creatTime = timelineitem.creatTime
							// 获取日期
							let creatDate = _this.$moment(creatTime).format('YYYY-MM-DD')
							if(newtimelinearrdic[creatDate]) {
								let samedatearr = newtimelinearrdic[creatDate]
								samedatearr.push(timelineitem)
							}
							else {
								newtimelinearrdic[creatDate] = [timelineitem]
							}
						})
						_this.timelinearrdic = Object.assign({}, newtimelinearrdic)
						// _this.$set(_this.timelinearrdic, newtimelinearrdic)
						// _this.timelinearrdic = newtimelinearrdic
						console.log(_this.timelinearrdic);
						
					}
				})
				.catch(error => {
					_this.ifloading = false
				})
				
			},
			
			// 弹出框点击取消
			modalcancel() {
				
				this.showpopup=false;
				this.temptimelineitem = null
				this.sharecontent = ''
				
			},
			
			// 点击分享时间轴
			sharetimeline(timelineitem) {
				
				this.temptimelineitem = timelineitem // 赋值临时变量
				this.sharecontent = timelineitem.content || ''
				// 弹出输入框
				this.popmode = 'center'
				this.popuptype = 'share'
				this.showpopup = true
				
			},
			
			// 切换轮播图
			changeSwiper(e) {
				this.swiperCur = e.detail.current
			},
			
			previewImgs(imgsStr,index) {
				uni.previewImage({
					current:index,
					urls: imgsStr.split(',')
				})
			},
			
			// 更新心愿时间轴进度
			updatewishtimeline() {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${this.id}`
				});
			},
			
			// 再次购买
			buyagain() {
				// replace到新增心愿页面
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=copy&id=${this.wishinfo._id}`
				});
			}, 
			
			// 代理员关联心愿
			agentBindWish() {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 开始关联商品
							let wishinfo = _this.wishinfo
							const db = uniCloud.database();
							db.collection('wishlist').doc(wishinfo._id)
							.update({agentUser:db.env.uid, agentFlag: 1})
							.then(response => {
								// 关联成功
								uni.showToast({
									title: _this.i18n.tip.addsuccess,
									icon: 'none'
								});
								
								// 添加一个代理人关联心愿时间轴记录
								db.collection('wishlisttimeline')
								.add({type: 90,wishId: wishinfo._id})
								.then(response => {
									// 创建时间轴成功
									console.log(`创建关联时间轴成功`);
									// 刷新数据
									_this.loaddetaildata()
									_this.loadtimelinedata()
									// 更新列表数据
									uni.$emit('updatewishlist')
								})
								.catch(error => {
									
								})
								
								// 发送代理员关联消息通知
								_this.pushnoticemsg('agentbindwish')
								
							})
							.catch(error => {
								// 关联失败
								
							})
							
						}
					}
				});
				
			},
			
			// 编辑心愿
			editwish() {
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=edit&id=${this.id}`
				});
			},
			
			// 删除心愿
			deletewish() {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始调用openDB 删除该心愿
							const db = uniCloud.database();
							db.collection('wishlist').doc(_this.id).remove()
								.then(res => {
									// 删除成功
									// 更新列表数据
									uni.$emit('updatewishlist')
									uni.navigateBack();
									// 返回
									setTimeout(function() {
										uni.showToast({
											title: _this.i18n.tip.deletesuccess,
											icon: 'none'
										});
									}, 300);
								})
								.catch(err => {
									// 删除失败
									uni.showToast({
										title: _this.i18n.error.optionerror,
										icon: 'none'
									});
								})
							
						}
					},
				})
				
			},
			
			// 查看1688商品详情数据
			check1688prodetail() {
				
				console.log(this.wishinfo);
				let thirdPid = this.wishinfo.thirdPid
				
				// 将原链接存储在本地
				uni.setStorageSync('linkprosearchtext',this.wishinfo.sourceLink)
				uni.navigateTo({
					url: `/pages/wishlist/linkprodetail?thirdPid=${thirdPid}`
				});

			},
			
			// 编辑时间轴数据
			edittimeline(timelineitem) {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${timelineitem.wishId}&timelineId=${timelineitem._id}&type=edit`
				});
			},
			
			// 推送消息
			pushnoticemsg(msgtype) {
				
				let info
				// 根据不同的消息类型准备不同的数据内容
				if(msgtype == 'agentbindwish') {
					info = {
						msgtype: msgtype,
						wishId: _this.wishinfo._id
					}
				}
				
				uniCloud.callFunction({
					name: 'base',
					data: {
						type: 'sendwxmsg',
						info: info
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
	
	.pagecontent{
		
		padding-bottom: 120rpx;
		
		/deep/.uni-collapse-cell{
			background-color: #FFFFFF !important;
			border-bottom: none !important;
		}
		
		/deep/.tableview{
			.uni-table{
				width: 100%;
			}
		}
		
		.floatview{
			position: fixed;
			z-index: 700;
			bottom: 20rpx;
			left: 50%;
			transform: translate(-50%);
			
			.eachbtn{
				width: 100rpx;
				height: 100rpx;
				font-size: 80rpx;
			}
		}
		
	}
	
</style>
