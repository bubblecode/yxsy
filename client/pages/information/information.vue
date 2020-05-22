<template>
	<view>
		<view style="display: flex;flex-direction: row;" @tap="test">
			<view class="figure">
				<image :src='u_img' style="width: 120rpx; height: 120rpx; border-radius: 50%;"></image>
			</view>
			<view style="margin-top: 70rpx; font-size: 35rpx;">点击上传头像</view>
		</view>
		<form @submit="formSubmit">
			<uni-list>
				<uni-list-item>
					<view style="display: flex;">
						<view class="label">昵称：</view>
						<input type="text" name="my_name" v-model="u_name" />
					</view>
				</uni-list-item>
				<uni-list-item>
					<view style="display: flex;">
						<view class="label">手机号：</view>
						<input type="number" name="my_phone" disabled="true" v-model="u_phone" />
					</view>
				</uni-list-item>
				<uni-list-item>
					<view style="display: flex;">
						<view class="label">邮箱：</view>
						<input type="idcard" name="my_email" v-model="u_email" />
					</view>
				</uni-list-item>
				<uni-list-item :showArrow="false">
					<view style="display: flex;">
						<view class="label">性别：</view>
						<view style="margin-left: 30rpx;">
							<radio-group @change="radioChange" name="my_sex">
								<label class="radio">
									<radio value="m" :checked=" u_sex === 'm' " />男</label>
								<label class="radio">
									<radio value="f" :checked=" u_sex === 'f' " />女</label>
							</radio-group>
						</view>
					</view>
				</uni-list-item>
				<uni-list-item>
					<view style="display: flex;">
						<view class="label">年龄：</view>
						<input type="number" name="my_age" placeholder="请输入年龄" v-model="u_age" />
					</view>
				</uni-list-item>
			</uni-list>
			<button form-type="submit">保存</button>
		</form>
	</view>
</template>
<style>
	.label {
		color: gray;
	}

	.figure {
		margin: 30rpx;
	}

	.radio {
		margin-right: 80rpx;
	}

	button {
		margin: 30rpx;
		color: #FFFFFF;
		background-color: #78b2e9 !important;
	}

	button:active {
		color: #FFFFFF;
		background-color: #3a8fe9 !important;
	}

	page {
		background-color: #EEEEEE;
	}

	input {
		position: absolute;
		left: 130rpx;
	}
</style>
<script>
	export default {
		onShow() {
			const log = uni.getStorageSync('isLogin');
			const telphone = uni.getStorageSync('loginPhone');
			console.log(log);
			console.log(telphone);
			if (log) {
				uni.request({
					url: 'http://120.27.208.220/information',
					data: {
						telphone 
					},
					method: "POST",
					success: (res) => {
						const img = res.data.path + "?" + (new Date()).valueOf();;
						const result = res.data.info;
						console.log(img);
						console.log(result);

						this.u_img = img
						this.u_name = result.name;
						this.u_phone = result.phone;
						this.u_email = result['e-mail'];
						this.u_sex = result.sex;
						this.u_age = result.age;
					}
				})
			}
		},

		data() {
			return {
				u_img: '',
				u_name: '',
				u_phone: '',
				u_email: '',
				u_sex: '',
				u_age: ''
			}
		},
		methods: {
			radioChange: function(evt) {
			},
			test: function() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: 'http://120.27.208.220/setuserinfo',
							filePath: tempFilePaths[0],
							name: 'photo',
							formData: {
								u_phone: this.u_phone
							},
							success: (uploadFileRes) => {
								var result = JSON.parse(uploadFileRes.data);
								this.u_img = result.path + '?' + (new Date().valueOf());
							}
						});
					}
				})
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value));
				uni.request({
					url: 'http://120.27.208.220/setuserinfo',
					data: JSON.stringify(e.detail.value),
					method: "POST",
					success: (res) => {
						if (res.data.code === 0) {
							uni.showToast({
								title: "保存成功！",
								mask: true,
								success() {
									setTimeout(function() {
										uni.switchTab({
											url: "../my/my"
										});
									}, 1000);
								}
							});
						} else {
							uni.navigateBack({
								delta: 1
							});
						}
					},
					fail: () => {
						uni.showModal({
							showCancel: false,
							content: "保存失败，请稍后重试！"
						});
					}
				});
			}
		}
	}
</script>
