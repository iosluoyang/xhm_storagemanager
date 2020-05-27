<template>
	<view class="goodsdetailview">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue" isBack>
			<block slot="content">{{i18n.nav.goodsdetail}}</block>
		</cu-custom>
		
		<!-- 轮播图 -->
		<template>
			<!-- 普通轮播图 -->
			<swiper v-if="swiperData && swiperData.length < 3" class="screen-swiper square-dot" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500">
				<swiper-item v-for="(item,index) in swiperData" :key="index" @tap.stop="previewimg(index)">
					<image :src="item" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
			<!-- 卡片轮播图 -->
			<swiper v-if="swiperData && swiperData.length > 2" class="card-swiper round-dot bg-gray" :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" @change="changeSwiper" indicator-color="#8799a3"
			 indicator-active-color="#0081ff">
				<swiper-item v-for="(img,index) in swiperData" :key="index" :class="swiperindex==index?'cur':''" @tap.stop="previewimg(index)">
					<view class="swiper-item">
						<image :src="img" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</template>
		
		<!-- 商品信息区域 -->
		<view v-if="product" class="goodsinfoview padding bg-white">
			
			<!-- 商品名称价格和简介 -->
			<view class="padding solid-bottom">
				<view class="goodstitleview t_threeline text-xxl text-black margin-bottom">{{product.title}}</view>
				<view class="goodspriceview text-red text-xl margin-bottom">{{ selectspecinfo ? selectspecinfo.salePrice : product.price }}</view>
				<view class="goodsdesview text-df">{{product.productIntro}}</view>
			</view>
			
			<!-- 商品其他信息展示 -->
			<view class="cu-list menu solid-bottom">
				
				<!-- 分类(仅展示) -->
				<view class="cu-item">
					<view class="content">
						<text class="cuIcon-tagfill text-orange margin-right-xs"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodstype}}</text>
					</view>
					<view class="action">
						<view class="cu-tag round bg-orange light">{{ `${product.firstTypeName}${product.subTypeName ? ' / ' + product.subTypeName : '' }`}}</view>
					</view>
				</view>
				
				<!-- 标识码(仅展示) -->
				<view class="cu-item arrow" v-if="product.barCode && product.barCode.length > 0" @tap.stop="checkqrcode">
					<view class="content">
						<text class="cuIcon-qrcode text-brown margin-right-sm"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodsbarcode}}</text>
					</view>
					<view class="action">
						<text class="cuIcon cuIcon-qr_code"></text>
					</view>
				</view>
				
				<!-- 规格展示(可选择) -->
				<!-- <view class="cu-item arrow" @tap.stop="previewspec">
					<view class="content">
						<text class="cuIcon-sort text-blue margin-right-xs"></text>
						<text class="text-black">{{i18n.goods.handlegoods.goodsspec}}</text>
					</view>
					
					<view class="action">
						<text class="text-gray text-df">{{ showspecstr ? showspecstr : i18n.base.select }}</text>
					</view>
				</view> -->
				
			</view>
			
			<!-- 展示商品的所有规格 -->
			<view class="specsview padding flex flex-direction solid-bottom">
				
				<text class="spectitle text-xl text-bold margin-bottom">{{i18n.goods.handlegoods.goodsspec}}:</text>
				
				<view v-if="product && product.specs && product.specs.length > 0" class="allspecview flex flex-wrap align-center">
					<view class="cu-tag round padding xl margin-bottom-sm" v-for="(specitem, index) in product.specs" :key="index" 
							:class="[ selectspecinfo && specitem.specId === selectspecinfo.specId ? 'bg-blue' : 'line-grey' ]"
							@tap.stop="selectspecinfo = specitem"
					>
						{{ specitem.attributeList.map((attributeitem) => {return attributeitem.attributeValue}).join('、') }}
						
					</view>
				</view>
				
			</view>
			
			<!-- 价格展示  仅超级管理员可以看到 -->
			<view v-if="user.type === 0 && priceList && priceList.length > 0" class="priceshowview bg-white padding solid-bottom">
				<view class="flex align-center justify-between">
					<text class="text-xl text-bold margin-right-sm">{{ i18n.goods.pricestr }}:</text>
					<button class="cu-btn radius sm cuIcon-edit" @tap.stop="jumptofixprice">
						<text class="margin-left-sm">{{ i18n.base.fix }}</text>
					</button>
					<!-- <view class="cu-tag radius bg-grey" @tap.stop="jumptofixprice">{{ i18n.base.fix }}</view> -->
				</view>
				<view class="grid col-2 text-center">
					<view class="padding flex flex-direction" v-for="(priceitem, index) in priceList" :key="index">
						<!-- 价格标题 -->
						<text class="text-df text-light text-grey margin-bottom">{{priceitem.pricetitle}}</text>
						<!-- 价格数值 -->
						<text class="text-bold text-xl" :class="priceitem.pricecolor">{{priceitem.price}}</text>
					</view>
				</view>
			</view>
			
			<!-- 最近的出入库记录 -->
			<view class="stockrecordview bg-white padding">
				
				<view class="stockstr text-xl">
					<text class="text-bold text-black">{{ i18n.goods.goodsdetail.stockrecord }}</text>
					<text class="text-light margin-left">( {{ i18n.goods.stock }}: {{  selectspecinfo.stockCount }})</text>
				</view>
				
				<view v-if="computedstockrecord && computedstockrecord.length > 0" class="cu-timeline margin-top">
					
					<block v-for="(recorditem, index) in computedstockrecord" :key="index">
						
						<!-- 操作时间 -->
						<view class="cu-time">{{ recorditem.createDate.substr(-14) }}</view>
						
						<view class="cu-item" :class="[ recorditem.flag === 0 ? 'cuIcon-roundright text-blue' : 'cuIcon-pullleft text-green' ]">
							<view class="content shadow-blur text-light" :class="[ recorditem.flag === 0 ? 'bg-gradual-blue' : 'bg-gradual-green' ]">
								<text class="text-bold">【{{ recorditem.flag === 0 ? i18n.stock.stockin : i18n.stock.stockout }}】</text>
								<!-- xxx 出库了 商品A 100个 -->
								<text class="margin-right-sm">{{ `${recorditem.realName} (${recorditem.account})` }}</text>
								<text class="margin-right-sm">{{ `${recorditem.flag === 0 ? i18n.stock.stockin : i18n.stock.stockout}` }}</text>
								<text class="margin-right-sm ">{{ `${recorditem.title} (${recorditem.specInfo.specName})` }}</text>
								<text>{{ `${recorditem.stockCount}` }}</text>
								<!-- <text>{{ `${recorditem.customerInfo.name}` }}</text> -->
							</view>
						</view>
					</block>
					
				</view>
			
			</view>
			
		</view>
		
		<!-- 底部操作按钮区域 -->
		<view class="optionview cu-bar btn-group bg-white">
			<button class="bg-grey lg round cu-btn" @tap.stop="editgoods">{{i18n.base.edit}}</button>
			<button class="bg-gradual-green lg round cu-btn" @tap.stop="jumptostockmanage">{{i18n.nav.stock}}</button>
		</view>
		
		<!--底部规格选择层-->
		<!-- <goodsspecselector  v-if="pid"
							ref="goodspecselector"
							:pid="pid"
							mykey="goodsdetail"
							:defaultselectattributeIds="selectattributeIdArr" 
							:ifshowpopup="ifshowpopup"
							@confirmselectspecinfo="confirmselectspec"
							@hidepopup="ifshowpopup = false">
		</goodsspecselector> -->		
		
		<!-- 商品二维码弹出框 -->
		<view class="cu-modal" :class="ifshowqrcode?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view v-if="product" class="content text-cut">{{product.title}}</view>
					<view class="action" @tap.stop="ifshowqrcode=false">
						<text class="cuIcon-close text-black"></text>
					</view>
				</view>
				
				<view v-if="product" class="padding-xl qrimg flex justify-center">
					<uni-qrcode cid="proqrimg" ref="proqrimg" makeOnLoad :text=" $basejs.storeName() + product.barCode " @makeComplete="getqrcodeimgpath" />
				</view>
				
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						
						<button class="cu-btn line-green text-green" @tap.stop="ifshowqrcode=false">{{i18n.base.cancel}}</button>
						
						<!-- 暂时屏蔽打印功能 -->
						<!-- <button class="cu-btn bg-green margin-left" @tap.stop="printqrcode">{{i18n.base.print}}</button> -->
						
						<!-- 非H5平台且有下载链接时下才有下载按钮 -->
						<!-- #ifndef H5 -->
						<button v-if="qrcodesrc" class="cu-btn bg-green margin-left" @tap.stop="downloadqrcode">{{i18n.base.download}}</button>
						<!-- #endif -->
						
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	var _this
	var recordlistcount = 3 // 获取最近3条的出入库记录
	
	import goodstypepicker from '@/components/base/goodstypepicker.vue'
	import goodsspecselector from '@/components/base/goodsspecselector.vue'
	import uniQrcode from '@/components/uni-qrcode/uni-qrcode.vue' // 二维码生成器
	
	export default {
		
		components: {
			goodstypepicker,
			goodsspecselector,
			uniQrcode,
			
		},
		
		data() {
			return {
				pid: null, // 商品主键id
				product: null, // 商品详情数据
				stockrecordlist: null, // 商品出入库记录列表
				
				swiperindex: 0, // 轮播图的索引
				swiperData: null, // 轮播图数据
				
				selectattributeIdArr: [], // 默认选中的属性id数组
				recordselectattributeIdArr: [], // 记录当前已经选中的属性id数组  刷新时数据用
				
				selectspecinfo: null, // 当前选中的规格对象
				showspecstr: null, // 当前选中的规格名称文本
				ifshowpopup: false, // 是否显示底部规格弹框  默认为否不显示
				
				ifshowqrcode: false, // 是否显示商品二维码弹出框  默认为否不显示
				qrcodeval: '', // 二维码的内容
				qrcodesrc: null, // 当前二维码图片的本地链接
				
			};
		},
		
		onLoad(option) {
			
			_this = this
			
			let pid = option.pid
			_this.pid = pid
			
			// 加载商详信息
			_this.loaddetaildata()
			
			uni.$on('updateprodetail', function(){
				// 加载商详信息
				_this.loaddetaildata()
			})
			
		},
		
		onUnload() {
			uni.$off('updateprodetail')
		},
		
		computed: {
			
			// 计算当前选中的规格价格数组
			priceList() {
				
				// 当前选中规格
				let selectspecinfo = this.selectspecinfo
				
				// 如果没有选中规格则返回空
				if(!selectspecinfo) {
					return []
				}
				// 如果有选中的规格则组装数据
				else {
					
					// 平台售价
					let salepriceitem = {
						pricetype: 'salePrice',
						pricetitle: this.i18n.goods.price,
						pricecolor: 'text-red',
						price: selectspecinfo.salePrice || '***'
					}
					
					// 代理价
					let agentpriceitem = {
						pricetype: 'agentPrice',
						pricetitle: this.i18n.goods.agentprice,
						pricecolor: 'text-black',
						price: selectspecinfo.agentPrice || '***'
					}
					
					// 授信价
					let creditpriceitem = {
						pricetype: 'creditPrice',
						pricetitle: this.i18n.goods.creditprice,
						pricecolor: 'text-black',
						price: selectspecinfo.creditPrice || '***'
					}
					
					// 成本价
					let costpriceitem = {
						pricetype: 'costPrice',
						pricetitle: this.i18n.goods.costprice,
						pricecolor: 'text-black',
						price: selectspecinfo.costPrice || '***'
					}
					
					let priceList = [salepriceitem, agentpriceitem, creditpriceitem, costpriceitem]
					return priceList
					
				}
			},
			
			// 计算出来的库存记录列表数据
			computedstockrecord() {
				
				let selectspecinfo = this.selectspecinfo
				
				if(!selectspecinfo) {
					return this.stockrecordlist
				}
				else {
					
					if(this.stockrecordlist && this.stockrecordlist.length > 0) {
						let computedstockrecord = this.stockrecordlist.filter((recorditem) => {
							return recorditem.specInfo.specId === selectspecinfo.specId
						})
						return computedstockrecord
					}
					else{
						return []
					}
					
				}
				
			},
			
		},
		
		methods: {
			
			// 加载商详信息
			loaddetaildata() {
				
				_this.$api.goodsapi.getgoodsdetail({pid: _this.pid}).then(response => {
					// 获取详情成功
					let product = response.data.product
					_this.product = product
					
					// 处理轮播数据
					let swiperData = []
					if(product.imgs){
						let imgsArr = product.imgs.split(',')
						imgsArr.forEach(imgurl => {
							let fullimgurl = _this.imgUrl + imgurl
							swiperData.push(fullimgurl)
						})
					}
					if(swiperData.length > 0) {_this.swiperData = swiperData}
					
					// 如果存在已选规格则更新该规格数据
					if(_this.selectspecinfo) {
						let newselectspecinfo =  product.specs.find((specitem) => {
							return specitem.specId === _this.selectspecinfo.specId
						})
						_this.selectspecinfo = newselectspecinfo
					}
					// 如果没有选中的话则默认选中第一个规格数据
					else if(product.specs && product.specs.length > 0){
						_this.selectspecinfo = product.specs[0]
					}

					// 计算商品的价格
					_this.calculateproductprice()
					
					// 获取出入库记录
					_this.getstockrecord()
					
				}).catch(error => {
					// 获取详情失败
					uni.showToast({
						title: _this.i18n.error.loaderror,
						icon: 'none'
					});
				})
				
			},
			
			// 获取最近的出入库记录
			getstockrecord() {
				let data = {
					pageSize: recordlistcount,
					barCode: _this.product.barCode,
				}
				this.$api.stockapi.getstockrecord(data).then(response => {
					// 获取记录成功
					let recordlist = response.data.list
					this.stockrecordlist = recordlist
					
				}).catch(error => {
					uni.showToast({
						title: this.i18n.error.loaderror,
						icon: 'none'
					});
				})
			},
			
			// 获取随机背景颜色
			getrandombgcolor() {
				// 随机背景颜色
				let colorlist = ['bg-green', 'bg-red', 'bg-grey', 'bg-blue', 'bg-cyan']
				let random = Math.floor(Math.random() * (colorlist.length - 0) ) + 0
				let randomcolor = colorlist[random]
				return randomcolor
			},
			
			// 计算商品价格
			calculateproductprice() {
				
				let product = _this.product
				
				// 处理商品价格数据 展示区间价格
				let specs = product.specs
				let maxprice = Math.max.apply(Math, specs.map(function(specinfo) {return specinfo.salePrice}))
				let minprice = Math.min.apply(Math, specs.map(function(specinfo) {return specinfo.salePrice}))
				let showproductprice = maxprice === minprice ? `${minprice}` : `${minprice} ~ ${maxprice}`
				product.price = showproductprice
				
			},
			
			// 滑动轮播图
			changeSwiper(e) {
				let swiperindex = e.detail.current
				_this.swiperindex = swiperindex
			},
			
			// 查看大图
			previewimg(index) {
				uni.previewImage({
					urls: _this.swiperData,
					current: index
				})
			},
			
			// 更改商品分类
			selecttypeconfirm(selecttypeinfo) {
				let firstTypeId = selecttypeinfo.firstTypeId
				let secondTypeId = selecttypeinfo.secondTypeId
				
				console.log(`当前选中的商品分类为:${firstTypeId}---${secondTypeId}`);
				
			},
			
			// 查看商品二维码
			checkqrcode() {
				// 开始显示商品二维码信息
				this.ifshowqrcode = true
			},
			
			// 获取二维码图片链接
			getqrcodeimgpath(qrimgpath) {
				_this.qrcodesrc = qrimgpath
			},
			
			// 打印商品二维码
			printqrcode() {
				console.log(`开始打印二维码`);
			},
			
			// 下载商品二维码
			downloadqrcode() {
				// 当前二维码链接
				let qrcodesrc = this.qrcodesrc
				uni.saveImageToPhotosAlbum({
					filePath: qrcodesrc,
					success: function () {
						uni.showToast({
							title: _this.i18n.tip.savesuccess,
							icon: 'success',
							duration: 1500
						});
					},
					fail: function(error) {
						uni.showToast({
							title: _this.i18n.base.fail,
							icon: 'none',
							duration: 1500
						});
					}
				});
			},
			
			// 预览规格
			previewspec() {
				_this.ifshowpopup = true
			},
			
			// 选择完某个库存规格
			confirmselectspec(info) {
				
				// 当前选择的库存
				let selectspecinfo = info.specinfo
				this.selectspecinfo = selectspecinfo
				
				// 当前规格文本
				let showspecstr = info.showspecstr
				this.showspecstr = showspecstr
				
				// 记录当前已选的属性
				let selectattributeIds = info.selectattributeIds
				this.recordselectattributeIdArr = selectattributeIds
				
			},
			
			// 跳转修改价格页面
			jumptofixprice() {
				uni.navigateTo({
					url: `/pages/goods/handlepriceandstock?pid=${_this.pid}`
				});
			},
			
			// 编辑商品
			editgoods() {
				uni.navigateTo({
					url: `/pages/goods/handlegoods?type=edit&pid=${this.pid}`
				});
			},
			
			// 出入库操作
			jumptostockmanage() {
				
				// 跳转出入库操作页面
				uni.navigateTo({
					url: `/pages/stock/handlestock?pid=${_this.pid}&specId=${this.selectspecinfo ? this.selectspecinfo.specId :null}`
				});
				
			}
		},
	}
</script>

<style lang="scss" scoped>
	page{
		
	}
	.goodsdetailview{
		
		padding-bottom: 60px;
		
		.optionview{
			position: fixed;
			z-index: 20;
			left: 0;
			right: 0;
			bottom: 0;
		}

	}
</style>
