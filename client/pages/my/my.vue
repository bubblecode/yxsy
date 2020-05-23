<template>
	<view class="content">
		<uni-list>
			<uni-list-item>
				<view @tap="login()" style="display: flex;align-content: center; padding: 15rpx;">
					<image :src="fig" mode="widthFix" class="figure"></image>
					<view class="uname">
						<view>{{username}}</view>
					</view>
				</view>
			</uni-list-item>
		</uni-list>
		<uni-grid :column="4" borderColor="#FFFFFF" style="background-color: #FFF; margin-top: 20rpx;" @change="order_list">
			<uni-grid-item :index="0">
				<view style="display: flex; flex-wrap: wrap; justify-content: center;">
					<image src="../../static/icon/dingdan.png" style="width: 90rpx;height: 90rpx; margin-top: 30rpx;"></image>
					<text class="text">全部订单</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="1">
				<view style="display: flex; flex-wrap: wrap; justify-content: center;">
					<image src="../../static/icon/yizhifudingdan.png" style="width: 90rpx;height: 90rpx; margin-top: 30rpx;"></image>
					<text class="text">已支付</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="2">
				<view style="display: flex; flex-wrap: wrap; justify-content: center;">
					<image src="../../static/icon/yichuli.png" style="width: 90rpx;height: 90rpx; margin-top: 30rpx;"></image>
					<text class="text">已处理</text>
				</view>
			</uni-grid-item>
			<uni-grid-item :index="3">
				<view style="display: flex; flex-wrap: wrap; justify-content: center;">
					<image src="../../static/icon/daipingjia.png" style="width: 90rpx;height: 90rpx; margin-top: 30rpx;"></image>
					<text class="text">待评价</text>
				</view>
			</uni-grid-item>
		</uni-grid>
		<view class="setting"> 
			<uni-list>
				<uni-list-item @click="jumpTo('../myFavorite/myFavorite')">我的收藏</uni-list-item>
				<uni-list-item @click="jumpTo('../history/history')">浏览历史</uni-list-item>
				<uni-list-item @click="jumpTo('../record/record')">退款记录</uni-list-item>
			</uni-list>
		</view>
		<view class="setting">
			<uni-list>
				<uni-list-item @tap="setting()">设置</uni-list-item>
				<uni-list-item :showArrow="false" @tap="chk_update()">检查更新</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>
<style>
	page {
		background-color: #E5E5E5;
	}
	.text {
		font-size: 30rpx;
		color: gray;
		margin-left: 20rpx;
	}
	.content {
		overflow: hidden;
	}
	.setting {
		margin-top: 50rpx;
	}
	.uname {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		margin: 20rpx;
		font-size: 40rpx;
	}
	.figure {
		min-width: 100rpx;
		min-height: 100rpx;
		max-width: 100rpx;
		max-height: 100rpx;
		border: 1px solid gray;
		border-radius: 50%;
	}
</style>
<script>
	export default {
		data() {
			return {
				fig: "../../static/fig.png",
				username: "未登录",
			}
		},
		methods: {
			jumpTo(url) {
				uni.navigateTo({
					url: url
				});
			},
			login() {
				uni.navigateTo({
					url:"../information/information"
				});
			},
			setting() {
				uni.navigateTo({
					url: "../my-setting/my-setting"
				})
			},
			chk_update() {
				uni.showToast({
					mask:true,
					title: "暂无更新",
				})
			},
			order_list(obj) {
				var url = "";
				switch(obj.detail.index) {
					case 0:
						url = "../order_all/order_all";break;
					case 1:
						url = "../order_paid/order_paid";break;
					case 2:
						url = "../order_processed/order_processed";break;
					case 3:
						url = "../order_comment/order_comment";break;
				}
				uni.navigateTo({
					url: url
				});
			}
		},
		onShow() {
			if(uni.getStorageSync("isLogin") == 'true') {
				uni.request({
					url:"http://120.27.208.220/my",
					method: "POST",
					dataType: "JSON",
					data: {
						phone: uni.getStorageSync("loginPhone")
					},
					success: res => {
						this.fig = res.data.figPath + "?" + (new Date()).valueOf();
						this.username = res.data.username;
					}
				})
			}
		}
	}
</script>


