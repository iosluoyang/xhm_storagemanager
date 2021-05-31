<template>
	<view class="ov">
		<view class="main" :style="'width:'+(flag?(data.ArrC.length):(data.ArrC.length+1))*200+'px;'">
			<view class="xiugai">
				<view class="xiugai_btn" :style="flag?'':'background:red'" @click="xiugai()">{{flag?'修改':'保存'}}</view>
			</view>
			<view class="main_cen center">
				<view class="cen_lei">
					
					<!-- 标题头 -->
					<view class="cen_button_A" @click="kongzhi(false)">
						<input style="font-weight: 400;" v-model="data.title" :disabled="flag" placeholder="请输入内容" />
						<em class="center-x"  v-if="dataFlag.title"></em>
					</view>
					
					<!-- 标题分割线 -->
					<view class="cen_xian"  v-if="dataFlag.title" :style="'width:'+(flag?(data.ArrC.length-1):(data.ArrC.length))*200+'px;'"></view>
					
					<!-- 一级目录 -->
					<view class="cen_fenban_box" :style="'width:'+(flag?(data.ArrC.length):(data.ArrC.length+1))*200+'px;'"  v-if="dataFlag.title">
						<view class="cen_fenban" v-for="(item,i) in data.ArrC" :key="i" @click="kongzhi(true,i)">
							<view class="contentview">
								<uni-file-picker 
									v-model="item.img"
									:disabled="flag"
									:disable-preview="flag"
									limit="1" 
									:del-icon="false" 
									disable-preview 
									:imageStyles="imageStyles" 
									file-mediatype="image"
									returnType="object"
									@select="fileselect($event, i)" 
									@success="filesuccess($event, i)"
								></uni-file-picker>
								
								<input class="margin-top-sm" type="text" v-model="item.title" :disabled="flag" placeholder="请输入内容" />
							</view>
							<em class="center-x"></em>
							<text v-if="!flag" class="delbtn cuIcon cuIcon-deletefill text-red" @click="delChild(data.ArrC,i)"></text>
						</view>
						<view class="cen_fenban" style="cursor: pointer;" @click="addItem()" v-if="!flag">
							<text>+</text>
							<em class="center-x"></em>
						</view>
					</view>
					
					<!-- 次级目录 -->
					<view class="clearfix" v-if="dataFlag.title">
						<view class="cen_fenban_child" v-for="(item,i) in data.ArrC" :key="i" >
							
							<view class="cen_fenban_child_leftX" v-show="dataFlag.child[i]" v-if="!item.child.length==0||!flag" :style="'height:'+(((flag?(item.child.length):(item.child.length+1))*110))+'px;'"></view>
							<view class="cen_fenban_child_box padding-sm" v-show="dataFlag.child[i]" v-for="(child,n) in item.child" :key="n">
								
								<view class="flex align-center">
									<text class="cuIcon cuIcon-infofill text-black"></text>
									<input class="borderCDCDCD margin-left-sm" type="text" v-model="child.title" placeholder="请输入内容" :disabled="flag" />
								</view>
								
								<view class="flex align-center margin-top-sm">
									<text class="cuIcon cuIcon-moneybagfill text-red"></text>
									<input class="borderCDCDCD margin-left-sm" type="number" v-model="child.price" :disabled="flag" />
								</view>
								
								<view class="flex align-center margin-top-sm">
									<text class="cuIcon cuIcon-cartfill text-blue"></text>
									<input class="borderCDCDCD margin-left-sm" type="number" v-model="child.stock" :disabled="flag" />
								</view>
								
								<em class="center-y"></em>
								<text v-if="!flag" class="delbtn cuIcon cuIcon-deletefill text-red" @click="delChild(item.child,n)"></text>
							
							</view>
							<view style="cursor: pointer;" class="cen_fenban_child_box" @click="addChild(i)" v-if="!flag">
								<text>+</text>
								<em class="center-y"></em>
							</view>
							
						</view>
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
				flag: true,
				data: {},
				oldData: {},
				dataFlag: {
					title: true,
					child: []
				},
				imageStyles: {
					width: '50px',
					height: '50px',
					borderRadius: '8px'
				}
			}
		},
		props: {
			serverData: {}
		},
		watch: {
			data(newdata) {
				this.upflag()
			},
			flag(newdata){
				if(!newdata){
					this.upflag()
				}
			}
		},
		created() {
			let data = this.$props.serverData
			data.ArrC.forEach(item => {
				item.img = {url: item.img}
			})
			console.log(data);
			this.data = data
		},
		methods: {
			upflag(){
				let arr = [];
				for (let i in this.data.ArrC) {
					arr.push(true)
				}
				this.dataFlag.child = arr;
			},
			kongzhi(item, i) {
				if(this.flag){
					if (item) {
						this.$set(this.dataFlag.child, i, !this.dataFlag.child[i])
					} else {
						this.$set(this.dataFlag, 'title', !this.dataFlag.title)
					}
				}
			},
			delChild(n, i) {
				n.splice(i, 1)
			},
			xiugai() {
				let content = "";
				let that = this;
				if (this.flag) {
					content = '点击需要修改的地方，即可输入修改';
					this.oldData = JSON.parse(JSON.stringify(that.data));
				} else {
					content = '您确定要保存吗？'
				}
				uni.showModal({
					title: '系统提示',
					content,
					showCancel: !that.flag,
					success(res) {
						if (!that.flag) {
							if (res.confirm) {	
								that.$emit('dataChange', that.data)
							} else {
								that.data = { ...that.oldData }
							}
						}
						that.flag = !that.flag;
					}
				})
			},
			addItem() {
				this.data.ArrC.push({
					title: '',
					img: {url: ''},
					child: [
						{
							title: '',
							price: '',
							stock: ''
						}
					]
				})
				this.data = JSON.parse(JSON.stringify(this.data));
			},
			addChild(i) {
				this.data.ArrC[i].child.push({
					title: '',
					price: '',
					stock: ''
				})
				this.data = JSON.parse(JSON.stringify(this.data));
			},
			// 选择图片成功
			fileselect(e,i) {
				console.log(`图片选择成功`);
				let tempFile = e.tempFiles[0]
				// 更新当前的图片数据
				let currentItem = this.data.ArrC[i]
				currentItem.img = tempFile
			},
			
			// 图片删除
			filedelete(e) {
				console.log(`图片删除成功`);
			},
			
			// 图片上传
			fileprogress(e) {
				console.log(`上传图片中`);
				console.log(e);
			},
			
			// 上传图片成功
			filesuccess(e,i) {
				console.log(`上传图片成功,`);
				console.log(e);
				let tempFile = e.tempFiles[0]
				// 更新当前的图片数据
				let currentItem = this.data.ArrC[i]
				currentItem.img = {url: tempFile.url}
				console.log(currentItem);
			},
			
			// 上传图片失败
			filefail(e) {
				// 上传图片失败
				console.log(`上传图片失败`);
				console.log(e);
			},
		}
	}
</script>

<style scoped>
	.clearfix:after {
		content: "";
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
	}

	.ov {
		overflow: scroll;
	}

	.clearfix {
		/* *zoom: 1; */
	}

	.main {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto;
		/* overflow-x: scroll; */
	}

	.main_nav {
		width: 100%;
		line-height: 50px;
		transform: translateY(-100%);
		position: absolute;
		color: #707070;
	}

	.main_nav button {
		float: right;
		border-radius: 0px;
		border: 0px;
		box-shadow: 2px 2px 4px #909193;
	}

	.main_cen {}

	.cen_lei {
		padding: 50px 30px;
	}

	.cen_button_A {
		background-color: #5c6a7c;
		box-shadow: 0 0 5px #5c6a7c;
		padding: 0 20px;
		color: #FFFFFF;
		line-height: 60px;
		position: relative;
		display: inline-block;
		margin-left: 50%;
		transform: translateX(-50%);
		width: 200px;
		text-align: center;
		font-size: 16px;
		font-weight: 900;
	}

	.cen_button_A input {
		height: 60px;
		width: 100%;
	}

	.cen_button_A>em {
		position: absolute;
		width: 1px;
		height: 10px;
		background-color: #b4de8a;
		bottom: 0;
		transform: translate(-50%, 120%);
	}

	.cen_xian {
		height: 1px;
		background-color: #b4de8a;
		width: 10px;
		transform: translateY(12px);
		margin: 0 auto;
	}

	.xiugai {
		width: 100vw;
		line-height: 30px;
		position: absolute;
		top: 20px;
		right: 0;
	}

	.xiugai_btn {
		display: inline-block;
		width: 80px;
		text-align: center;
		float: right;
		border-radius: 30px;
		cursor: pointer;
		background-color: #52BF8A;
		color: #FFFFFF;
	}

	.cen_fenban_box {
		margin-top: 24px;
		height: 40px;
	}

	.cen_fenban {
		width: 160px;
		height: 80px;
		text-align: center;
		background-color: #52BF8A;
		float: left;
		color: #FFFFFF;
		margin: 0 20px;
		box-shadow: 2px 2px 4px #909193;
		position: relative;
	}
	


	.cen_fenban>text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: block;
	}

	.cen_fenban_child {
		width: 160px;
		float: left;
		margin: 0 20px;
		padding-bottom: 10px;
	}

	.cen_fenban_child_leftX {
		width: 1px;
		background-color: #aaa;
		margin-left: 20px;
		float: left;
	}

	.cen_fenban_child_box {
		width: 140px;
		/* height: 40px; */
		margin-top: 20px;
		background-color: #FFFFFF;
		color: #707070;
		box-shadow: 2px 2px 6px #909193;
		margin-left: 40px;
		text-align: center;
		position: relative;
		cursor: pointer;
		/* line-height: 40px; */
	}

	.delbtn {
		position: absolute;
		right: -25px;
		top: 50%;
		transform: translateY(-50%);
	}

	.cen_fenban_child_box>em {
		position: absolute;
		width: 20px;
		height: 1px;
		background-color: #AAAAAA;
		left: -20px;
		top: 50%;
	}

	.cen_fenban>em {
		position: absolute;
		width: 1px;
		height: 10px;
		background-color: #b4de8a;
		top: 0;
		transform: translate(-50%, -120%);
	}
</style>
