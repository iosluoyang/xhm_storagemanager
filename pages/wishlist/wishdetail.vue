<template>
	<!-- 全屏抽屉页面样式 -->
	<view class="pagecontent wishdetailview">
		
		<!-- 主窗口 心愿详情页面 -->
		<scroll-view scroll-y class="DrawerPage" :class="{show: showDrawer}">
			
			<!-- 导航栏 -->
			<cu-custom :bgColor=" wishInfo ? wishbgcolor : 'bg-pink' ">
				<block slot="content">{{i18n.nav.wishdetail}}</block>
			</cu-custom>
			
			<template v-if="wishInfo">
				
				<!-- 商品信息区域 -->
				<view class="wishInfoview">
					
					<!-- 基本信息区域 -->
					<view class="basedataview cu-card">
						
						<!-- 基本信息区域 -->
						<view class="cu-item shadow-warp bg-white">
							
							<!-- 图片区域 -->
							<view class="picview pos-relative">
							
								<!-- 状态标签 -->
								<view class="cu-tag pos-absolute radius" style="right: 0;top: 0;z-index: 10;" :class="wishbgcolor">{{ wishtagtext }}</view>
								
								<!-- 轮播图 -->
								<u-swiper :list="swiperList" :title="true" mode="number" :autoplay="false"
										height="250" name="image" indicator-pos="topLeft" :interval="5000" 
										:current="swiperCur" :effect3d=" wishInfo.productList.length > 2 " 
										@click="clickSwiper" @change="(index) => { swiperCur = index }"
								></u-swiper>
								
							</view>
							
							<!-- 当前轮播到的商品信息 -->
							<view v-if="currentProduct" class="currentproductview padding-sm">
								
								<!-- 标题 -->
								<view class="tilteview padding-sm">
									
									<!-- 商品外链 -->
									<text v-if="currentProduct.platformLink" class="margin-right-sm cuIcon cuIcon-qr_code text-green" @click="clickShowQR"></text>
									<!-- 商品标题 -->
									<text class="protitle text-bold text-xl">{{ `${currentProduct.title}`}}</text>
									
								</view>
								
								<!-- 商品价格和数量 -->
								<view class="priceandamountview margin-top-sm flex align-center justify-between">
									
									<text class="text-price text-red text-xl margin-right">{{ currentProduct.price }}</text>
									
									<view class="margin-left flex0 flex align-center">
										<text class="cuIcon cuIcon-goods text-orange margin-right-sm"></text>
										<text class="text-grey">{{ `${getamountbyspecInfo(currentProduct.selectSpecPropInfo)}` }}</text>
									</view>
								</view>
								
								<!-- 创建者代理员及留言 -->
								<view class="creatuserview margin-top-sm flex align-center justify-between">
									
									<!-- 创建者 -->
									<view class="creatuserview flex align-center">
										
										<u-avatar class="flex0" :src="wishInfo.creatUser.avatar" size="mini"></u-avatar>
										
										<!-- 没有备注时 -->
										<view v-if="!currentProduct.remark" class="margin-left-sm flex flex-direction">
											<view>{{wishInfo.creatUser.nickname || wishInfo.creatUser.username}}</view>
											<view class="text-gray text-sm">
												<uni-dateformat :date="wishInfo.creatTime" />
											</view>
										</view>
										
										<!-- 有备注时 显示备注 -->
										<view v-if="currentProduct.remark" class="flex1 margin-left margin-right bg-grey round text-sm padding-left padding-right padding-top-sm padding-bottom-sm" @longpress="$basejs.copytoclipboard(currentProduct.remark)">{{ currentProduct.remark }}</view>
										
									</view>
									
									<!-- 右侧区域 -->
									<view class="agentuserview">
									
										<!-- 右侧代理人头像 -->
										<template v-if="wishInfo.agentUser">
											<u-avatar class="flex0" :src="wishInfo.agentUser.avatar" size="mini" show-level level-icon="kefu-ermai" level-bg-color="#0081ff"></u-avatar>
										</template>
										
									</view>
									
								</view>
								
							</view>
							
							<!-- 操作区域 -->
							<view class="btnsview flex align-center padding-sm" :style="{overFlow: 'auto'}">
								
								<!-- 分享按钮 小程序平台有 -->
								<!-- #ifdef MP -->
								<button class="cu-btn round bg-orange cuIcon-share margin-right-sm" open-type="share"></button>
								<!-- #endif -->
								
								<!-- 编辑按钮 仅商家自己可编辑 且在该心愿单为待确认前状态时显示 -->
								<button v-if="wishInfo.status < 2 && wishInfo.creatUser._id == user._id" class="cu-btn round bg-gray cuIcon-edit margin-right-sm" @tap.stop="editwish"></button>
								
								<!-- 删除按钮 仅自己可删除 且在该心愿单为进行中和待确认时显示 -->
								<button v-if="(wishInfo.achieveFlag == 0 || wishInfo.achieveFlag == 1) && wishInfo.creatUser && wishInfo.creatUser._id == user._id" class="cu-btn round bg-red cuIcon-delete margin-right-sm" @tap.stop="deletewish"></button>
								
								<!-- 计算国际运费按钮 -->
								<button v-if="productExt && productExt.boxVolume" class="cu-btn round bg-gradual-blue cuIcon-form margin-right-sm" @tap.stop="openshippingtool"></button>
								
								<!-- 再次购买按钮 -->
								<button v-if="user && (user.role == $basejs.roleEnum.merchantAdmin)" class="cu-btn round bg-pink cuIcon-add margin-right-sm" @tap.stop="buyagain"></button>
								
								<!-- 查看订单按钮 -->
								<button v-if="wishOrderInfo && user && (wishInfo.creatUser._id == user._id || wishInfo.agentUser._id == user._id) " class="cu-btn round bg-purple cuIcon-formfill margin-right-sm" @tap.stop="gotoWishOrder"></button>
								
								<!-- 查看1688详情按钮 -->
								<button class="cu-btn round bg-gradual-orange cuIcon-goods margin-right-sm" @tap.stop="check1688prodetail"></button>
								
							</view>
							
						</view>
					
					</view>
					
					<!-- 消息通知区域 -->
					<view v-if="noticeBarList" class="noticebarview margin" @tap.stop="showDrawer = true">
						<u-notice-bar mode="vertical" type="success" :duration="3000" more-icon :list="noticeBarList"></u-notice-bar>
					</view>
		
					<!-- 心愿规格table -->
					<view class="wishspecview margin padding-sm solid">
						<wishTableSpec ref="wishtablespec" :wishInfo="wishInfo"></wishTableSpec>
					</view>
					
				</view>
				
			</template>
			
			<!-- 悬浮按钮区域 -->
			<view v-if="wishInfo && user" class="floatview">
				
				<!-- 如果是代理员 -->
				<template v-if=" user.role == $basejs.roleEnum.productAgent ">
					
					<!-- 心愿没有被关联时 -->
					<template v-if="wishInfo.status == 0">
						
						<button class="eachbtn cu-btn bg-gradual-blue shadow-blur cuIcon" @tap.stop="agentBindWish">
							<text class="cuIcon-servicefill"></text>
						</button>
						
					</template>
					
					<!-- 自身代理的心愿 -->
					<template v-else=" wishInfo.agentUser && wishInfo.agentUser._id == user._id ">
						
						<!-- 显示添加按钮 -->
						<button class="eachbtn cu-btn bg-gradual-purple shadow-blur cuIcon" @tap.stop="updatewishtimeline">
							<text class="cuIcon-add"></text>
						</button>
						
					</template>
					
				</template>
				
				<!-- 如果是供应商  当为本人心愿且该心愿为进行中时显示-->
				<template v-else-if="user._id == wishInfo.creatUser._id">
					
					<!-- 心愿单进行中显示更新时间轴按钮 -->
					<button class="eachbtn cu-btn bg-gradual-purple shadow-blur cuIcon" @tap.stop="updatewishtimeline">
						<text class="cuIcon-add"></text>
					</button>
					
				</template>
				
			</view>
			
		</scroll-view>
		
		<!-- 右侧切换按钮 -->
		<view class="DrawerClose" :class="{show: showDrawer}" @tap="showDrawer = false">
			<text class="cuIcon-pullright"></text>
		</view>
		
		<!-- 抽屉区域  时间轴区域 -->
		<scroll-view scroll-y class="DrawerWindow" :class="{show: showDrawer}" style="background-color: #F1F1F1;">
			
			<view class="cu-chat">
				<view class="cu-item self">
					<view class="main">
						<view class="content bg-green shadow">
							<text>喵喵喵！喵喵喵！喵喵喵！喵喵！喵喵！！喵！喵喵喵！</text>
						</view>
					</view>
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					<view class="date">2018年3月23日 13:23</view>
				</view>
				<view class="cu-info round">对方撤回一条消息!</view>
				<view class="cu-item">
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
					<view class="main">
						<view class="content shadow">
							<text>喵喵喵！喵喵喵！</text>
						</view>
					</view>
					<view class="date "> 13:23</view>
				</view>
				<view class="cu-info">
					<text class="cuIcon-roundclosefill text-red "></text> 对方拒绝了你的消息
				</view>
				<view class="cu-info">
					对方开启了好友验证，你还不是他(她)的好友。请先发送好友验证请求，对方验证通过后，才能聊天。
					<text class="text-blue">发送好友验证</text>
				</view>
				<view class="cu-item self">
					
					<view class="main">
						<image src="https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg" class="radius" mode="widthFix"></image>
					</view>
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					<view class="date"> 13:23</view>
				</view>
				<view class="cu-item self">
					<view class="main">
						<view class="action text-bold text-grey">
							3"
						</view>
						<view class="content shadow">
							<text class="cuIcon-sound text-xxl padding-right-xl"> </text>
						</view>
					</view>
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					<view class="date">13:23</view>
				</view>
				<view class="cu-item self">
					<view class="main">
						<view class="action">
							<text class="cuIcon-locationfill text-orange text-xxl"></text>
						</view>
						<view class="content shadow">
							喵星球，喵喵市
						</view>
					</view>
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big107000.jpg);"></view>
					<view class="date">13:23</view>
				</view>
				<view class="cu-item">
					<view class="cu-avatar radius" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big143004.jpg);"></view>
					<view class="main">
						<view class="content shadow">
							@#$^&**
						</view>
						<view class="action text-grey">
							<text class="cuIcon-warnfill text-red text-xxl"></text> <text class="text-sm margin-left-sm">翻译错误</text>
						</view>
					</view>
					<view class="date">13:23</view>
				</view>
				
				<block v-for="(item, index) in timelinedataList" :key="item._id">
					
					<view class="cu-item" :class="[ item.creatUser._id == user._id ? 'self' : '' ]">
						
						<!-- 头像区域 -->
						<template v-if="false">
							
							<!-- 代理员角色 -->
							<template v-if="item.creatUser && item.creatUser.role == $basejs.roleEnum.productAgent ">
								<u-image class="cu-avatar" :src="item.creatUser.avatar" mode="square" size="60rpx" 
										show-level level-icon="kefu-ermai" level-bg-color="#0081ff"
								></u-image>
							</template>
							
							<!-- 商家角色 -->
							<template v-if="item.creatUser && item.creatUser.role == $basejs.roleEnum.merchantAdmin ">
								<u-image class="cu-avatar" :src="item.creatUser.avatar" mode="square" size="mini" 
										show-level level-icon="me-fill" level-bg-color="#f37b1d"
								></u-image>
							</template>
							
						</template>
						
						<!-- 他人头像区域 -->
						<template v-if="item.creatUser._id != user._id">
							<view class="cu-avatar radius" :style="{ backgroundImage: `url(${item.creatUser.avatar})` }"></view>
						</template>
						
						<!-- 内容 -->
						<view class="main">
							
							<!-- 心愿单开始类型 -->
							<template v-if="item.type == 0">
								<view class="content bg-pink shadow">
									<text>{{ item.content }}</text>
								</view>
							</template>
							
						</view>
						
						<!-- 本人头像区域 -->
						<template v-if="item.creatUser._id == user._id">
							<view class="cu-avatar radius" :style="{ backgroundImage: `url(${item.creatUser.avatar})` }"></view>
						</template>
						
						<!-- 时间区域 -->
						<uni-dateformat class="date" :date="item.creatTime"  format="yyyy/MM/dd hh:mm:ss" />
						
					</view>
					
				</block>
				
			</view>
			
			<view class="cu-bar foot input" :style="[{bottom:InputBottom+'px'}]">
				<view class="action">
					<text class="cuIcon-sound text-grey"></text>
				</view>
				<input class="solid-bottom" :adjust-position="false" :focus="false" maxlength="300" cursor-spacing="10"
				 @focus="(e) => {InputBottom = e.detail.height}" @blur="() => {InputBottom = 0}"></input>
				<view class="action">
					<text class="cuIcon-emojifill text-grey"></text>
				</view>
				<button class="cu-btn bg-green shadow">{{ i18n.base.confirm }}</button>
			</view>
			
		</scroll-view>
		
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
						
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow cuIcon-copy" @click="$basejs.copytoclipboard(productExt.secretCode);showpopup=false">
								<!-- <text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> -->
							</button>
						</view>
						
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
						
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow cuIcon-copy" @click="$basejs.copytoclipboard(productExt.pureUrl);showpopup=false">
								<!-- <text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> -->
							</button>
						</view>
						
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
						<button open-type="share" class="cu-btn round bg-gradual-orange" @tap="showpopup = false">{{i18n.base.confirm}}</button>
					</view>
				
				</view>
				
			</template>
			
		</u-popup>
		
		<!-- 弹出二维码组件 -->
		<alertqrcode v-if="qrCodeContent" ref="qrcodealert" :qrCodeContent="qrCodeContent" :qrcodeSize="180" :ifshow.sync="ifshowqrcode"></alertqrcode>
		
	</view>
</template>

<script>
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	import wishTimeLineItem from '@/components/wishtimelineitem/wishtimelineitem.vue'; // 单个时间轴组件
	
	
	var _this
	var paybtnanimationtimeinterval
	
	export default {
		
		data() {
			return {
				
				needtochecktoken: true, // 是否检测用户token信息
				id: null, // 当前心愿详情id
				ifShare: false, // 是否是分享来源
				wishInfo: null, // 当前心愿详情
				
				showDrawer: false, // 是否显示抽屉  默认为否
				InputBottom: 0, // 时间轴输入框底部
				
				swiperCur: 0, // 当前轮播图索引
				swiperautoplay: false, // 轮播图是否自动播放  默认为否
				swiperList: null, // 轮播图数据
				
				timelinedataList: null, // 时间轴数据
				noticeBarList: null, // 滚动消息通知数据
				
				wishOrderInfo: null, // 心愿订单数据
				paymenttimediff: 0, // 待付款订单倒计时
				productExt: null, // 心愿拓展字段
				productInfo1688: null, // 附属的1688商品数据
				timelinearrdic: {}, // 心愿时间轴数据
				timelineScrollTop: 0, // 时间轴的顶部坐标
				

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
				
				paybtnanimation: false, // 是否显示支付按钮的动画  默认为否
				
				ifshowqrcode: false, // 是否显示弹出二维码  默认否
				qrCodeContent: "", // 二维码显示内容
				
			};
		},
		
		components: {
			wishTableSpec,
			wishTimeLineItem,
		},
		
		computed: {
			
			// 心愿单的背景颜色  根据不同的状态返回不同的颜色
			wishbgcolor() {
				if(this.wishInfo) {
					
					let status = this.wishInfo.status
					let bgColor = this.$basejs.getwishtagbgcolorclassname(status)
					return bgColor
				}
				else {
					return ''
				}
			},
			
			// 心愿单的tag名称
			wishtagtext() {
				
				if(this.wishInfo) {
					let status = this.wishInfo.status
					let tagName = this.$basejs.getwishtagname(status)
					return tagName
				}
				else {
					return ''
				}
				
			},
			
			// 当前轮播的商品
			currentProduct() {
				if(this.swiperList && this.swiperList.length > 0) {
					let currentProduct = this.swiperList[this.swiperCur].currentProduct
					return currentProduct
				}
				return null
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
				this.loadTimeLineData()
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
				_this.loadTimeLineData()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
			uni.$off('updatetimeline')
			clearInterval(paybtnanimationtimeinterval) // 移除循环器
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
			clearInterval(paybtnanimationtimeinterval) // 移除循环器
		},
		
		onShareAppMessage(res) {
			
			console.log(`当前页面的分享来源为:${res.from === 'button' ? '页面内分享按钮' : '右上角分享按钮' }`);
			
			// 当前要分享出去的时间轴数据
			let sharetimelineitem = this.temptimelineitem
			// 设置分享的内容
			let title = this.sharecontent ? this.sharecontent : `${this.wishInfo.productTitle}`
			let path = sharetimelineitem ? `/pages/wishlist/wishdetail?id=${this.wishInfo._id}&timelineId=${sharetimelineitem._id}&ifShare=true` : `/pages/wishlist/wishdetail?id=${this.wishInfo._id}&ifShare=true`
			let imageUrl = sharetimelineitem && sharetimelineitem.imgs && sharetimelineitem.imgs.length > 0 ? sharetimelineitem.imgs.split(',')[0] : this.wishInfo.imgs.split(',')[0]
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
			
			// 获取心愿详情
			loaddetaildata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wish,uni-id-users')
					.doc(_this.id)
					.field('creatUid{username,nickname,avatar} as creatUser,agentUid{username,nickname,avatar} as agentUser,creatTime,updateTime,status,productList,quotationInfo')
					.get({getOne:true})
					.then(res => {
						
						_this.ifloading = false // 结束缓冲动画
						
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							detaildata.agentUser = detaildata.agentUser && detaildata.agentUser.length > 0 ? detaildata.agentUser[0] : null
							if(detaildata.productList.length > 0) {
								let sellerInfo = detaildata.productList[0].sellerInfo
								detaildata['sellerInfo'] = sellerInfo
							}
							
							// 设置轮播图数据
							let swiperList = detaildata.productList.map(eachproduct => {
								let item = {
									currentProduct: eachproduct,
									title: eachproduct.aliasName,
									image: eachproduct.imgs.split(',')[0],
								}
								return item
							})
							_this.swiperList = swiperList
							
							_this.wishInfo = detaildata
							console.log(_this.wishInfo);
							
							_this.loadTimeLineData()
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			// 加载时间轴数据
			loadTimeLineData() {
				
				// 加载时间轴数据
				const db = uniCloud.database();
				db.collection('wish-timeline, uni-id-users')
				.where(`wishId == '${_this.id}' `)
				.field(`creatUid{username,nickname,avatar,role} as creatUser, agentUid{username,nickname,avatar,role} as agentUser, type, content, imgs, link, price`)
				.orderBy(`creatTime desc`)
				.get()
				.then(response => {
					
					// 时间轴数据加载成功
					let data = response.result.data
					// 重组数据
					data.forEach(eachtimeline => {
						eachtimeline.creatUser = eachtimeline.creatUser ? eachtimeline.creatUser[0] : null
						if(eachtimeline.creatUser) {
							eachtimeline.creatUser.role = eachtimeline.creatUser.role[0]
						}
						eachtimeline.agentUser = eachtimeline.agentUser ? eachtimeline.agentUser[0] : null
						if(eachtimeline.agentUser) {
							eachtimeline.agentUser.role = eachtimeline.agentUser.role[0]
						}
						
						// 特殊处理内容
						
						// 心愿单开始
						if(eachtimeline.type == 0) {
							eachtimeline.content = _this.i18n.wishlist.timeline.startsign
						}
					}) 
					console.log(data);
					let timelinedatalist = data
					
					let noticeBarList = timelinedatalist.map(eachitem => eachitem.content)
					_this.noticeBarList = noticeBarList
					
					_this.timelinedataList = timelinedatalist
					
				})
				.catch(error => {
					console.log(`时间轴数据加载失败`);
				})
				
			},
			
			// 点击轮播图  查看该商品的主图
			clickSwiper(index) {
				let selectproduct = this.currentProduct
				uni.previewImage({
					current: 0,
					urls: selectproduct.imgs.split(',')
				})
			},
			
			// 计算某个商品的选中数量
			getamountbyspecInfo(selectSpecPropInfo) {
				if(!selectSpecPropInfo) { return 0 }
				let totalAmount = 0
				selectSpecPropInfo.propValList.forEach((firstspec, firstindex) => {
					firstspec.specStockList.forEach((secondspec, secondindex) => {
						totalAmount += secondspec.amount
					})
				})
				
				return totalAmount
			},
			
			// 点击二维码图标
			clickShowQR() {
				let qrcode = this.$basejs.getlinkbycode(this.currentProduct.platformLink).link
				if(qrcode) {
					this.qrCodeContent = qrcode
					this.ifshowqrcode = true
				}
			},
			
			// 计算付款倒计时时长
			gettimecountstamp() {
				
				let nowtimestamp = new Date().getTime()
				let ordercreattimestamp = this.wishOrderInfo.creatTime
				let wishorderpaymenttimestamp = this.$store.getters.configData.wishorderPaymentTime || 1000 * 60 * 60 * 24
				console.log(ordercreattimestamp,wishorderpaymenttimestamp,nowtimestamp)
				let timediff = (ordercreattimestamp + wishorderpaymenttimestamp - nowtimestamp)  / 1000
				this.paymenttimediff = timediff
				
				if(this.paymenttimediff <= 0) {
					this.timecountend()
				}
				
			},
			
			// 倒计时到期
			timecountend() {
				
				console.log(`倒计时结束`);
				uni.showModal({
					content: _this.i18n.wishlist.wishorder.timeupclosetip,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 将对应心愿订单删除 且将该心愿单设置为已关闭
							const db = uniCloud.database();
							db.collection('order')
							.doc(_this.wishOrderInfo._id)
							.remove()
							.then(response => {
								// 更改心愿单状态
								db.collection('wishlist')
								.doc(_this.wishInfo._id)
								.update({
									achieveFlag: 99
								})
								.then(response => {
									// 更新数据
									uni.$emit('updatetimeline')
									// 更新心愿单列表和详情
									uni.$emit('updatewishlist')
									uni.$emit('updatewishdetail')
								})
								.catch(error => {
									uni.showToast({
										title: _this.i18n.error.loaderror,
										icon: 'none'
									});
								})
							})
							.catch(error => {
								uni.showToast({
									title: _this.i18n.error.loaderror,
									icon: 'none'
								});
							})
							
						}
					}
				});
			
			},
			
			// 点击去付款
			paynow() {
				
				let orderId = this.wishOrderInfo._id
				uni.navigateTo({
					url: `/pages/wishlist/payment?orderType=wishorder&orderId=${orderId}`
				});
				
			},
			
			// 开启运费小工具
			openshippingtool() {
				let productExt = this.wishInfo.productExt
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
			
			// 点击滑动到确认报价时间轴
			gotoagreeorrefuse() {
				uni.pageScrollTo({
					scrollTop: _this.timelineScrollTop,
					duration: 300
				})
			},
			
			// 更新心愿时间轴进度
			updatewishtimeline() {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${this.id}`
				});
			},
			
			// 心愿订单详情
			gotoWishOrder() {
				let wishOrderId = this.wishOrderInfo._id
				uni.navigateTo({
					url: `/pages/wishlist/wishorder?wishOrderId=${wishOrderId}`
				});
			},
			
			// 再次购买
			buyagain() {
				// replace到新增心愿页面
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=copy&id=${this.wishInfo._id}`
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
							let wishInfo = _this.wishInfo
							const db = uniCloud.database();
							db.collection('wishlist').doc(wishInfo._id)
							.update({agentUser:db.env.uid, agentFlag: 1, optionTime: db.env.now})
							.then(response => {
								// 关联成功
								uni.showToast({
									title: _this.i18n.tip.addsuccess,
									icon: 'none'
								});
								
								// 添加一个代理人关联心愿时间轴记录
								db.collection('wishlisttimeline')
								.add({type: 90,wishId: wishInfo._id})
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
					url: `/pages/wishlist/handlewish_new?wishId=${_this.id}&type=edit`
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
				
				console.log(this.wishInfo);
				let thirdPid = this.wishInfo.thirdPid
				
				// 将原链接存储在本地
				uni.setStorageSync('linkprosearchtext',this.wishInfo.sourceLink)
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
						wishId: _this.wishInfo._id
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
	
	page{
		// background-image: var(--gradualBlue);
		width: 100vw;
		overflow: hidden;
	}
	
	.pagecontent{
		
		.wishInfoview{
			padding-bottom: 120rpx;
		}
		
		.paymentcountdownview{
			position: fixed;
			left: 0;
			right: 0;
			z-index: 99999;
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
	
	.DrawerPage {
		position: fixed;
		width: 100vw;
		height: 100vh;
		left: 0vw;
		background-color: #FFFFFF;
		transition: all 0.4s;
	}
	
	.DrawerPage.show {
		transform: scale(0.9, 0.9);
		left: 85vw;
		box-shadow: 0 0 60rpx rgba(0, 0, 0, 0.2);
		transform-origin: 0;
	}
	
	.DrawerWindow {
		position: absolute;
		width: 85vw;
		height: 100vh;
		left: 0;
		top: 0;
		transform: scale(0.9, 0.9) translateX(-100%);
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
		padding: 100rpx 0;
	}
	
	.DrawerWindow.show {
		transform: scale(1, 1) translateX(0%);
		opacity: 1;
		pointer-events: all;
	}
	
	.DrawerClose {
		position: absolute;
		width: 40vw;
		height: 100vh;
		right: 0;
		top: 0;
		color: transparent;
		padding-bottom: 30rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.01), rgba(0, 0, 0, 0.6));
		letter-spacing: 5px;
		font-size: 50rpx;
		opacity: 0;
		pointer-events: none;
		transition: all 0.4s;
	}
	
	.DrawerClose.show {
		opacity: 1;
		pointer-events: all;
		width: 15vw;
		color: #fff;
	}
	
</style>
