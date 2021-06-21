<template>
	<view class="pagecontent wishdetailview">
		
		<!-- 导航栏 -->
		<cu-custom :bgColor=" wishinfo ? wishbgcolor : 'bg-gradual-pink' " isBack :title="i18n.nav.wishlist" isOwnBackPage @ownbackpage="ownBackPage">
			<block slot="content">{{i18n.nav.wishlist}}</block>
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
						
						<!-- 数量标签 -->
						<!-- <view class="cu-tag pos-absolute radius bg-cyan" style="right: 0;bottom: 0;z-index: 10;">
							{{ wishinfo.targetAmount }}
						</view> -->
						
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
							<text class="protitle">{{wishinfo.productTitle}}</text>
			
						</view>
						
						<!-- 商品价格和数量 -->
						<view class="priceandamountview margin-top-sm flex align-center justify-between">
							
							<view class="priceview flex-sub">
								<text class="text-red text-xl margin-right">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text>
								<!-- <text class="text-gray text-df" style="text-decoration: line-through;">{{ `${wishinfo.sourceMoneyType === 'RMB' ? '¥' : wishinfo.sourceMoneyType === 'THB' ? '฿' : ''}${wishinfo.sourcePrice}` }}</text> -->
							</view>
							
							<view class="cu-tag radius bg-cyan pos-static">
								{{ wishinfo.targetAmount }}
							</view>
							
						</view>
						
					</view>
					
					<!-- 操作区域 -->
					<view class="btnsview flex align-center padding-sm">
						
						<!-- 复制源网站链接按钮 非H5平台且有源网站链接时出现-->
						<button v-if="wishinfo.sourceLink" class="cu-btn round bg-gradual-green cuIcon-link margin-right-sm" @tap.stop=" popuptype = 'wishlink'; popmode='bottom'; showpopup=true; "></button>
						
						<!-- 分享按钮 小程序平台有 -->
						<!-- #ifdef MP -->
						<button class="cu-btn round bg-orange cuIcon-share margin-right-sm" open-type="share"></button>
						<!-- #endif -->
						
						<!-- 再次购买按钮 -->
						<button class="cu-btn round bg-pink cuIcon-add margin-right-sm" @tap.stop="buyagain(wishinfo)"></button>
						
						<!-- 编辑按钮 仅自己可编辑 -->
						<button v-if="wishinfo.creatUser && wishinfo.creatUser._id == user._id" class="cu-btn round bg-gray cuIcon-edit margin-right-sm" @tap.stop="editwish"></button>
						
						<!-- 删除按钮 仅自己可删除 -->
						<button v-if="wishinfo.creatUser && wishinfo.creatUser._id == user._id" class="cu-btn round bg-red cuIcon-delete margin-right-sm" @tap.stop="deletewish"></button>
						
						<!-- 查看1688详情按钮 -->
						<button class="cu-btn round bg-gradual-orange cuIcon-goods margin-right-sm" @tap.stop="check1688prodetail"></button>
						
					</view>
					
				</view>
			
			</view>
			
			<!-- 其他信息区域-->
			<view class="detaildataview margin">
				
				<!-- 订购规格table -->
				<view v-if="wishinfo && wishinfo.selectSpecPropInfo" class="wishspectable">
					<view class="cu-bar bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-orange"></text>
							{{i18n.wishlist.wishproductspecdetail}}
						</view>
					</view>
					<wishTableSpec ref="wishtablespec" v-if="wishinfo" :wishinfo="wishinfo"></wishTableSpec>
				</view>
				
				<!-- 物流信息表格 -->
				<view v-if="false && wishinfo && wishinfo.productExt" class="shippingtable">
					
					<view class="cu-bar bg-white solid-bottom">
						<view class="action">
							<text class="cuIcon-title text-blue"></text>
							{{i18n.wishlist.wishproductshippingdetail}}
						</view>
					</view>
					<view class="shippingtable">
						<wishShippingTable :wishinfo="wishinfo"></wishShippingTable>
					</view>
					
				</view>
				
				<!-- 手风琴区域 -->
				<u-collapse accordion :head-style="{color: '#0081ff'}">
					
					<!-- 商品规格信息 -->
					<u-collapse-item v-if="false && wishinfo && wishinfo.selectSpecPropInfo" :title="i18n.wishlist.wishproductspecdetail" :open="true">
						
						<view slot="title" class="cu-bar bg-white">
							<view class="action">
								<text class="cuIcon-title text-orange"></text>
								{{i18n.wishlist.wishproductspecdetail}}
							</view>
						</view>
						<wishTableSpec ref="wishtablespec" v-if="wishinfo" :wishinfo="wishinfo"></wishTableSpec>
					</u-collapse-item>
					
					<!-- 拓展信息 -->
					<u-collapse-item v-if="extArr && extArr.length > 0" :title="i18n.wishlist.wishproductextdetail" :open="true">
						
						<view slot="title" class="cu-bar bg-white">
							<view class="action">
								<text class="cuIcon-title text-blue"></text>
								{{i18n.wishlist.wishproductextdetail}}
							</view>
						</view>
						
						<view class="cu-list menu sm-border extview">
							
							<view class="cu-item" v-for="(item, index) in extArr" :key="index">
								<view class="content basis-sm">
									<text class="text-grey text-cut">{{ item.keyStr }}</text>
								</view>
								<view class="action">
									
									<template v-if="item.id == 'internationalShippingFee' ">
										<button class="cu-btn cuIcon-keyboard bg-gradual-blue" @click="openshippingtool">{{ i18n.shipping.calcualteshipping }}</button>
									</template>
									<template v-else>
										<text class="text-grey text-sm">{{item.value }} </text>
									</template>
									
								</view>
							</view>
							
						</view>
						
					</u-collapse-item>
					
				</u-collapse>
				
			</view>
			
		</view>
		
		<!-- 时间轴 -->
		<view v-if="false && wishinfo && timelinearrdic && Object.keys(timelinearrdic).length > 0 " class="timelineview solid-top">
			
			<view class="cu-bar bg-white">
				<view class="action">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-xl text-bold">{{ i18n.wishlist.timeline.title }}</text>
				</view>
			</view>
			
			<view class="cu-timeline" v-for="(timelinearr, timelinekey) in timelinearrdic" :key="timelinekey">
				
				<view class="cu-time">{{ $moment(timelinekey).format('Do/MMM') }}</view>
				
				<wishTimeLineItem class="cu-item" v-for="(timelineitem, timelineindex) in timelinearr" :key="timelineindex" :timelineInfo="timelineitem" @sharetimeline="sharetimeline"></wishTimeLineItem>
				
				<!-- 
				时间轴类型  
					0 心愿单创建  1心愿单普通时间轴更新 2心愿单编辑  3心愿单待确认
					4心愿单确认通过  5心愿单确认拒绝  6心愿单完成
				-->
				<block v-if="false" v-for="(timelineitem, timelineindex) in timelinearr" :key="timelineindex">
					
					<!-- 心愿开始类型  type=0 -->
					<view v-if="timelineitem.type == 0" class="cu-item cuIcon-evaluate_fill text-pink">
						<view class="content bg-pink shadow-blur">
							<uni-dateformat :date="timelineitem.creatTime" format="yyyy/MM/dd hh:mm:ss" />
							<text class="margin-left">{{ i18n.wishlist.timeline.startsign }}</text>
						</view>
					</view>
					
					<!-- 心愿单普通时间轴类型 type=1 -->
					<view v-if="timelineitem.type == 1" class="cu-item">
						<view class="content">
							
							<!-- 评论创建人的头像昵称 -->
							<view v-if="timelineitem.creatUser" class="cu-item flex align-center justify-between">
								<view class="leftview flex align-center">
									<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
									<view class="flex flex-direction text-df">
										<text class="text-df">{{ timelineitem.creatUser.nickname }}</text>
										<text class="commenttime text-sm text-gray">{{$moment(timelineitem.creatTime).format('MM/DD HH:mm:ss')}}</text>
									</view>
								</view>
							</view>
							
							<!-- 文本内容 -->
							<view v-if="timelineitem.content" class="margin-top-sm t_wrap">
								{{timelineitem.content}}
							</view>
							
							<!-- 图片 -->
							<view v-if="timelineitem.imgs" class="imgsview bg-white margin-top-sm padding">
								
								<view class="grid col-3 grid-square">
									<view class="bg-img" v-for="(img,index) in timelineitem.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImgs(timelineitem.imgs, index)"></view>
								</view>
								
							</view>
							
							<!-- 价格 -->
							<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
								
								<text class="cuIcon cuIcon-moneybagfill text-red"></text>
								<text class="text-red text-xl margin-left-sm">{{ `${timelineitem.moneyType === 'RMB' ? '¥' : timelineitem.moneyType === 'THB' ? '฿' : ''}${timelineitem.price}` }}</text>
								
							</view>
							
							<!-- 评论链接区域 -->
							<view v-if="timelineitem.link" class="linkview flex align-center margin-top-sm">
								
								<text class="cuIcon cuIcon-link text-green"></text>
								<text class="text-sm text-gray margin-left-sm">{{ timelineitem.link }}</text>
								<!-- 复制按钮 -->
								<!-- #ifndef H5 -->
								<button class="cu-btn bg-cyan shadow sm margin-left" style="flex-shrink: 0;" @tap.stop="$basejs.copytoclipboard(timelineitem.link)">{{i18n.base.copy}}</button>
								<!-- #endif -->
								
							</view>
							
							<!-- 按钮操作区域 -->
							<view class="btnsview margin-top-sm solid-top padding-top-sm flex align-center justify-between">
								
								<view class="leftview flex align-center">
									
								</view>
								
								<view v-if="timelineitem.creatUser" class="righview flex align-center">
									<button v-if="user._id == timelineitem.creatUser._id" class="cu-btn cuIcon-delete text-red round bg-white" @tap.stop="deletetimeline(timelineitem,timelinekey,timelineindex)"></button>
									<button v-if="user._id == timelineitem.creatUser._id" class="cu-btn cuIcon-edit round bg-white margin-left-sm" @tap.stop="edittimeline(timelineitem)"></button>
									<!-- #ifdef MP -->
									<button class="cu-btn cuIcon-share round bg-white margin-left-sm" @tap.stop="sharetimeline(timelineitem)"></button>
									<!-- #endif -->
								</view>
								
							</view>
							
						</view>
					</view>
					
					<!-- 心愿单编辑类型  type=2 -->
					<view v-if="timelineitem.type == 2" class="cu-item cuIcon-evaluate_fill text-gray">
						<view class="content bg-gray shadow-blur">
							<text>{{ $moment(timelineitem.creatTime).format('DD/MM/YYYY HH:mm:ss') }}</text>
							<text class="margin-left">{{ `"${timelineitem.editUser ? timelineitem.editUser.nickname : ''}"${i18n.base.edit}${i18n.wishlist.wishdetail}` }}</text>
						</view>
					</view>
					
					<!-- 心愿单发现新商品类型 包含待确认type=3、同意type=4、拒绝type=5等状态 -->
					<view v-if="timelineitem.type == 3 || timelineitem.type == 4 || timelineitem.type == 5" class="cu-item">
						
						<view :class="[ timelineitem.type==3 ? 'bg-gradual-orange' : timelineitem.type==4 ? 'bg-pink' : timelineitem.type==5 ? 'bg-gray' : 'bg-grey' , 'content']">
							
							<!-- 发布人头像昵称 -->
							<view class="cu-item flex align-center justify-between">
								
								<!-- 左侧区域 -->
								<view class="leftview flex-treble flex align-center">
									<image class="cu-avatar round margin-right-sm" :src="timelineitem.creatUser.avatar" mode="aspectFill"></image>
									<view class="flex flex-direction text-sm">
										<text class="text-black">{{timelineitem.creatUser.nickname}}</text>
										<text class="text-grey">{{$moment(timelineitem.creatTime).format('HH:mm:ss')}}</text>
									</view>
								</view>
								
								<!-- 动态标识 -->
								<view class="rightview flex-sub flex align-center justify-end">
									
									<!-- type=3 待确认标识 -->
									<view v-if="timelineitem.type==3" class="cu-tag bg-white radius">{{ i18n.base.waittoconfirm }}</view>
									<!-- type=4 通过标识 -->
									<view v-if="timelineitem.type==4" class="cu-tag bg-green radius">{{ i18n.base.agree }}</view>
									<!-- type=5 拒绝标识 -->
									<view v-if="timelineitem.type==5" class="cu-tag bg-grey radius">{{ i18n.base.refuse }}</view>
									
								</view>
								
							</view>
							
							<!-- 文本内容 -->
							<view v-if="timelineitem.content" class="margin-top-sm text-black t_wrap">
								{{ timelineitem.content }}
							</view>
							
							<!-- 图片区域 -->
							<view v-if="timelineitem.imgs" class="imgsview bg-white margin-top-sm padding">
								
								<view class="grid col-3 grid-square">
									<view class="bg-img" v-for="(img,index) in timelineitem.imgs.split(',')" :key="index" :style="[{ backgroundImage:'url(' + img + ')' }]" @tap.stop="previewImgs(timelineitem.imgs, index)"></view>
								</view>
								
							</view>
							
							<!-- 价格区域 -->
							<view v-if="timelineitem.price" class="priceview margin-top-sm flex align-center">
								
								<text class="cuIcon cuIcon-moneybagfill text-red"></text>
								<text class="text-black text-bold text-xl margin-left-sm">{{ `${timelineitem.moneyType === 'RMB' ? '¥' : timelineitem.moneyType === 'THB' ? '฿' : ''}${timelineitem.price}` }}</text>
								
							</view>
							
							<!-- 链接区域 -->
							<view v-if="timelineitem.link" class="linkview flex align-center margin-top-sm">
								
								<text class="cuIcon cuIcon-link text-green"></text>
								<text class="text-sm text-black margin-left-sm t_oneline">{{ timelineitem.link }}</text>
								<!-- 复制按钮 -->
								<!-- #ifndef H5 -->
								<button class="cu-btn bg-cyan shadow sm margin-left" style="flex-shrink: 0;" @tap.stop="$basejs.copytoclipboard(timelineitem.link)">{{i18n.base.copy}}</button>
								<!-- #endif -->
								
							</view>
							
							<!-- 不同状态的差异化区域 -->
							<view class="differentview margin-top-sm padding-top-sm solid-top">
								
								<!-- 待确认状态 type=3 按钮操作区域 -->
								<view v-if="timelineitem.type==3" class="btnview flex align-center justify-between">
									
									<view class="leftview flex align-center">
										<button class="cu-btn round bg-gray margin-right" @tap.stop="refusetimeline(timelineitem)">{{ i18n.base.refuse }}</button>
										<button class="cu-btn round bg-pink" @tap.stop="agreetimeline(timelineitem)">{{ i18n.base.agree }}</button>
									</view>
									
									<view class="rightview flex align-center">
										
									</view>
									
								</view>
								
								<!-- 同意状态 type=4 发布需求单 -->
								<view v-if="timelineitem.type==4" class="agreeview margin-left-sm padding-left-sm">
									
									<!-- 同意人 -->
									<view v-if="timelineitem.agreeUser" class="agreeUserview flex align-center">
										<view class="leftview flex align-center">
											<image class="cu-avatar round sm" :src="timelineitem.agreeUser.avatar" mode="aspectFill"></image>
											<view class="flex margin-left-sm flex-direction text-sm">
												<text class="usernameview text-white text-sm text-cut">{{ timelineitem.agreeUser.avatar }}</text>
												<text class="text-gray">{{timelineitem.agreeTime}}</text>
											</view>
										</view>
									</view>
								
								</view>
								
								<!-- 被拒绝状态  type=5 拒绝标识和拒绝理由 -->
								<view v-if="timelineitem.type==5" class="refusereasonview margin-left-sm padding-left-sm">
									
									<!-- 拒绝人 -->
									<view v-if="timelineitem.refuseUser" class="refuseUserview flex align-center">
										
										<view class="leftview flex align-center">
											<image class="cu-avatar round sm" :src="timelineitem.refuseUser.avatar" mode="aspectFill"></image>
											<view class="flex margin-left-sm flex-direction text-sm">
												<text class="usernameview text-black text-sm text-cut">{{ timelineitem.refuseUser.nickname }}</text>
												<text class="text-grey">{{timelineitem.refuseTime}}</text>
											</view>
										</view>
									</view>
									
									<!-- 拒绝原因 -->
									<view class="bg-grey padding-sm margin-top-sm margin-left radius text-sm">
										{{ timelineitem.refuseReason }}
									</view>
									
								</view>
								
							</view>
							
							<!-- 按钮操作区域 -->
							<view class="btnsview margin-top-sm solid-top padding-top-sm flex align-center justify-between">
								
								<view class="leftview flex align-center">
									
								</view>
								
								<view class="righview flex align-center">
									<button v-if="user.uid == timelineitem.creatUser.uid" class="cu-btn cuIcon-delete text-red round bg-white" @tap.stop="deletetimeline(timelineitem,timelinekey,timelineindex)"></button>
									<button v-if="user.uid == timelineitem.creatUser.uid" class="cu-btn cuIcon-edit round bg-white margin-left-sm" @tap.stop="edittimeline(timelineitem)"></button>
									<!-- #ifdef MP -->
									<button class="cu-btn cuIcon-share round bg-white margin-left-sm" @tap.stop="sharetimeline(timelineitem)"></button>
									<!-- #endif -->
								</view>
								
							</view>
							
						</view>
						
					</view>
					
					<!-- 心愿完成类型  type=6 -->
					<view v-if="timelineitem.type == 6" class="cu-item cuIcon-evaluate_fill text-green">
						<view class="content bg-green shadow-blur">
							<text>{{ $moment(timelineitem.creatTime).format('DD/MM/YYYY HH:mm:ss') }}</text>
							<text class="margin-left">{{ i18n.wishlist.timeline.finishsign }}</text>
						</view>
					</view>
					
				</block>
				
			</view>
			
		</view>
		
		<!-- 添加按钮 悬浮 -->
		<view class="addbtn cu-btn round bg-gradual-purple shadow-blur cuIcon lg" @tap.stop="updatewishtimeline">
			<text class="cuIcon-add" style="font-size: 100rpx;"></text>
		</view>
		
		<!-- 加载条 -->
		<loading :loadModal="ifloading"></loading>
		
		<!-- 输入弹出框 -->
		<view class="cu-modal" :class="ifshowmodal?'show':''">
			<view class="cu-dialog">
				
				<view class="cu-bar bg-white">
					<template>
						<view v-if="modalType=='refuse'" class="content">{{ i18n.wishlist.timeline.refusereason }}</view>
						<view v-if="modalType=='share'" class="content">{{ i18n.wishlist.timeline.share }}</view>
					</template>
					
				</view>
				<view class="padding-sm text-left">
					<template>
						<textarea v-if="modalType == 'refuse'" style="height: 100rpx;" :focus="ifshowmodal" :maxlength="-1" :cursor-spacing="100" :placeholder="i18n.wishlist.timeline.inputrefusereason" v-model="refuseReason"></textarea>
						<textarea v-if="modalType == 'share'" style="height: 100rpx;" :focus="ifshowmodal" :maxlength="-1" :cursor-spacing="100" :placeholder="i18n.wishlist.timeline.setshareparam" v-model="sharecontent"></textarea>
					</template>
					
				</view>
				<view class="cu-bar bg-white flex justify-around">
					<button class="cu-btn round bg-gray text-grey" @tap.stop="modalcancel">{{i18n.base.cancel}}</button>
					<template>
						<button v-if="modalType=='refuse'" class="cu-btn round bg-gradual-orange" @tap.stop="confirmrefuse">{{i18n.base.confirm}}</button>
						<button v-if="modalType=='share'" open-type="share" class="cu-btn cuIcon-share round bg-gradual-orange">{{i18n.base.confirm}}</button>
					</template>
				</view>
			
			</view>
		</view>
		
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
								{{ productExt.pureUrl || '' }}
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
			</template>
			
			<!-- 运费计算工具 -->
			<template v-if="popuptype === 'shippingtool' && productExt">
				
				<view class="shippingcontentview">
					
					<!-- 装箱数量 -->
					<view v-if="productExt.boxContainerNum" class="cu-form-group">
						<view class="title">{{ i18n.wishlist.boxContainerNum }}</view>
						<input class="text-right" type="number" disabled v-model="productExt.boxContainerNum">
					</view>
					
					<!-- 装箱尺寸 -->
					<view v-if="productExt.boxLength" class="cu-form-group">
						<view class="title">{{ `${i18n.wishlist.boxSize}(cm)` }}</view>
						<view class="flex align-center justify-around" style="max-width: 60%;">
							<input type="number" disabled v-model="productExt.boxLength">
							<text class="padding-sm">x</text>
							<input type="number" disabled v-model="productExt.boxWidth">
							<text class="padding-sm">x</text>
							<input type="number" disabled v-model="productExt.boxHeight">
						</view>
					</view>
					
					<!-- 装箱体积 -->
					<view v-if="productExt.boxVolume" class="cu-form-group">
						<view class="title">{{ i18n.wishlist.boxVolume }}</view>
						<input class="text-right" type="number" disabled v-model="productExt.boxVolume">
					</view>
					
					<!-- 国际运费单价 -->
					<view class="cu-form-group">
						<view class="title">{{ '国际运费单价' }}</view>
						<input class="text-right" type="number" placeholder="请输入国际运费单价" :focus="showpopup && popuptype == 'shippingtool' " v-model="interShippingSingleFeeStr">
					</view>
					
					<!-- 预估国际运费总价 -->
					<view class="cu-form-group">
						<view class="title">{{ '预估运费' }}</view>
						<view class="rightcontent">
							<text class="text-sm text-red">{{ interShippingTotalFeeStr }}</text>
						</view>
					</view>
					
				</view>
				
			</template>
			
			<!-- 中间输入内容 -->
			<template v-if="popuptype === 'share'">
				
				<view class="cu-dialog">
					
					<view class="cu-bar bg-white">
						<view class="content">{{ i18n.wishlist.timeline.share }}</view>
					</view>
					<view class="padding-sm text-left">
						<textarea style="height: 100rpx;" :focus="showpopup" :maxlength="-1" :cursor-spacing="100" :placeholder="i18n.wishlist.timeline.setshareparam" v-model="sharecontent"></textarea>
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
	import wishSpecTable from '@/components/wishlistitemtablespec/wishlistitemtablespec.vue'; // 使用table-com的多规格表格
	import wishShippingTable from '@/components/wishlistitemtableshipping/wishlistitemtableshipping.vue'; // 使用table-com的物流表格
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
				
				temptimelineitem: null, // 临时时间轴变量
				refuseReason: '', // 拒绝原因
				modalType: 'share', // 弹出框类型  refuse为拒绝类型  share为分享类型 默认为分享类型
				sharecontent: '', // 分享内容文本
				
				popuptype: 'wishlink' , //模态框的类型  shippingtool为运费工具  wishlink为心愿链接展示  inputarea为输入内容类型  默认为心愿链接展示
				popmode: 'bottom', // 模态框的方向类型  默认为bottom
				showpopup: false, // 是否显示模态框
				
				ifshowmodal: false, // 是否显示模态框
				ifloading: false, // 是否加载(仅用于加载时间轴)
				
				showSelector: false, // 是否显示多规格选择器
				
			};
		},
		
		components: {
			wishSpecTable,
			wishShippingTable,
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
					let interShippingTotalFee = parseFloat(parseFloat(this.productExt.boxVolume) * parseFloat(this.interShippingSingleFeeStr)).toFixed(2)
					let interShippingTotalFeeStr = `${this.productExt.boxVolume}m³ * ${this.interShippingSingleFeeStr} /m³ ≈ ${interShippingTotalFee}`
					return interShippingTotalFeeStr
				}
				else {
					return ''
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
			let title = this.sharecontent ? this.sharecontent : `${this.i18n.wishlist.importproduct.iwant}-${this.wishinfo.productTitle}`
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
					.field('creatUser{nickname,avatar},productTitle,imgs,targetPrice,targetAmount,targetMoneyType,sourcePrice,sourceMoneyType,sourceLink,achieveFlag,hurryLevel,remark,creatTime,productExt,specPropInfo,selectSpecPropInfo,productInfo1688')
					.get({
						getOne:true
					})
					.then(res => {
						console.log(res);
						if(res.result.code == 0) {
							let detaildata = res.result.data
							detaildata.creatUser = detaildata.creatUser[0]
							_this.wishinfo = detaildata
							
							// 解析心愿商品拓展字段
							let productExt = detaildata.productExt
							_this.productExt = productExt
							// 设置拓展展示字段
							_this.setshowproductextinfo(productExt)
							
							// 设置1688商品详情信息
							let productInfo1688 = detaildata.productInfo1688
							_this.productInfo1688 = productInfo1688
							// _this.set1688attributelist(productInfo1688.attributeList)
							
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
			
			// 设置展示的拓展字段
			setshowproductextinfo(productExt) {
				
				// 解析要展示的拓展字段
				let extArr = []
				// for (let [key, value] of Object.entries(productExt)) {
				// 	if(key && value) {
				// 		let item = {key, value}
				// 		extArr.push(item)
				// 	}
				// }
				
				// 箱体尺寸
				let boxSizeItem = {
					keyStr: `${_this.i18n.wishlist.boxSize}(cm)`,
					id: 'boxSize',
					value: productExt.boxLength ? `${productExt.boxLength}cm x ${productExt.boxWidth}cm x ${productExt.boxHeight}cm` : '/'
				}
				
				// 箱体体积
				let boxVolumeItem = {
					keyStr: `${_this.i18n.wishlist.boxVolume}(m³)`,
					id: 'boxVolume',
					value: productExt.boxVolume || '/'
				}
				
				// 装箱数量
				let boxContainNumItem = {
					keyStr: `${_this.i18n.wishlist.boxContainerNum}(pcs/box)`,
					id: 'boxContainNum',
					value: productExt.boxContainerNum || '/'
				}
				
				// 国内运费
				let domesticShippingItem = {
					keyStr: _this.i18n.wishlist.domesticShippingFee,
					id: 'domesticShippingFee',
					value: productExt.domesticShippingFee || '/'
				}
				
				// 国际运费
				let internationalShippingItem = {
					keyStr: _this.i18n.wishlist.internationalShippingFee,
					id: 'internationalShippingFee',
					value: productExt.internationalShippingFee || '/'
				}
				
				extArr = [boxSizeItem, boxVolumeItem, boxContainNumItem, domesticShippingItem, internationalShippingItem]
				
				this.extArr = extArr
				
			},
			
			// 设置1688的属性展示
			set1688attributelist(attributeList) {
				
				let extArr = []
				if(attributeList) {
					attributeList.forEach(eachitem => {
						let Item = {
							keyStr: eachitem.attributeName,
							id: eachitem.attributeName,
							value: eachitem.attributeVal
						}
						extArr.push(Item)
					})
				}
				this.extArr = extArr
				
			},
			
			// 开启运费小工具
			openshippingtool() {
				let productExt = this.wishinfo.productExt
				if(productExt && productExt.boxVolume) {
					this.popuptype = 'shippingtool'
					this.showpopup = true
					this.popmode = 'left'
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
			
			// 加载心愿时间轴数据
			loadtimelinedata() {
				
				_this.ifloading = true // 开始缓冲动画
				
				// 使用openDB获取心愿单对应的时间轴数据
				let wherestr = `wishId == '${_this.id}' `
				const db = uniCloud.database();
				db.collection('wishlisttimeline,uni-id-users')
				.where(wherestr)
				.field('creatUser{avatar,nickname},content,imgs,type,wishId,creatTime')
				.orderBy('creatTime desc')
				.get()
				.then(res => {
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
							if(item.refuseUser) {
								item.refuseUser = item.refuseUser[0] ? item.refuseUser[0] : null
							}
							if(item.agreeUser) {
								item.agreeUser = item.agreeUser[0] ? item.agreeUser[0] : null
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
						_this.timelinearrdic = newtimelinearrdic
						
					}
					// 获取失败
					else {
						console.log(res.result.message);
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(err => {
					// 获取失败
					console.log(err.message);
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				.finally(() => {
					_this.ifloading = false
				})
				
				return
				
				uniCloud.callFunction({
					name:'wishlisttimeline',
					data: {
						type: 'getlist',
						info: {
							wishId: _this.id
						}
					}
				}).then(res => {
					
					_this.ifloading = false // 结束缓冲动画
					
					if(res) {
						let timelinelist = res.result.data
												
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
						console.log(newtimelinearrdic)
						_this.timelinearrdic = newtimelinearrdic

					}
					else {
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				}).catch(error => {
					_this.ifloading = false // 结束缓冲动画
					
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
			},
			
			// 弹出框点击取消
			modalcancel() {
				
				this.showpopup=false;
				this.temptimelineitem = null
				
				if(this.popuptype == 'share') {
					this.sharecontent = ''
				}
				else if(this.popuptype == 'refuse') {
					this.refuseReason = ''
				}
				
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
			buyagain(wishitem) {
				// replace到新增心愿页面
				uni.navigateTo({
					url: `/pages/wishlist/handlewish?type=copy&id=${wishitem._id}`
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
										title: _this.i18n.error.deleteerror,
										icon: 'none'
									});
								})
								.finally(() => {})
							
						}
					},
				})
				
			},
			
			// 查看1688商品详情数据
			check1688prodetail() {
				console.log(this.wishinfo);
				// let searchText = encodeURIComponent(this.wishinfo.sourceLink)
				// uni.navigateTo({
				// 	url: `/pages/wishlist/linkprodetail?searchText=${searchText}`
				// });
			},
			
			// 编辑时间轴数据
			edittimeline(timelineitem) {
				uni.navigateTo({
					url: `/pages/wishlist/handletimeline?wishId=${timelineitem.wishId}&timelineId=${timelineitem._id}&type=edit`
				});
			},
			
			// 拒绝时间轴商品发现
			refusetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 填写拒绝理由
							_this.temptimelineitem = timelineitem
							_this.modalType = 'refuse'
							_this.ifshowmodal = true
							
						}
					},
				})
				
			},
			
			// 拒绝发现操作
			confirmrefuse() {
				
				if(!_this.refuseReason) {
					uni.showToast({
						title: _this.i18n.wishlist.timeline.inputrefusereason,
						icon: 'none'
					});
					return
				}
				// 开始拒绝
				let otherdata = {
					refuseReason: _this.refuseReason,
					refuseUser: _this.user
				}
				let timelineitem = _this.temptimelineitem
				let uploaddata = {...timelineitem,...otherdata}
				// 开始拒绝
				uniCloud.callFunction({
					name: 'wishlisttimeline',
					data: {
						type: 'refuse',
						info: uploaddata
					}
				})
				.then(res => {
					if(res) {
						// 拒绝成功 手动将状态数据变更
						timelineitem.refuseReason = uploaddata.refuseReason
						timelineitem.refuseUser = uploaddata.refuseUser
						timelineitem.type = 5
						_this.wishinfo.achieveFlag = 0
						
						// 清空拒绝理由 隐藏弹出框
						_this.refuseReason = ''
						_this.ifshowmodal = false
						// 更新心愿列表数据
						uni.$emit('updatewishlist')
						
					}
					else{
						uni.showToast({
							title: _this.i18n.error.loaderror,
							icon: 'none'
						});
					}
				})
				.catch(error => {
					// 拒绝失败
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 同意时间轴商品发现
			agreetimeline(timelineitem) {
				
				uni.showModal({
					content: _this.i18n.tip.optionconfirm,
					showCancel: true,
					cancelText: _this.i18n.base.cancel,
					confirmText: _this.i18n.base.confirm,
					success: res => {
						if(res.confirm) {
							
							// 开始同意操作
							let uploaddata = {
								_id: timelineitem._id,
								agreeUser: _this.user,
								wishId: timelineitem.wishId
							}
							uniCloud.callFunction({
								name: 'wishlisttimeline',
								data: {
									type: 'agree',
									info: uploaddata
								}
							})
							.then(res => {
								if(res) {
									// 同意成功 刷新当前数据
									_this.loaddetaildata()
									_this.loadtimelinedata()
									
									// 更新心愿列表数据
									uni.$emit('updatewishlist')
									
								}
								else{
									uni.showToast({
										title: _this.i18n.error.loaderror,
										icon: 'none'
									});
								}
							})
							.catch(error => {
								// 同意失败
								uni.showToast({
									title: _this.i18n.error.loaderror,
									icon: 'none'
								});
							})
							
						}
					},
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
		
		.addbtn{
			position: fixed;
			z-index: 700;
			width: 100rpx;
			height: 100rpx;
			bottom: 20rpx;
			left: 50%;
			transform: translate(-50%);
		}

	}
	
</style>
