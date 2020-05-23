<template>
	<view>
		<view>
			<uni-list>
				<uni-list-item @click="jumpTO('../information/information')">查看修改个人信息</uni-list-item>
				<uni-list-item @click="jumpTO('../password/password')">修改密码</uni-list-item>
				<uni-list-item :showArrow="false" @click="contentus">联系我们</uni-list-item>
			</uni-list>
		</view>
		<button type="warn" class="signout" @tap="open">退出登录</button>
		<uni-popup ref="popup" type="bottom">
			<uni-list>
				<uni-list-item :showArrow="false" class="confirm">
					<view class="yes" @tap="logout">确定</view>
				</uni-list-item>
				<hr>
				<uni-list-item :showArrow="false" class="confirm" @tap="close">取消</uni-list-item>
			</uni-list>
		</uni-popup>
	</view>
</template>
<style>
	page {
		background-color: #E5E5E5;
	}
	.confirm {
		text-align: center;
	}
	.yes {
		color: #FF0000;
	}
	.signout {
		width: 100%;
		position: fixed;
		bottom: 7rpx;
	}
</style>
<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			contentus() {
				uni.setClipboardData({
				    data: 'define1999@163.com',
				    success: function () {
						uni.showModal({
							showCancel:false,
							content: "客服邮箱define1999@163.com已复制到剪切板",
							confirmText: "好的"
						});
				    }
				});
			},
			jumpTO(url) {
				uni.navigateTo({
					url: url
				});
			},
			open() {
				this.$refs.popup.open()
			},
			close() {
				this.$refs.popup.close()
			},
			logout() {
				var history_arr = uni.getStorageSync('history_arr');
				var favorite_arr = uni.getStorageSync('favorite_arr');
				history_arr[uni.getStorageSync('loginPhone')] = uni.getStorageSync('history');
				favorite_arr[uni.getStorageSync('loginPhone')] = uni.getStorageSync('myFavorite');
				uni.setStorageSync("favorite_arr", favorite_arr);
				uni.setStorageSync("history_arr", history_arr);
				uni.setStorageSync("isLogin", "false");
				uni.setStorageSync("loginPhone", "");
				uni.setStorageSync("myFavorite", []);
				uni.setStorageSync('history', []);
				uni.showToast({
					title:"已退出",
					mask: true
				});
				setTimeout(function() {
					uni.reLaunch({
						url: "../login/login"
					});
				}, 1500);
			}
		}
	}
</script>

<style>

</style>
