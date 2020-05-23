<template>
	<view class="content">
		<view>
			<view class="login">
				<span :class="{'h2':true, 'unfocused': !login}" @tap="toggle('login')">登录</span>
				<span class="h2">·</span>
				<span :class="{'h2':true, 'unfocused': login}" @tap="toggle('register')">注册</span>
			</view>
			
			<view class="login" v-if="login">
				<view style="display: flex;">
					<image src="../../static/icon/shouji.png" style="width: 70rpx;height: 70rpx;margin-top: 20rpx;"></image>
					<input type="text" name="log_phone" placeholder="手机号" v-model="log_phone">
				</view>
				<view style="display: flex;">
					<image src="../../static/icon/mima.png" style="width: 70rpx;height: 70rpx;margin-top: 20rpx;"></image>
					<input type="text" name="log_passwd" password="true" placeholder="密码" v-model="log_passwd">
				</view>
				<button type="primary" @tap="signIn">确定</button>
				<navigator url="">忘记密码？</navigator>
			</view>
			<view class="register" v-else>
				<view style="display: flex;">
					<image src="../../static/icon/shouji.png" style="width: 70rpx;height: 70rpx;margin-top: 20rpx;"></image>
					<input type="text" name="reg_phone" placeholder="手机号" v-model="reg_phone">
				</view>
				<view style="display: flex;">
					<image src="../../static/icon/mima.png" style="width: 70rpx;height: 70rpx;margin-top: 20rpx;"></image>
					<input type="text" name="reg_passwd" password="true" placeholder="密码" v-model="reg_passwd">
				</view>
				<view style="display: flex;">
					<image src="../../static/icon/mima.png" style="width: 70rpx;height: 70rpx;margin-top: 20rpx;"></image>
					<input type="text" name="reg_con_passwd" password="true" placeholder="确认密码" v-model="reg_con_passwd">
				</view>
				<button type="primary" @tap="signUp">确定</button>
			</view>
		</view>
	</view>
</template>
<style>
	.login {
		margin-bottom: 60rpx;
	}
	.h2 {
		font-size: 50rpx;
		font-weight: bold; 
	}
	.unfocused {
		color: darkgray;
	}
	navigator {
		font-size: 25rpx;
		float: right;
	}
	.content {
		margin: 0;
		margin-top: 45%;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	input {
		background-color: #eee;
		border-radius: 35rpx;
		margin-top: 20rpx;
		margin-bottom: 30rpx;
		font-size: 40rpx;
		padding: 10rpx 5rpx 10rpx 30rpx;
	}
</style>
<script>
	import md5 from '../../common/md5-node/index.js'
	export default {
		onLoad() {
			if(uni.getStorageSync('history_arr') == '') {
				uni.setStorageSync('history_arr', {});
			}
			if(uni.getStorageSync('favorite_arr') == '') {
				uni.setStorageSync('favorite_arr', {});
			}
		},
		data() {
			return {
				login: true,
				log_phone: "",
				log_passwd: "",
				reg_phone: "",
				reg_passwd: "",
				reg_con_passwd: ""
			}
		},
		methods: {
			signIn() {
				uni.request({
					url:"http://120.27.208.220/login",
					dataType: "json",
					method: "POST",
					data: {
						"phone": this.log_phone,
						"password": md5(this.log_passwd)  
					},
					success: (res) => {
						if(res.data.code == 0) {
							uni.setStorageSync("isLogin", "true");
							uni.setStorageSync("loginPhone", this.log_phone);
							
							var history_arr = uni.getStorageSync('history_arr');
							uni.setStorageSync('history', history_arr[this.log_phone]);  
							var favorite_arr = uni.getStorageSync('favorite_arr');
							uni.setStorageSync('myFavorite', favorite_arr[this.log_phone]) 
							uni.switchTab({
								url:"../index/index"
							});
						} else {
							console.log(res);
							uni.showModal({
								showCancel:false,
								content:res.data.data
							});
						}
					},
					fail: (res) => {
						uni.showModal({
							showCancel:false,
							content:"请求操作超时"
						})
					}
				})
			},
			signUp() {
				if(this.reg_passwd != this.reg_con_passwd) {
					uni.showModal({
						showCancel: false,
						content: "两次密码输入不一致"
					});
					return;
				}
				uni.request({
					url: "http://120.27.208.220/register",
					dataType: "JSON",
					method: "POST",
					data: {
						"phone": this.reg_phone,
						"password": md5(this.reg_passwd)
					},
					success: (res) => {
						if(res.data.code == 0) {
							uni.setStorageSync("isLogin", "true");
							uni.setStorageSync("loginPhone", this.reg_phone);
							uni.showToast({
								title:"注册成功",
								mask: true
							});
							setTimeout(() => {
								uni.reLaunch({
									url:"../information/information",
								});
							}, 2000);
						} else {
						}
					}
				})
			},
			toggle(val) {
				if(val === 'login') {
					this.login = true;
				} else {
					this.login = false;
				}
			}
		}
	}
</script>


