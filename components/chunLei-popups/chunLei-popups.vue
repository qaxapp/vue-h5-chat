<template>
	<view class="mask" :class="!show?'':'mask-show'" :style="{backgroundColor:show?maskBg:'rgba(0,0,0,0)'}" @tap="tapMask">
		<view class="popups"
			:style="{top: popupsTop ,left: popupsLeft,flexDirection:direction}">
 			<text :class="dynPlace" :style="{width:'0px',height:'0px'}" v-if="triangle"></text>
			
			<view v-for="(item,index) in items" :key="index" @tap.stop="tapItem(item)" 
				class="itemChild view" :class="[direction==='row'?'solid-right':'solid-bottom',item.disabled?'disabledColor':'']">
				<text>{{item.title}}</text>
				<image class="icon-image" :src="item.icon" v-if="item.icon"></image>
			</view>
			<slot></slot>
			
		</view>
		<view class="popups"
			v-if="deleteItem"
			@tap.stop="tapItem(deleteItem)"
			:style="{top: 'calc(' + popupsTop + ' + ' + items.length * 40 + 'rpx' + ' + 4rpx)' ,left: popupsLeft,flexDirection:direction}">
			
			<view class="itemChild view":style="{ justifyContent: deleteItem.icon ? 'space-between' : 'center', color: '#EA0000' }">
				<text>{{deleteItem.title}}</text>
				<image class="icon-image" :src="deleteItem.icon" v-if="deleteItem.icon"></image>
			</view>
			
		</view>
		
		
	</view>
</template>

<script>
	export default{
		props:{
			maskBg:{
				type:String,
				default:'rgba(0,0,0,0)'
			},
			placement:{
				type:String,
				default:'default' //default top-start top-end bottom-start bottom-end 
			},
			direction:{
				type:String,
				default:'column' //column row
			},
			x:{
				type:Number,
				default:0
			},
			y:{
				type:Number,
				default:0
			},
            modelValue:{
				type:Boolean,
				default:false
			},
			popData:{
				type:Array,
				default:()=>[]
			},
			theme:{
				type:String,
				default:'dark' //light dark
			},
			dynamic:{
				type:Boolean,
				default:false
			},
			gap:{
				type:Number,
				default:20
			},
			triangle:{
				type:Boolean,
				default:true
			}
		},
		data(){
			return{
				popupsTop:'0px',
				popupsLeft:'0px',
				show:false,
				dynPlace:'', 
				
			}
		},
		computed: {
			deleteItem() {
				return this.popData.find((item) => item.tag === "deleteRemote");
			},
			items() {
				return this.popData.filter((item) => item.tag !== "deleteRemote");
			}
		},
		mounted() {
			console.log(this.popData)
			this.popupsPosition()
		},
		methods:{
			tapMask(){
				
                this.$emit('update:modelValue', false) // previously was `this.$emit('input', title)`
			},
			tapItem(item){
				if(item.disabled) return
				this.$emit('tapPopup',item)
                this.$emit('update:modelValue', false) // previously was `this.$emit('input', title)`
			},
			getStatusBar(){
				let promise = new Promise((resolve,reject)=>{
					uni.getSystemInfo({
						success: function(e) {
							
							let customBar
							// #ifdef H5
					
							customBar = e.statusBarHeight + e.windowTop;

							// #endif
							resolve(customBar)
						}
					})
				})
				return promise
			},
			async popupsPosition(){
				let statusBar = await this.getStatusBar()
				let promise = new Promise((resolve,reject)=>{
					let popupsDom = uni.createSelectorQuery().in(this).select(".popups")
					popupsDom.fields({
					    size: true,  
					}, (data) => {
						let width = data.width
						let height = data.height
						
						let y = this.dynamic?this.dynamicGetY(this.y,this.gap):this.transformRpx(this.y)
						
						let x = this.dynamic?this.dynamicGetX(this.x,this.gap):this.transformRpx(this.x)
					
						
						// #ifdef H5
						y = this.dynamic?(this.y+statusBar): this.transformRpx(this.y+statusBar)
						// #endif 
						
						this.dynPlace = this.placement=='default'?this.getPlacement(x,y):this.placement
						
						switch(this.dynPlace){
							case 'top-start':
								this.popupsTop = `${y+9}px`
								this.popupsLeft = `${x-15}px`
								break;
							case 'top-end':
								this.popupsTop = `${y+9}px`
								this.popupsLeft = `${x+15-width}px`
								break;
							case 'bottom-start':
								this.popupsTop = `${y-18-height}px`
								this.popupsLeft = `${x-15}px`
								break;
							case 'bottom-end':
								this.popupsTop = `${y-9-height}px`
								this.popupsLeft = `${x+15-width}px`
								break;
						}
						resolve()
					}).exec();
					
				})
				return promise
				
			},
			getPlacement(x,y){
				let width = uni.getSystemInfoSync().windowWidth
				let height = uni.getSystemInfoSync().windowHeight
				if(x>width/2&&y>height/2){
					return 'bottom-end'
				}else if(x<width/2&&y<height/2){
					return 'top-start'
				}else if(x>width/2&&y<height/2){
					return 'top-end'
				}else if(x<width/2&&y>height/2){
					return 'bottom-start'
				}else if(x>width/2){
					return 'top-end'
				}else{
					return 'top-start'
				}
			},
			dynamicGetY(y,gap){
				
				let height = uni.getSystemInfoSync().windowHeight
				y = y<gap?gap:y
				y = height - y <gap? (height - gap) : y
				
				return y
			},
			dynamicGetX(x,gap){
				let width = uni.getSystemInfoSync().windowWidth
				x = x< gap?gap:x
				x = width - x <gap? (width - gap) : x
				return x
			},
			transformRpx(params){
				
				return params*uni.getSystemInfoSync().screenWidth/375
			}
		},
		watch:{
            modelValue:{
				immediate:true,
				handler:async function (newVal,oldVal){
					if(newVal) await this.popupsPosition()
					this.show = newVal
				}
			},
			placement:{
				immediate:true,
				handler(newVal,oldVal){
					this.dynPlace = newVal
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.mask{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9999;
		transition: background 0.3s ease-in-out;
		visibility: hidden;
		
		&.mask-show{
			
			visibility: visible;
		}
	}
	.popups{
		position: absolute;
		padding: 0rpx 20rpx;
		border-radius: 8rpx;
		display:flex;
		background-color: #2E4558;
		.view{
			padding: 10rpx 0;
		}
		
		.icon-image{
			display: inline-block;
			vertical-align: middle;
			width: 20rpx;
			height: 20rpx;
		}
			
	}
	.dark{
		background-color: #0C1822;
		color: #fff;
		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #27292F;
		}
		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #27292F;
		}
		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #27292F transparent transparent ;
			
		}
		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #27292F transparent transparent ;
		}
		.disabledColor{
			color: #F0F5FF;
		}
	}
	.light{
		color: #515a6e;
		box-shadow: 0upx 0upx 30upx rgba(0,0,0,0.2);
		background: #fff;
		.top-start:after {
			content: "";
			position: absolute;
			top: -18rpx;
			left: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}
		.top-end:after {
			content: "";
			position: absolute;
			top: -18rpx;
			right: 10rpx;
			border-width: 0 20rpx 20rpx;
			border-style: solid;
			border-color: transparent transparent #fff;
		}
		.bottom-start:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			left: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #fff transparent transparent ;
			
		}
		.bottom-end:after {
			content: "";
			position: absolute;
			bottom: -18rpx;
			right: 10rpx;
			border-width: 20rpx 20rpx 0 ;
			border-style: solid;
			border-color: #fff transparent transparent ;
		}
		.disabledColor{
			color: #c5c8ce;
		}
	}
	.solid-bottom{
		border-bottom: 1px solid #546E86;
	}
	.solid-right{
		
		border-right: 1px solid #546E86;
	}
	.popups .itemChild {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90rpx;
		height: 40rpx;
		color: white;
		font-size: 12rpx
	}

	.popups .itemChild:last-child{
		border: none;
	}
	
</style>
