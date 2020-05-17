<!-- huan -->
<!-- 主页 -->
<template>
	<view class="container">
		<swiper class="swiper" indicator-dots="true" autoplay="true" interval="2000" duration="500">
			<swiper-item>
				<view style="width: 100%; height: 100%;">
					<image src="../../static/carousel/1.jpg" style="height: 100%;width: 100%;"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view style="width: 100%; height: 100%;">
					<image src="../../static/carousel/2.jpg" style="height: 100%;width: 100%;"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view style="width: 100%; height: 100%;">
					<image src="../../static/carousel/3.jpg" style="height: 100%;width: 100%;"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view style="width: 100%; height: 100%">
					<image src="../../static/carousel/5.jpg" style="width: 100%;height: 100%"></image>
				</view>
			</swiper-item>
			<swiper-item>
				<view style="width: 100%; height: 100%">
					<image src="../../static/carousel/4.jpg" style="width: 100%; height: 100%"></image>
				</view>
			</swiper-item>
		</swiper>


		<uni-card class="easy-search-card">
			<view class="header" style="border-bottom: 1px solid #E5E5E5;">
				<view class="district">{{district}}</view>
				<view class="extra" @tap="currentLocation">
					<image src="../../static/icon/icon-test.png" style="width: 40rpx;height: 40rpx;"></image>
					<view>获取定位</view>
				</view>
			</view>
			<br>
			<button type="default" class="easy-search-btn" @tap="easySearch">一键查找附近的自习室</button>
		</uni-card>

		<uni-card>
			<view style="font-size: 35rpx;font-weight: bold;border-bottom: 1px solid #E5E5E5;">猜你喜欢</view>
				<view class="guess-item" v-for="(item,i) in recommandData" :key="i" @tap="jumpTo(item.id)">
					<view>
						<image :src="item.img" class="img"></image>
					</view>
					<view class="detail">
						<view class="detail-name">{{item.name}}</view>
						<view class="detail-address">{{item.address}}</view>
					</view>
				</view>
		</uni-card>
	</view>
</template>

<style>
	.detail-name {
		
	}
	.detail-address {
		color: gray; 
		font-size: 30rpx;
	}
	.detail {
		/* border: 1px dashed #000000; */
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
	}
	.img {
		width: 150rpx;
		height: 150rpx;
		border: 1px solid #EEEEEE;
		background-color: #EEEEEE;
	}
	.guess-item {
		padding: 10rpx;
		margin-top: 30rpx;
		display: flex;
		flex-direction: row;
		border-radius: 8rpx;
		box-shadow: 0px 0px 1px 1px #EEEEEE;
	}

	.district {
		font-weight: bold;
		font-size: 50rpx;
	}

	.extra {
		color: #999;
		font-size: 30rpx;
		display: flex;
	}

	.extra:active {
		color: #007AFF;
	}

	.header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-bottom: 30rpx;
	}

	.easy-search-btn {
		background-color: #78b2e9!important;
		color: #FFFFFF !important;
	}
 
	.easy-search-btn:active {
		color: #EAEEF1 !important;
		background-color: #3a8fe9!important;
	}

	.easy-search-card {
		box-shadow: 1rpx 1rpx 1rpx 1rpx #eee;
	}
</style>

<script>
	import recommandData from '../../common/guess.js'
	export default {
		onReady() {
			
		},
		data() {
			return {
				district: "武汉市",
				recommandData: recommandData.data
			} 
		},
		onLoad: () => {
			if(uni.getStorageSync('isLogin') != 'true') {
				uni.reLaunch({
					url: "../login/login"
				});
			} else {
				
			}
			
		},
		methods: {
			jumpTo(buildingID) {
				console.log(buildingID)
				uni.navigateTo({
					url: `../detail/detail?id=${buildingID}`
				});
			},
			currentLocation() { // 获取当前位置，仅APP可用
				uni.getLocation({
					type: "wgs84",
					geocode: true,
					success: (res) => {
						console.log(res.address.district)
						this.district = res.address.district
					}
				});
			},
			easySearch() {
				uni.navigateTo({
					url: '../search/search?district=' + this.district
				});
			}
		}
	}
</script>

<style>
	.intro {
		font-size: 14px;
		line-height: 24px;
	}
</style>
