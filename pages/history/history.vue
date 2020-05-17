<!-- huan -->
<template>
	<view>
		<view style="text-align: center;width: 100%; color: gray; margin-top: 50%;" v-if="history.length==0">没有记录</view>
		<uni-card v-if="history.length!=0">
			<view class="history-item" v-for="(item, i) in history" @click="detail(item.id)" :key="i">
				<view> <image :src='item.imgPath'  class="img"></image> </view>
				<view class="info">
					<view class="name"> {{ item.name }} </view>
					<view class="time"> {{ item['open-time'] }}  </view>
					<view class="size"> {{ item.address }} </view>
				</view>
			</view>
		</uni-card>
	</view> 
</template>
<style> 
	.size {
		margin-top: 20rpx;
		font-size: 30rpx;
	}
	.time {
		font-size: 30rpx;
		color: #BCBCBC;
	}
	.info {
		margin-left: 30rpx;
	}
	.history-item {
		display: flex;
		flex-direction: row;
	}
	.img {
		width: 150rpx;
		height: 150rpx;
		/* background: red; */
	}
</style> 
<script>
	export default {
		onShow: function() {
			const arr = uni.getStorageSync('history');
			console.log(arr);
			if(arr) {
				uni.request({ 
					url: 'http://120.27.208.220/history',
					data: {
						arr
					},
					method: "POST",
					success: (res) => {
						this.history = res.data;
						console.log(res.data);
						
						for(var i=0; i<res.data.length; i++) {
							console.log(res.data[i]);
						}
					}
				})
			}
		},
		
		data() {
			return {
				history: []
			}
		},
		methods: {
			detail(id) {
				uni.navigateTo({
					url: `../detail/detail?id=${id}`
				});
			}
		}
	}
</script>
