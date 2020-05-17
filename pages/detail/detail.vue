<template>
	<view>
		<swiper class="swiper">
			<swiper-item>
				<view style="width: 100%;height: 100%;">
					<image :src="buildingInfo.imgPath" style="width: 100%;height: 100%;"></image>
				</view>
			</swiper-item>
		</swiper>
		<view style="background-color: #FEECD8 ;  text-align: center;">
			<image src="../../static/icon/kefu.png" style="width: 50rpx;height: 40rpx;"></image>
			<text style="margin-left: 10rpx; color: #533C1C">联系客服：{{buildingInfo.phone}}</text>
		</view>
		<view class="info">
			<uni-card v-for="(item, i) in roomInfo" :key="i">
				<view style="display: flex;flex-direction: row;">
					<view style="margin-right: 20rpx;">
						<image :src="item.imgPath" style="width: 180rpx;height: 180rpx;"></image>
					</view>
					<view style="display: flex;flex-direction: column;">
						<view>
							<span style="font-weight: bold;">{{item.type}}</span>
							<span style="float: right;color: red;">￥{{item.price}}</span>
						</view>
						<view style="margin-left: auto;margin-right: 0;">
							<span style="font-size: 25rpx;color: gray;">{{item.detail}}</span>
							<button style="display: inline-block; float: right;" @tap="pay(buildingID,item.type,item.price)">预订</button>
						</view>
					</view>
				</view>
			</uni-card>
		</view>
		
		<hr/>
		
		<uni-card title="评论" id="comment">
			<view class="comments" v-for="(item,i) in comments" :key="i">
				<view class="left">
					<image :src="item.figPath"  class="fig"></image>
				</view>
				<view class="comment-content">
					<view class="uname">{{item|username}}</view>
					<view class="comment">
						{{item.comment}}
					</view>
				</view>
			</view>
		</uni-card>
		
	</view>
</template>
<style>

	.fig {
		width: 110rpx;
		height: 110rpx;
		border-radius: 50%;
	}
	.comment {
		font-size: 30rpx;
		min-width: 60rpx; 
		min-height: 60rpx;
	}
	.uname {
		font-size: 35rpx;
		font-weight: bold;
		min-width: 60rpx;
		height: 60rpx;
		line-height: 60rpx;
	}
	.comment-content {
		margin-left: 10rpx;
		display: flex;
		flex-direction: column;
	}
	.comments {
		margin-bottom: 25rpx;
		display: flex;
		flex-direction: row;
	}
</style>
<script>
	export default {
		filters: {
			username: function(item) {  // 匿名用户不显示昵称
				return item.anonymous=='false'?item.name:"匿名用户";
			}
		},
		data() {
			return {
				buildingInfo: {},
				roomInfo: {},
				comments: [],
				buildingID: ""
			}
		},
		methods: {
			pay(buildingID, roomType, price) {
				if(uni.getStorageSync('isLogin') == 'true') {
					uni.navigateTo({
						url: `../pay/pay?buildingID=${buildingID}&type=${roomType}&price=${price}`
					});
				}
			}
		},
		onLoad(obj) {
			this.buildingID = obj.id;
			console.log(obj.id)
			uni.request({
				url: "http://120.27.208.220/detailinfo",
				method: "POST",
				data: {
					id: obj.id
				},
				success: (res) => {
					console.log(res.data)
					this.buildingInfo = res.data.buildingInfo;
					this.roomInfo = res.data.roomInfo;
					this.comments = res.data.comments;
				}
			});
			var history = uni.getStorageSync('history');
			if (history == "") {
				history = []
			}
			if (history.indexOf(obj.id) != -1) {
				history.splice(history.indexOf(obj.id), 1);
			}
			if (history.length > 5) {
				history.pop()
			}
			history.unshift(obj.id);
			uni.setStorageSync('history', history);
		}
	}
</script>

<style>
	swiper {
		display: flex;
	}
</style>
