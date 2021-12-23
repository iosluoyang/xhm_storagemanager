<template>
	<view class="pagecontent">
		
		<!-- 自定义导航栏 -->
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">{{i18n.nav.addressmanage}}</block>
		</cu-custom>
		
		<!-- 其他的内容视图 -->
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" collection="address" where="creatUid == $cloudEnv_uid" orderby="updateTime desc">
			<view v-if="error">{{error.message}}</view>
			<view v-else>
				<u-cell-group :border="false">
					<u-cell-item v-for="(item,index) in data" :key="item._id" :arrow="false">
						
						<view slot="title" class="titleview">
							
							<view class="titleview flex align-center">
								<text class="text-black text-bold text-df">{{ item.name }}</text>
								
								<view class="cu-capsule round margin-left">
									
									<view class="cu-tag bg-gradual-blue">
										<text class="cuIcon-deliver_fill"></text>
									</view>
									<view class="cu-tag">{{ item.shippingCode }}</view>
								</view>
								
							</view>
							
						</view>
						
						<view slot="label" class="padding-right margin-top">
							<text class="addresscontent text-sm text-grey">{{ item.address }}</text>
							<text v-if="item.ifDefault" class="margin-left-sm tagview cu-tag sm round bg-grey">{{ i18n.base.default }}</text>
							<text v-if="item.alias" class="margin-left-sm tagview cu-tag sm round bg-blue">{{ item.alias }}</text>
						</view>
						
						<view slot="right-icon" class="editview text-lg">
							<text class="cuIcon cuIcon-edit text-gray" @tap.stop="jumpToAddressHandle(item)"></text>
						</view>
						
					</u-cell-item>
				</u-cell-group>
			</view>
			<view v-if="loading" class="cu-load loading"></view>
		</unicloud-db>
		
		<button class="operabtn cu-btn bg-blue lg" @tap.stop="jumpToAddressHandle()">{{ i18n.base.add }}</button>
		
	</view>
</template>

<script>
	
	var _this
	
	export default {
		
		components: {
			
		},
		
		data() {
			return {
				
			}
		},
		
		// 页面加载后
		onLoad() {
			_this = this
			uni.$on('updateaddresslist', function() {
				// 刷新地址列表
				_this.$refs.udb.refresh()
			})
		},
		
		onUnload() {
			uni.$off('updateaddresslist')
		},
		
		methods: {
			
			// 跳转地址管理详情页面
			jumpToAddressHandle(addressitem) {
				if(addressitem) {
					uni.navigateTo({
						url: `/pages/me/addresslisthandle?type=edit&id=${addressitem._id}`
					});
				}
				else {
					uni.navigateTo({
						url: '/pages/me/addresslisthandle?type=add'
					});
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	
	$operabtnheight: 50px;
	
	.pagecontent {
		padding-bottom: $operabtnheight;
		.operabtn{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: $operabtnheight !important;
			line-height: $operabtnheight !important;
		}
	}
	
</style>
