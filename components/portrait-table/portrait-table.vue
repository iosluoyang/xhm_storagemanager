<template>
	<view class="table">
		<view class="thead">
			<view 
				:style="{textAlign:align,backgroundColor:titleBg}"
				class="title" 
				v-for="(item, index) in title" 
				:key="index">
				<text>{{ item.label }}</text>
			</view>
		</view>
		<view class="tbody_wrap">
			<view class="tbody">
				<view class="col" v-for="(item, index) in title" :key="index">
					<view class="row flex align-center" 
					:class="[index == 0 ? 'firstCol' : 'baseBg']"
					 v-for="(zItem, zIndex) in tableData" 
					 :key="zIndex">
					 
						<!-- 如果值为是特殊文本例如 input则说明是放置一个input框 -->
						<input v-if=" zItem[item.value] && (zItem[item.value].type === 'input') " 
								class="borderCDCDCD text-sm radius inputitem" 
								:style="{textAlign:align}" 
								:type="zItem[item.value].inputtype" 
								:placeholder="zItem[item.value].placeholder" 
								v-model="zItem[item.value].defaultvalue" 
								confirm-type="next"
								:cursor-spacing="30" />
						<text v-else-if=" zItem[item.value] && (zItem[item.value].type === 'string') " :style="{textAlign:align}">{{ zItem[item.value].value || '-' }}</text>
						
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
		};
	},
	props: {
		tableData: {
			type: Array,
			required: true
		},
		title: {
			type: Array,
			required: true
		},
		align:{
			type:String,
			default:'center'
		},
		titleBg:{
			type:String,
			default:'#fff'
		}
	},
	methods: {},
};
</script>

<style lang="scss">
.table {
	display: flex;
	.thead {
		border-bottom: 1rpx solid #e5e5e5;
		box-shadow: 5rpx 0 5rpx #eee,;
		.title {
			box-sizing: border-box;
			position: relative;
			padding: 0 20rpx;
			min-width: 180rpx;
			height: 88rpx;
			line-height: 88rpx;
			font-size: 24rpx;
			color: #666;
			border: 1rpx solid #e5e5e5;
			border-bottom: none;
			border-right: none;
		}
	}
	.tbody_wrap {
		overflow-x: auto;
		border-right: 1rpx solid #e5e5e5;
		border-bottom: 1rpx solid #e5e5e5;
		.tbody {
			.col {
				display: flex;
			}
			.row {
				box-sizing: border-box;
				padding: 0 20rpx;
				line-height: 88rpx;
				font-size: 24rpx;
				color: #666;
				min-width: 180rpx;
				height: 88rpx;
				border: 1rpx solid #e5e5e5;
				border-bottom: none;
				border-right: none;
			}
		}
	}
}
.baseBg{
	background-color: #fff;
}
.firstCol{
	background-color: #007AFF;
}
</style>
