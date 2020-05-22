<template>
	<view>
		<view style="text-align: center;width: 100%; color: gray; margin-top: 50%;" v-if="nodata">没有记录</view>
		<uni-card v-else v-for="(item, i) in order" :title="item.name" :extra="item.handle" :key="i">
			<span class="text">类型：{{ item.type }}</span>
			<span style="color: #f00;float: right;">￥{{ item.price }}</span>
			<br>
			<span class="text">地址：{{ item.address }}</span>
			<br> 
			<span style="color: grey; font-size: 30rpx;">预定时间：{{ item['start-time'] }}</span>
		</uni-card>
	</view>
</template>
<style>
	.text {
		font-size: 30rpx;
	}

	.footer-box-item {
		float: right;
		font-size: 40rpx;
		margin-left: 30rpx;
	}

	.footer-box-item:active {
		color: red;
	}
</style>
<script>
	export default {
		onShow() {
			const telphone = uni.getStorageSync('loginPhone');
			uni.request({
				url: 'http://120.27.208.220/order',
				data: {
					telphone
				},
				method: "POST",
				success: (res) => {
					const result = res.data;
					if(result.length == 0) {
						this.nodata = true;
					} else {
						this.nodata = false;
						console.log(result);
						this.order = result.reverse();
					}
				},
			})
		},
		data() {
			return {
				order: [],
				nodata: false
			}
		},
		methods: {
		}
	}
</script>
