<template>
	<!-- 全屏抽屉页面样式 -->
	<view class="pagecontent wishdetailview">
		
		<!-- 主窗口 心愿详情页面 -->
		<scroll-view scroll-y class="DrawerPage" :class="{show: showDrawer}">
			
			<!-- 导航栏 -->
			<cu-custom :bgColor=" wishInfo ? wishbgcolor : 'bg-pink' ">
				<block slot="content">{{i18n.nav.wishdetail}}</block>
			</cu-custom>
			
			<!-- 商品信息区域 -->
			<view v-if="wishInfo" class="wishInfoview">
				
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
									<text class="text-grey">{{ `${$basejs.getProSelectSpecInfo(currentProduct.selectSpecPropInfo).selectTotalNum}` }}</text>
									<!-- 查看商品详情按钮 -->
									<button class="cu-btn round bg-gradual-orange cuIcon-goods margin-left-sm" @tap.stop="checkProductDetail(currentProduct.pid)"></button>
								</view>
								
							</view>
							
						</view>
						
						<!-- 创建者代理员及留言 -->
						<view class="creatuserview padding-sm margin-top-sm flex align-center justify-between">
							
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
						
						<!-- 操作区域 -->
						<view class="btnsview flex align-center padding-sm" :style="{overFlow: 'auto'}">
							
							<!-- 分享按钮 小程序平台有 -->
							<!-- #ifdef MP -->
							<button class="cu-btn round bg-orange cuIcon-share margin-right-sm" open-type="share"></button>
							<!-- #endif -->
							
							<!-- 编辑按钮 仅商家自己可编辑 且在该心愿单为待确认前状态时显示 -->
							<button v-if="wishInfo.status < 2 && user && wishInfo.creatUser._id == user._id" class="cu-btn round bg-gray cuIcon-edit margin-right-sm" @tap.stop="editWish"></button>
							
							<!-- 删除按钮 仅商家自己可删除 且在该心愿单为待支付前状态时显示 -->
							<button v-if="wishInfo.status < 3 && user && wishInfo.creatUser._id == user._id" class="cu-btn round bg-red cuIcon-delete margin-right-sm" @tap.stop="deleteWish"></button>
							
							<!-- 再次购买按钮 商家角色时显示 -->
							<button v-if="user && (user.role == $basejs.roleEnum.merchantAdmin)" class="cu-btn round bg-pink cuIcon-add margin-right-sm" @tap.stop="wishBuyAgain"></button>
							
							<!-- 查看订单按钮 -->
							<!-- <button v-if="wishOrderInfo && user && (wishInfo.creatUser._id == user._id || wishInfo.agentUser._id == user._id) " class="cu-btn round bg-purple cuIcon-formfill margin-right-sm" @tap.stop="gotoWishOrder"></button> -->
					
						</view>
						
					</view>
				
				</view>
				
				<!-- 消息通知区域 -->
				<view v-if="noticeBarList" class="noticebarview margin" @tap.stop="showDrawer = true">
					<u-notice-bar mode="horizontal" :speed="100" type="info" :duration="3000" more-icon padding="18rpx 24rpx" border-radius="10rpx" :list="noticeBarList"></u-notice-bar>
				</view>
					
				<!-- 心愿规格table -->
				<view class="wishspecview margin padding-sm solid">
					<wishTableSpec ref="wishtablespecref" :wishInfo="wishInfo" :ifCollapse="true"></wishTableSpec>
				</view>
				
			</view>
			
			<!-- 悬浮按钮区域 -->
			<view v-if="wishInfo && user" class="floatview">
				
				<!-- 如果是代理员 -->
				<template v-if=" user.role == $basejs.roleEnum.productAgent ">
					
					<!-- 心愿没有被关联时 -->
					<template v-if="wishInfo.status == 0">
						
						<button class="eachbtn cu-btn bg-blue shadow-blur cuIcon" @tap.stop="agentBindWish">
							<text class="cuIcon-servicefill"></text>
						</button>
						
					</template>
					
					<!-- 自身代理的心愿 -->
					<template v-else=" wishInfo.agentUser && wishInfo.agentUser._id == user._id ">
						
						<!-- 显示报价按钮 -->
						<button class="eachbtn cu-btn bg-orange shadow-blur cuIcon" @tap.stop="wishQuotation">
							<text class="cuIcon-add"></text>
						</button>
						
					</template>
					
				</template>
				
				<!-- 如果是供应商  当为本人心愿且该心愿为进行中时显示-->
				<template v-else-if="user._id == wishInfo.creatUser._id">
					
					<!-- 心愿单进行中显示更新时间轴按钮 -->
					<!-- <button class="eachbtn cu-btn bg-gradual-purple shadow-blur cuIcon" @tap.stop="updateWish">
						<text class="cuIcon-add"></text>
					</button> -->
					
					<!-- 心愿单待确认时显示拒绝和同意按钮 -->
					<view v-if="wishInfo.status == 2" class="flex align-center justify-around">
						
						<button class="eachbtn cu-btn bg-grey shadow-blur cuIcon" @tap.stop="refuseQuotation">
							<text class="cuIcon-close"></text>
						</button>
						
						<button class="margin-left eachbtn cu-btn bg-green shadow-blur cuIcon" @tap.stop="agreeQuotation">
							<text class="cuIcon-check"></text>
						</button>
						
					</view>
					
				</template>
				
			</view>
			
		</scroll-view>
		
		<!-- 右侧切换按钮 -->
		<view class="DrawerClose" :class="{show: showDrawer}" @tap="showDrawer = false">
			<text class="cuIcon-pullright"></text>
		</view>
		
		<!-- 抽屉区域  时间轴区域 -->
		<view class="DrawerWindow" :class="{show: showDrawer}" style="background-color: #F1F1F1;">
			
			<scroll-view class="cu-chat" :style="{height: 'calc(100% - 50px)'}"
					scroll-y :scroll-into-view=" `item-${timeLineScrollViewId}` " 
					enable-back-to-top scroll-with-animation
			>
				
				<template v-if="false">
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
				</template>
				<view class="cu-item"
						v-for="(item, index) in timelinedataList" :key="item._id" 
						:id=" `item-${item._id}` "
						:class="{ 'self': item.creatUser._id == user._id }"
				>
					
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
						
						<!-- 普通时间轴内容 -->
						<template v-if="item.type == 1">
							<view class="content bg-green shadow">
								<text>{{ item.content }}</text>
							</view>
						</template>
						
						<!-- 代理关联心愿单 -->
						<template v-if="item.type == 90">
							<view class="content bg-blue shadow">
								<text>{{ i18n.wishlist.timeline.wishagentbindtip }}</text>
							</view>
						</template>
						
						<!-- 心愿单编辑类型 -->
						<template v-if="item.type == 2">
							<view class="content bg-grey light shadow">
								<text class="text-black">{{ item.content }}</text>
							</view>
						</template>
						
						<!-- 心愿单报价类型 -->
						<template v-if="item.type == 3">
							<view class="content bg-orange shadow">
								
								<view class="confirmiew">
									
									<!-- 文本内容 -->
									<view class="margin-top-sm t_wrap text-white">
										{{ i18n.wishlist.timeline.wishupdatequotationtip }}
									</view>
									
									<!-- 价格 -->
									<view v-if="item.price" class="priceview bg-white radius margin-top-sm flex align-center justify-center">
										<text class="text-price text-red text-bold text-xl margin-left-sm">{{ item.price }}</text>
									</view>
								</view>
								
							</view>
						</template>
						
						<!-- 心愿单同意类型 -->
						<template v-if="item.type == 4">
							<view class="content bg-green shadow">
								{{ user.role == $basejs.roleEnum.productAgent ? i18n.wishlist.timeline.wishconfirmquotationagenttip : i18n.wishlist.timeline.wishconfirmquotationcustomertip }}
							</view>
						</template>
						
						<!-- 心愿单拒绝类型 -->
						<template v-if="item.type == 5">
							<view class="content bg-grey shadow">
								{{ user.role == $basejs.roleEnum.productAgent ? i18n.wishlist.timeline.wishrefusequotationagenttip : i18n.wishlist.timeline.wishrefusequotationcustomertip }}
							</view>
						</template>
						
					</view>
					
					<!-- 本人头像区域 -->
					<template v-if="item.creatUser._id == user._id">
						<view class="cu-avatar radius" :style="{ backgroundImage: `url(${item.creatUser.avatar})` }"></view>
					</template>
					
					<!-- 时间区域 -->
					<uni-dateformat class="date" :date="item.creatTime"  format="yyyy/MM/dd hh:mm:ss" />
					
					<!-- 添加操作按钮区域 -->
					<!-- 操作区域 -->
					<view v-if="false" class="operateview margin-top-sm flex align-center">
						
						<button class="cu-btn round bg-grey cuIcon cuIcon-edit"></button>
						
						<button class="cu-btn round bg-red cuIcon cuIcon-delete margin-left-sm"></button>
						
						<button class="cu-btn round bg-green cuIcon cuIcon-share margin-left-sm"></button>
					</view>
					
				</view>
				
			</scroll-view>
			
			<!-- 发布时间轴区域 -->
			<!-- <view v-if="false" class="timelineinputview">
				
				<view class="cu-form-group solid-bottom pos-relative">
					
					<textarea class="contenttextarea" :style="{height: textareaHighScreen ? '400rpx' : '100rpx' }" maxlength="-1" :show-confirm-bar="false" disable-default-padding :cursor-spacing="60" v-model="content" :placeholder="i18n.placeholder.handletimeline.typecontent" :focus="textareaHighScreen" />
					<cover-view class="cuIcon text-pink pos-absolute" :class="[textareaHighScreen ? 'cuIcon-fold' : 'cuIcon-full']" style="right: 10rpx;bottom: 10rpx;z-index: 9999;font-size: 24px;" @tap.stop="textareaHighScreen = !textareaHighScreen"></cover-view>
					
				</view>
				
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
				
			</view> -->

			<view class="cu-bar foot input timelineinput" :style="[{bottom:InputBottom+'px'}]">
				<view class="action">
					<text class="cuIcon-picfill text-grey"></text>
				</view>
				<input class="solid-bottom" v-model="timelineContent" :adjust-position="false" :focus="false" :maxlength="-1" cursor-spacing="10"
				 @focus="(e) => {InputBottom = e.detail.height}" @blur="() => {InputBottom = 0}"></input>
				<!-- <view class="action">
					<text class="cuIcon-emojifill text-grey"></text>
				</view> -->
				<button class="cu-btn bg-green shadow" @tap.stop="sendTimeLine">{{ i18n.base.confirm }}</button>
			</view>
			
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 弹出视图 -->
		<u-popup v-model="showpopup" :mode="popmode" width="80%" border-radius="16" :mask-close-able=" popuptype !== 'share' ">
			
			<!-- 链接展示 -->
			<template v-if="popuptype == 'productlink'">
				<view v-if="productLinkInfo" class="cu-list menu text-left">
					
					<!-- 口令 -->
					<view class="cu-item">
						<view class="content padding-tb-sm" style="max-width: 70%;">
							<view>
								<text class="cuIcon-explorefill text-blue margin-right-xs"></text>
								{{ productLinkInfo.secretCode || '' }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.common.secretcodetip }}
							</view>
						</view>
						
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow cuIcon-copy" @click="$basejs.copytoclipboard(productLinkInfo.secretCode);showpopup=false">
								<!-- <text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> -->
							</button>
						</view>
						
					</view>
					
					<!-- 纯链接 -->
					<view class="cu-item">
						<view class="content padding-tb-sm" style="max-width: 70%;">
							<view>
								<text class="cuIcon-link text-yellow margin-right-xs"></text>
								{{ productLinkInfo.pureLink || '' }}
							</view>
							<view class="text-gray text-sm">
								<text class="cuIcon-infofill margin-right-xs"></text>
								{{ i18n.wishlist.common.pureurltip }}
							</view>
						</view>
						
						<view class="action">
							<button class="cu-btn round bg-gradual-blue shadow cuIcon-copy" @click="$basejs.copytoclipboard(productLinkInfo.pureLink);showpopup=false">
								<!-- <text class="cuIcon-copy text-sm">{{ i18n.base.copy }}</text> -->
							</button>
						</view>
						
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
		<alertqrcode ref="qrcodealert" :qrCodeContent="qrCodeContent" :qrcodeSize="180" :ifshow.sync="ifshowqrcode"></alertqrcode>
		
	</view>
</template>

<script>
	
	import wishTableSpec from '@/components/wishtablespec/wishtablespec.vue'; // 使用u-table的多规格表格
	
	var _this
	
	export default {
		
		data() {
			return {
				
				needtochecktoken: true, // 是否检测用户token信息
				ifloading: false, // 是否加载
				
				wishId: null, // 当前心愿详情id
				ifShare: false, // 是否是分享来源
				wishInfo: null, // 当前心愿详情
				
				showDrawer: false, // 是否显示抽屉  默认为否
				InputBottom: 0, // 时间轴输入框底部
				
				swiperCur: 0, // 当前轮播图索引
				swiperList: null, // 轮播图数据
				productLinkInfo: null, // 商品外链相关内容
				
				timelinedataList: null, // 时间轴数据
				noticeBarList: null, // 滚动消息通知数据
				timeLineScrollViewId: '', // 时间轴滚动视图id
				
				timelineContent: '', // 输入的时间轴内容
				
				popuptype: 'wishlink' , //模态框的类型  shippingtool为运费工具  wishlink为心愿链接展示  inputarea为输入内容类型  默认为心愿链接展示
				popmode: 'bottom', // 模态框的方向类型  默认为bottom
				showpopup: false, // 是否显示模态框
				
				ifshowqrcode: false, // 是否显示弹出二维码  默认否
				qrCodeContent: "", // 二维码显示内容
				
			};
		},
		
		components: {
			wishTableSpec,
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
			
		},
		
		onLoad(option) {
			_this = this
			
			let id = option.id
			this.wishId = id
			
			// 判断是否是分享的内容
			let ifShare = option.ifShare == 'true'
			this.ifShare = ifShare
			
			if(this.wishId) {
				// 开始加载心愿详情数据
				this.loadDetailData()
				// 开始加载时间轴数据
				this.loadTimeLineData()
			}
			else {
				uni.showToast({
					title: _this.i18n.error.loaderror,
					icon: 'none'
				})
			}
			
			// 更新跟心愿详情相关的所有内容
			uni.$on('updatewishdetail', function() {
				_this.loadDetailData()
			})
			
			uni.$on('updatetimeline', function() {
				_this.loadTimeLineData()
			})
			
		},
		
		onUnload() {
			uni.$off('updatewishdetail')
			uni.$off('updatetimeline')
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
			
			this.temptimelineitem = null
			this.sharecontent = ''
			
			return shareobj
		},
		
		methods: {
			
			// 获取心愿详情
			loadDetailData() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取详情信息
				const db = uniCloud.database();
				db.collection('wish,uni-id-users')
					.doc(_this.wishId)
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
							
						}
					})
					.catch(error => {
						_this.ifloading = false // 结束缓冲动画
					})
				
			},
			
			// 加载时间轴数据
			loadTimeLineData() {
	
				const db = uniCloud.database();
				db.collection('wish-timeline, uni-id-users')
				.where(`wishId == '${_this.wishId}' `)
				.field(`creatUid{username,nickname,avatar,role} as creatUser, agentUid{username,nickname,avatar,role} as agentUser, type, creatTime, content, imgs, link, price`)
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
						// 心愿单被代理关联
						else if(eachtimeline.type == 90) {
							eachtimeline.content = _this.i18n.wishlist.timeline.wishagentbindtip
						}
						// 心愿单编辑
						else if(eachtimeline.type == 2) {
							eachtimeline.content = _this.i18n.wishlist.timeline.editsign
						}
						// 心愿单待确认
						else if(eachtimeline.type == 3) {
							eachtimeline.content = _this.i18n.wishlist.timeline.wishupdatequotationtip
						}
						// 心愿单同意
						else if(eachtimeline.type == 4) {
							eachtimeline.content = _this.user.role == _this.$basejs.roleEnum.productAgent ? _this.i18n.wishlist.timeline.wishconfirmquotationagenttip : _this.i18n.wishlist.timeline.wishconfirmquotationcustomertip
						}
						// 心愿单拒绝
						else if(eachtimeline.type == 5) {
							eachtimeline.content = _this.user.role == _this.$basejs.roleEnum.productAgent ? _this.i18n.wishlist.timeline.wishrefusequotationagenttip : _this.i18n.wishlist.timeline.wishrefusequotationcustomertip
						}
					}) 
					
					let tmpData = [...data] // 注意深拷贝
					let timelinedatalist = tmpData.reverse() // 逆序展示时间轴
					_this.timelinedataList = timelinedatalist
					let lastId = timelinedatalist[timelinedatalist.length - 1]._id
					_this.$nextTick(function(){
						_this.timeLineScrollViewId = lastId
					})
					
					// 设置通知栏最新内容
					let noticeBarList = data.map(eachitem => eachitem.content)
					// _this.noticeBarList = noticeBarList
					let newestNoticeList = noticeBarList.slice(0,1)
					_this.noticeBarList = newestNoticeList // 展示最新的时间轴内容
					
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
			
			// 点击二维码图标
			clickShowQR() {
				let prolinkinfo = this.$basejs.getlinkbycode(this.currentProduct.platformLink)
				console.log(`获取到的商品外链相关信息为:`);
				console.log(prolinkinfo);
				let qrcode = this.$basejs.getlinkbycode(this.currentProduct.platformLink).pureLink
				if(qrcode) {
					this.qrCodeContent = qrcode
					this.ifshowqrcode = true
				}
			},
			
			// 查看商品详情数据
			checkProductDetail(pid) {
				uni.navigateTo({
					url: `/pages/wishlist/linkprodetail?pid=${pid}`
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
							
							// 开始代理心愿
							let wishInfo = _this.wishInfo
							const db = uniCloud.database();
							db.collection('wish')
							.doc(_this.wishId)
							.update({agentUid:db.env.uid, status: 1, updateTime: db.env.now})
							.then(response => {
								// 关联成功
								uni.showToast({
									title: _this.i18n.tip.optionsuccess,
									icon: 'none'
								});
								
								// 刷新数据
								_this.loadDetailData()
								// 更新列表数据
								uni.$emit('updatewishlist')
								// 发送代理员关联消息通知
								_this.pushNoticeMsg('agentbindwish')
								
								
								// 添加一个代理人关联心愿时间轴记录
								db.collection('wish-timeline')
								.add({type: 90,wishId: _this.wishId})
								.then(response => {
									// 创建时间轴成功
									console.log(`创建关联时间轴成功`);
									_this.loadTimeLineData()
								})
								.catch(error => {
									console.log(`创建关联时间轴失败`);
									console.log(error);
								})
			
							})
							.catch(error => {
								// 关联失败
								console.log(error);
								uni.showToast({
									title: _this.i18n.tip.optionerror,
									icon: 'none'
								});
							})
							
						}
					}
				});
				
			},
			
			// 编辑心愿
			editWish() {
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?wishId=${_this.wishId}&type=edit`
				});
			},
			
			// 删除心愿
			deleteWish() {
				
				uni.showModal({
					content: _this.i18n.tip.deleteconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							// 开始调用openDB 删除该心愿
							const db = uniCloud.database();
							db.collection('wish')
							.doc(_this.wishId)
							.remove()
							.then(res => {
								// 删除成功
								// 更新列表数据
								uni.$emit('updatewishlist')
								
								// 删除对应的时间轴数据
								db.collection('wish-timeline').where( `wishId == '${_this.wishId}'` ).remove()
								.then(response => {
									console.log(`删除时间轴数据成功`);
								})
								.catch(error => {
									console.log(`删除时间轴数据失败`);
								})
								
								// 返回上个页面
								uni.navigateBack();
								// 提示
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
			
			// 心愿单报价
			wishQuotation() {
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?wishId=${this.wishId}&type=quotation`
				});
			},
			
			// 用户拒绝报价
			refuseQuotation() {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 更新心愿状态, 将心愿报价单内容清空
							let quotationInfo = {
								totalProPrice: "",
								totalShippingFee: "",
								totalCommissionFee: ""
							}
							const db = uniCloud.database();
							db.collection('wish')
							.doc(_this.wishId)
							.update({status: 1, quotationInfo, updateTime: db.env.now})
							.then(response => {
								// 拒绝成功
								// 刷新数据
								_this.loadDetailData()
								// 刷新列表数据
								uni.$emit('updatewishlist')
								
								// 推送消息
								_this.pushNoticeMsg('refusequotation')
								
								// 添加拒绝时间轴
								let timelinedata = {
									type: 5,
									wishId: _this.wishId
								}
								db.collection('wish-timeline')
								.add(timelinedata)
								.then(response => {
									if(response.result.code == 0) {
										console.log(`添加时间轴成功`);
										// 刷新时间轴数据
										_this.loadTimeLineData()
									}
									else {
										console.log(`添加时间轴失败`);
									}
								})
								.catch(error => {
									console.log(`添加时间轴失败`);
								})
							})
							.catch(error => {
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
							})
							
						}
					}
				});

			},
			
			// 用户同意报价
			agreeQuotation() {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 更新心愿状态
							const db = uniCloud.database();
							db.collection('wish')
							.doc(_this.wishId)
							.update({status: 3, updateTime: db.env.now})
							.then(response => {
								// 同意报价成功
								// 刷新数据
								_this.loadDetailData()
								
								// 刷新列表数据
								uni.$emit('updatewishlist')
								
								// 推送代理员消息
								_this.pushNoticeMsg('agreequotation')
								
								// 商家订阅消息
								_this.subscribeNoticeMsg()
								
								// 添加同意时间轴
								let timelinedata = {
									type: 4,
									wishId: _this.wishId
								}
								db.collection('wish-timeline')
								.add(timelinedata)
								.then(response => {
									if(response.result.code == 0) {
										console.log(`添加时间轴成功`);
										// 刷新时间轴数据
										_this.loadTimeLineData()
									}
									else {
										console.log(`添加时间轴失败`);
									}
								})
								.catch(error => {
									console.log(`添加时间轴失败`);
								})
								
								// 生成订单信息
								let orderProductList = [..._this.wishInfo.productList]
								orderProductList.forEach(eachproduct => {
									// 删除心愿单商品中的草稿箱商品记录id(如果有的话)
									if(eachproduct.draftproId) {
										delete eachproduct.draftproId
									}
								})
								// 获取支付总金额
								let totalPrice = _this.$refs.wishtablespecref.getWishInfoTotalMoney()
								
								let orderdata = {
									wishId: _this.wishId,
									productList: orderProductList,
									totalOrderPrice: totalPrice,
								}
								db.collection('order')
								.add(orderdata)
								.then(response => {
									if(response.result.code == 0) {
										// 添加订单成功
										// 跳转支付收银台页面
										let orderId = response.result.id
										uni.navigateTo({
											url: `/pages/wishlist/payment?orderId=${orderId}`
										});
										
									}
									else {
										uni.showToast({
											title: _this.i18n.error.optionerror,
											icon: 'none'
										});
									}
								})
								.catch(error => {
									uni.showToast({
										title: _this.i18n.error.optionerror,
										icon: 'none'
									});
								})
								
							})
							.catch(error => {
								uni.showToast({
									title: _this.i18n.error.optionerror,
									icon: 'none'
								});
							})
							
						}
					}
				});
				
			},
			
			// 再次购买
			wishBuyAgain() {
				uni.navigateTo({
					url: `/pages/wishlist/makewishorder?sourceFrom=wishbuyagain&wishId=${this.wishId}`
				});
			},
			
			// 心愿订单详情
			// gotoWishOrder() {
			// 	let wishOrderId = this.wishOrderInfo._id
			// 	uni.navigateTo({
			// 		url: `/pages/wishlist/wishorder?wishOrderId=${wishOrderId}`
			// 	});
			// },
			
			// 订阅消息
			subscribeNoticeMsg() {
				
				// 开始获取订阅
				// #ifdef MP-WEIXIN
				
				// 增加订阅模板消息的功能
				let purchaseorderId = this.$store.getters.configData.wxminiNoticeTemplateDic.purchaseorder
				let deliveryorderId = this.$store.getters.configData.wxminiNoticeTemplateDic.deliveryorder
				
				uni.requestSubscribeMessage({
					tmplIds: [purchaseorderId,deliveryorderId],
					success(res){
						let errMsg = res.errMsg
						console.log(errMsg);
						if(errMsg == 'requestSubscribeMessage:ok') {
							console.log(res[purchaseorderId]);
							// 用户同意订阅
							if(res[purchaseorderId] == 'accept') {
								console.log(`用户订阅消息成功`);
							} else if(res[purchaseorderId] == 'reject') {
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
					}
				})
				
				// #endif
				
			},
			
			// 发送时间轴数据
			sendTimeLine() {
				if(!this.timelineContent) {
					return
				}
				
				const db = uniCloud.database();
				_this.ifloading = true
				let timelineitem = {
					wishId: _this.wishId,
					content: _this.timelineContent,
					type: 1,
				}
				db.collection('wish-timeline')
				.add(timelineitem)
				.then(response => {
					_this.ifloading = false
					if(response.result.code == 0) {
						// 添加成功
						_this.timelineContent = ''
						// 刷新时间轴数据
						_this.loadTimeLineData()
					}
					else {
						uni.showToast({
							title: _this.i18n.error.optionerror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					_this.ifloading = false
					uni.showToast({
						title: _this.i18n.error.optionerror,
						icon: 'none'
					});
				})
				
			},
			
			// 长按时间轴
			longpressTimeLine(index) {
				let selectTimeLineIndex = index
				let selectTimeLineItem = _this.timelinedataList[index]
				
				let itemList = [
					_this.i18n.base.edit,
					_this.i18n.base.delete
				]
				uni.showActionSheet({
					itemList: itemList,
					success: res => {
						let tapIndex = res.tapIndex
						
						// 编辑
						if(tapIndex == 0) {
							
						}
						// 删除
						else if(tapIndex == 1) {
							uni.showModal({
								content: _this.i18n.tip.deleteconfirm,
								showCancel: true,
								cancelText: _this.i18n.base.cancel,
								confirmText: _this.i18n.base.confirm,
								success: res => {
									if(res.confirm) {
										const db = uniCloud.database();
										db.collection('wish-timeline')
										.doc(selectTimeLineItem._id)
										.remove()
										.then(response => {
											if(response.result.code == 0) {
												// 删除成功
												_this.timelinedataList.splice(selectTimeLineIndex, 1)
											}
											else {
												uni.showToast({
													title: _this.i18n.error.optionerror,
													icon: 'none'
												});
											}
										})
										.catch(error => {
											uni.showToast({
												title: _this.i18n.error.optionerror,
												icon: 'none'
											});
										})
									}
								}
							});
						}
						
					},
					fail: () => {},
					complete: () => {}
				});
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

			// 编辑时间轴数据
			edittimeline(timelineitem) {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${timelineitem.wishId}&timelineId=${timelineitem._id}&type=edit`
				});
			},
			
			// 推送消息
			pushNoticeMsg(msgtype) {
				
				let info
				// 根据不同的消息类型准备不同的数据内容
				if(msgtype == 'agentbindwish') {
					info = {
						msgtype: msgtype,
						wishId: _this.wishId
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
		width: 100vw;
		overflow: hidden;
	}
	
	.pagecontent{
		
		.wishInfoview{
			padding-bottom: 120rpx;
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
		
		.timelineinput{
			transition: all 0.3s;
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
		padding: 0;
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
