<template>
    <view class="login-page">


        <!-- 登录卡片主体 -->
        <view class="login-card">

            <!-- 顶部品牌区域 -->
            <view class="brand-section">
                <text class="welcome-title">欢迎登录</text>
                <image class="brand-logo" src="@/static/neiic.svg" mode="aspectFit"></image>
                <text class="brand-title">国创微能站</text>
                <text class="brand-subtitle">智慧园区，品质生活</text>

                <!-- 插图 -->
                <view class="login-illustration">
                    <image src="https://iems.neiic.com/wechatImage/images/slogan.png" mode="aspectFit"></image>
                </view>
            </view>
            <!-- 微信登录 -->
            <view class="login-tab" v-if="loginType === 'wechat' && !showWechatRegister">
                <!-- 微信登录按钮 -->
                <button class="btn-wechat" open-type="getUserInfo" @getuserinfo="handleWechatAuth"
                    :disabled="!agreeAgreement">
                    <image class="wechat-icon" src="@/static/images/wechat.svg"></image>
                    <text style="min-width:fit-content;">微信登录</text>
                </button>

                <!-- 协议 -->
                <view class="agreement">
                    <checkbox :checked="agreeAgreement" @click="agreeAgreement = !agreeAgreement"
                        @change="onAgreementChange" class="agreement-checkbox"></checkbox>
                    <text class="agreement-text">
                        阅读并同意我们的
                        <text class="link" @click="showAgreement('service')">《服务协议与隐私条款》</text>
                        以及
                        <text class="link" @click="showAgreement('privacy')">《个人信息保护声明》</text>
                    </text>
                </view>

                <!-- 其他登录方式 -->
                <view class="login-methods">
                    <text class="login-methods-title">其他登录方式</text>
                    <view class="login-methods-buttons">
                        <button class="login-method-btn" @click="switchLoginType('sms')">
                            <text>短信验证码登录</text>
                        </button>
                        <button class="login-method-btn" @click="switchLoginType('account')">
                            <text>账号密码登录</text>
                        </button>
                    </view>
                </view>
            </view>

            <!-- 微信新用户完善信息 -->
            <view class="register-tab" v-if="showWechatRegister">
                <view class="form-header">
                    <text class="form-title">完善账号信息</text>
                </view>

                <view class="form-content">
                    <!-- 手机号 -->
                    <view class="input-group">
                        <text class="input-label">手机号</text>
                        <view class="input-wrapper">
                            <input type="number" placeholder="请输入手机号" v-model="wechatUserInfo.phone" maxlength="11"
                                @input="validatePhoneForWechat" />
                        </view>
                        <text class="error-tip" v-if="wechatUserInfo.phone && !isWechatPhoneValid">
                            请输入11位有效手机号
                        </text>
                    </view>

                    <!-- 验证码 -->
                    <view class="input-group">
                        <text class="input-label">验证码</text>
                        <view class="input-wrapper">
                            <input type="number" placeholder="请输入验证码" v-model="wechatUserInfo.verifyCode"
                                maxlength="6" />
                            <button class="btn-code" :disabled="wechatCountDown > 0 || !isWechatPhoneValid"
                                @click="getWechatVerifyCode">
                                {{ wechatCountDown > 0 ? `${wechatCountDown}秒后重试` : '获取验证码' }}
                            </button>
                        </view>
                        <text class="error-tip"
                            v-if="wechatUserInfo.verifyCode && wechatUserInfo.verifyCode.length !== 6">
                            请输入6位验证码
                        </text>
                    </view>

                    <button class="btn-primary" :disabled="!isWechatFormValid" @click="submitWechatRegister">
                        完成注册
                    </button>

                    <view class="back-link">
                        <text class="back-text" @click="cancelWechatRegister">返回登录</text>
                    </view>
                </view>
            </view>

            <!-- 短信登录 -->
            <view class="login-tab" v-if="loginType === 'sms'">
                <view class="form-header">
                    <text class="form-title">短信快捷登录</text>
                </view>

                <view class="form-content">
                    <view class="input-group">
                        <text class="input-label">手机号</text>
                        <view class="input-wrapper">
                            <input type="number" placeholder="请输入手机号" v-model="phoneNumber" maxlength="11"
                                @input="validatePhone" />
                        </view>
                        <text class="error-tip" v-if="phoneNumber && !isPhoneValid">
                            请输入11位有效手机号
                        </text>
                    </view>

                    <view class="input-group">
                        <text class="input-label">验证码</text>
                        <view class="input-wrapper">
                            <input type="number" placeholder="请输入验证码" v-model="verifyCode" maxlength="6" />
                            <button class="btn-code" :disabled="countDown > 0 || !isPhoneValid" @click="getVerifyCode">
                                {{ countDown > 0 ? `${countDown}秒后重试` : '获取验证码' }}
                            </button>
                        </view>
                        <text class="error-tip" v-if="verifyCode && verifyCode.length !== 6">
                            请输入6位验证码
                        </text>
                    </view>

                    <!-- 协议 -->
                    <view class="agreement">
                        <checkbox :checked="agreeAgreement" @click="agreeAgreement = !agreeAgreement"
                            @change="onAgreementChange" class="agreement-checkbox"></checkbox>
                        <text class="agreement-text">
                            阅读并同意我们的
                            <text class="link" @click="showAgreement('service')">《服务协议与隐私条款》</text>
                            以及
                            <text class="link" @click="showAgreement('privacy')">《个人信息保护声明》</text>
                        </text>
                    </view>
                    <text class="agreement-error" v-if="!agreeAgreement && (phoneNumber && verifyCode)">
                        请先同意协议才能登录
                    </text>

                    <button class="btn-primary" :disabled="!isSmsFormValid" @click="smsLoginOrRegister">
                        登录
                    </button>

                    <view class="login-switch">
                        <text class="switch-item" @click="switchLoginType('wechat')">微信登录</text>
                        <text class="switch-item" @click="switchLoginType('account')">账号密码登录</text>
                    </view>
                </view>
            </view>

            <!-- 账号密码登录 -->
            <view class="login-tab" v-if="loginType === 'account'">
                <view class="form-header">
                    <text class="form-title">账号密码登录</text>
                </view>

                <view class="form-content">
                    <view class="input-group">
                        <text class="input-label">账号</text>
                        <view class="input-wrapper">
                            <input type="text" placeholder="请输入账号/手机号" v-model="accountInfo.username" />
                        </view>
                    </view>

                    <view class="input-group">
                        <text class="input-label">密码</text>
                        <view class="input-wrapper">
                            <input type="password" placeholder="请输入密码" v-model="accountInfo.password" />
                        </view>
                    </view>

                    <!-- 协议 -->
                    <view class="agreement">
                        <checkbox :checked="agreeAgreement" @click="agreeAgreement = !agreeAgreement"
                            @change="onAgreementChange" class="agreement-checkbox"></checkbox>
                        <text class="agreement-text">
                            阅读并同意我们的
                            <text class="link" @click="showAgreement('service')">《服务协议与隐私条款》</text>
                            以及
                            <text class="link" @click="showAgreement('privacy')">《个人信息保护声明》</text>
                        </text>
                    </view>
                    <text class="agreement-error"
                        v-if="!agreeAgreement && (accountInfo.username && accountInfo.password)">
                        请先同意协议才能登录
                    </text>

                    <button class="btn-primary" :disabled="!isAccountFormValid" @click="accountLogin">
                        登录
                    </button>

                    <view class="login-switch">
                        <text class="switch-item" @click="switchLoginType('wechat')">微信登录</text>
                        <text class="switch-item" @click="switchLoginType('sms')">短信登录</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部版权 -->

        <view class="copyright">
            Copyright © {{ new Date().getFullYear() }} 国创能源互联网创新中心（广东）有限公司
        </view>
    </view>
</template>

<script>
import { wechatLoginByTel, sendSmsCode, wxLoginApi, wxRegisterApi, wechatLogin, userLogin, getUserAreaLevel } from '@/api/user'
import { decrypt } from "@/utils/decryptData.js"
import md5 from "@/utils/md5.min.js"
export default {
    data() {
        return {
            // 基础状态
            agreeAgreement: false,
            loginType: 'wechat',
            showWechatRegister: false,

            // 表单有效性标识
            isWechatFormValid: false,
            isSmsFormValid: false,
            isAccountFormValid: false,

            // 短信登录信息
            phoneNumber: '',
            verifyCode: '',
            countDown: 0,
            timer: null,
            isPhoneValid: false,
            lastCountDown: 0,

            // 微信注册补充信息
            wechatUserInfo: {
                nickname: '',
                avatarUrl: '',
                phone: '',
                verifyCode: ''
            },
            wechatCountDown: 0,
            wechatTimer: null,
            isWechatPhoneValid: false,
            tempWechatCode: '',

            // 账号密码登录信息
            accountInfo: {
                username: '',
                password: ''
            }
        };
    },
    watch: {
        'wechatUserInfo': {
            deep: true,
            handler() {
                const { phone, verifyCode } = this.wechatUserInfo;
                this.isWechatFormValid =
                    this.isWechatPhoneValid &&
                    verifyCode.length === 6;
            }
        },
        'phoneNumber'() { this.updateSmsFormValid(); },
        'verifyCode'() { this.updateSmsFormValid(); },
        'agreeAgreement'() { this.updateSmsFormValid(); this.updateAccountFormValid(); },
        'isPhoneValid'() { this.updateSmsFormValid(); },
        'accountInfo': {
            deep: true,
            handler() { this.updateAccountFormValid(); }
        }
    },
    methods: {
        // 切换登录方式
        switchLoginType(type) {
            this.loginType = type;
            this.clearCountDown();
            this.cancelWechatRegister();
            if (type === 'sms') {
                this.phoneNumber = '';
                this.verifyCode = '';
                this.isPhoneValid = false;
                this.updateSmsFormValid();
            } else if (type === 'account') {
                this.accountInfo = { username: '', password: '' };
                this.updateAccountFormValid();
            }
        },

        // 微信授权登录
        handleWechatAuth(e) {
            if (!this.agreeAgreement) {
                uni.showToast({ title: '请先同意协议', icon: 'none' });
                return;
            }

            if (e.detail.userInfo) {
                uni.showLoading({ title: '登录中...' });
                wx.login({
                    success: (loginRes) => {
                        //  console.log(loginRes, "-------121-----------------")
                        // return
                        this.checkWechatUserStatus(loginRes.code, e.detail.userInfo);
                        return
                        if (loginRes.code) {
                            console.log(loginRes, "------------")
                            // 使用新的微信登录接口
                            wechatLogin(loginRes.code, 1).then(res => {
                                uni.hideLoading();

                                console.log(res, "------------")
                                if (res.code === 200) {
                                    if (res.data.newUser) {
                                        this.showWechatRegister = true;
                                        this.tempWechatCode = loginRes.code;
                                        this.wechatUserInfo.nickname = (e.detail.userInfo.nickName || '').trim();
                                        this.wechatUserInfo.avatarUrl = e.detail.userInfo.avatarUrl || '';
                                    } else {
                                        this.saveLoginState(res.data);
                                        uni.showToast({ title: '登录成功', icon: 'success' });
                                        uni.navigateTo({ url: '/pages/index/index' });
                                    }
                                } else {
                                    uni.showToast({ title: res.message || '登录失败，请重试', icon: 'none' });
                                }
                            }).catch(err => {
                                uni.hideLoading();
                                uni.showToast({ title: '微信登录失败', icon: 'none' });
                            });
                        } else {
                            uni.hideLoading();
                            uni.showToast({ title: '获取登录信息失败', icon: 'none' });
                        }
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        uni.showToast({ title: '微信登录失败', icon: 'none' });
                    }
                });
            } else {
                uni.showToast({ title: '请授权后再登录', icon: 'none' });
            }
        },

        // 检查微信用户状态
        checkWechatUserStatus(code, userInfo) {
            wxLoginApi(code).then(res => {
                uni.hideLoading();
                console.log(res, "1111-----------")
                if (res.code === 200) {
                    if (res.data.newUser) {
                        this.showWechatRegister = true;
                        this.tempWechatCode = code;
                        this.wechatUserInfo.nickname = (userInfo.nickName || '').trim();
                        this.wechatUserInfo.avatarUrl = userInfo.avatarUrl || '';
                    } else {
                        this.saveLoginState(res.data);
                        uni.showToast({ title: '登录成功', icon: 'success' });
                        uni.navigateTo({ url: '/pages/index/index' });
                    }
                } else {
                    uni.showToast({ title: res.message || '登录失败，请重试', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '网络异常，登录失败', icon: 'none' });
            });
        },

        // 微信新用户-验证手机号
        validatePhoneForWechat() {
            this.isWechatPhoneValid = /^1[3-9]\d{9}$/.test(this.wechatUserInfo.phone);
        },

        // 微信新用户-获取验证码
        getWechatVerifyCode() {
            if (!this.isWechatPhoneValid) {
                return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
            }

            uni.showLoading({ title: '发送中...' });
            sendSmsCode(this.wechatUserInfo.phone).then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    uni.showToast({ title: '验证码发送成功', icon: 'success' });
                    this.startWechatCountDown();
                } else {
                    uni.showToast({ title: res.message || '发送失败', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '发送失败，请重试', icon: 'none' });
            });
        },

        // 微信新用户-开始倒计时
        startWechatCountDown() {
            this.wechatCountDown = 60;
            this.wechatTimer = setInterval(() => {
                this.wechatCountDown > 0 ? this.wechatCountDown-- : this.clearWechatCountDown();
            }, 1000);
        },

        // 微信新用户-清除倒计时
        clearWechatCountDown() {
            if (this.wechatTimer) {
                clearInterval(this.wechatTimer);
                this.wechatTimer = null;
            }
            this.wechatCountDown = 0;
        },

        // 微信新用户-提交注册信息
        submitWechatRegister() {
            const { phone, verifyCode } = this.wechatUserInfo;
            if (!this.isWechatPhoneValid) {
                return uni.showToast({ title: '请输入11位有效手机号', icon: 'none' });
            }
            if (verifyCode.length !== 6) {
                return uni.showToast({ title: '请输入6位验证码', icon: 'none' });
            }

            uni.showLoading({ title: '注册中...' });
            wx.login({
                success: (res) => {
                    if (res.code) {
                        this.tempWechatCode = res.code;
                        uni.request({
                            url: 'https://iems.neiic.com/SsoServer/es/wechatRegister',
                            method: 'POST',
                            header: { 'content-type': 'application/x-www-form-urlencoded' },
                            data: {
                                'code': res.code,
                                'tel': phone,
                                'telCode': verifyCode
                            },
                            success: (uploadRes) => {
                                try {
                                    let resultData = uploadRes.data;
                                    if (resultData && typeof resultData === 'string') {
                                        resultData = resultData.trim();
                                        if (resultData.startsWith('"') && resultData.endsWith('"')) {
                                            resultData = resultData.substring(1, resultData.length - 1);
                                        }
                                    }
                                    const result = JSON.parse(decrypt(resultData));
                                    uni.hideLoading();
                                    if (result.code == 200) {
                                        uni.showToast({ title: '注册成功', icon: 'success' });
                                        this.saveLoginState(result.data);
                                        uni.navigateTo({ url: '/pages/index/index' });
                                    } else {
                                        uni.showToast({ title: result.message || '注册失败', icon: 'none' });
                                    }
                                } catch (e) {
                                    uni.hideLoading();
                                    uni.showToast({ title: '注册失败，数据解析错误', icon: 'none' });
                                }
                            },
                            fail: (error) => {
                                uni.hideLoading();
                                uni.showToast({ title: '注册失败，请重试', icon: 'none' });
                            }
                        });
                    }
                },
                fail: (err) => {
                    uni.hideLoading();
                    uni.showToast({ title: '获取微信code失败', icon: 'none' });
                }
            });
        },

        // 取消微信注册
        cancelWechatRegister() {
            this.showWechatRegister = false;
            this.clearWechatCountDown();
            this.wechatUserInfo = { nickname: '', avatarUrl: '', phone: '', verifyCode: '' };
            this.isWechatFormValid = false;
        },

        // 短信登录-验证手机号格式
        validatePhone() {
            this.isPhoneValid = /^1[3-9]\d{9}$/.test(this.phoneNumber);
        },

        // 短信登录-获取验证码
        getVerifyCode() {
            if (!this.isPhoneValid) {
                return uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
            }

            uni.showLoading({ title: '发送中...' });
            sendSmsCode(this.phoneNumber).then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    uni.showToast({ title: '验证码发送成功', icon: 'success' });
                    this.startCountDown();
                } else {
                    uni.showToast({ title: res.message || '发送失败', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '发送失败，请重试', icon: 'none' });
            });
        },

        // 短信登录-开始倒计时
        startCountDown() {
            this.countDown = 60;
            this.timer = setInterval(() => {
                this.countDown > 0 ? this.countDown-- : this.clearCountDown();
            }, 1000);
        },

        // 短信登录-清除倒计时
        clearCountDown() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.countDown = 0;
        },

        // 短信登录/注册
        smsLoginOrRegister() {
            if (!this.agreeAgreement) {
                return uni.showToast({ title: '请先同意服务协议与隐私条款', icon: 'none' });
            }
            if (!this.isPhoneValid) {
                return uni.showToast({ title: '请输入11位有效手机号', icon: 'none' });
            }
            if (this.verifyCode.length !== 6) {
                return uni.showToast({ title: '请输入6位验证码', icon: 'none' });
            }

            uni.showLoading({ title: '登录中...' });
            wechatLoginByTel(this.phoneNumber, this.verifyCode).then(res => {
                uni.hideLoading();
                if (res.code == 200) {
                    this.saveLoginState(res.data);
                    const message = res.data.newUser ? '注册并登录成功' : '登录成功';
                    uni.showToast({ title: message, icon: 'success' });
                    uni.navigateTo({ url: '/pages/index/index' });
                } else {
                    uni.showToast({ title: res.message || '操作失败', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '网络异常，登录失败', icon: 'none' });
            });
        },

        // 账号密码登录
        accountLogin() {
            if (!this.agreeAgreement) {
                return uni.showToast({ title: '请先同意服务协议与隐私条款', icon: 'none' });
            }
            if (!this.accountInfo.username || !this.accountInfo.password) {
                return uni.showToast({ title: '请输入账号和密码', icon: 'none' });
            }
            uni.showLoading({ title: '登录中...' });
            const encryptedPassword = md5(this.accountInfo.password).toString();
            userLogin(this.accountInfo.username, encryptedPassword).then(res => {
                uni.hideLoading();
                if (res.code === 200) {
                    // 调用接口获取areaLevelId
                    getUserAreaLevel(res.data.userid).then(areaRes => {
                        if (areaRes.code === 200) {
                            // 将areaLevelId添加到登录状态中
                            res.data.areaLevelId = areaRes.data.areaLevelId;
                        }
                        // 保存登录状态并跳转
                        this.saveLoginState(res.data);
                        uni.showToast({ title: '登录成功', icon: 'success' });
                        uni.navigateTo({ url: '/pages/index/index' });
                    }).catch(() => {
                        // 即使获取areaLevelId失败，也继续登录流程
                        this.saveLoginState(res.data);
                        uni.showToast({ title: '登录成功', icon: 'success' });
                        uni.navigateTo({ url: '/pages/index/index' });
                    });
                } else {
                    uni.showToast({ title: res.message || '登录失败，请重试', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '登录失败，请重试', icon: 'none' });
            });
        },

        // 统一存储登录状态
        saveLoginState(res) {
            console.log(res, "res")
            try {
                const userInfo = {
                    isLogin: true,
                    userId: res.id,
                    userName: res.user_name,
                    mobile_phone: res.mobile_phone,
                    balance: res.accountBalance,
                    // avatarUrl: res.wxAvaterUrl && res.wxAvaterUrl.trim() !== '' ? "https://iems.neiic.com" + res.wxAvaterUrl : undefined,
                    areaLevelId: res.areaLevelId,
                    esIds: res.energyStations
                };
                this.$store.commit("SET_LOGIN", userInfo);
            } catch (e) {
                console.error('存储登录状态失败:', e);
            }
        },

        // 协议勾选状态变化
        onAgreementChange(e) {
            this.agreeAgreement = e.detail.checked;
        },

        // 展示协议详情
        showAgreement(type) {
            const url = type === 'service'
                ? '/pages/agreement/serviceAgreement'
                : '/pages/agreement/privacyPolicy';
            uni.navigateTo({ url });
        },

        // 短信登录表单有效性更新
        updateSmsFormValid() {
            this.isSmsFormValid =
                this.phoneNumber.trim() !== '' &&
                this.isPhoneValid &&
                this.verifyCode.length === 6 &&
                this.agreeAgreement;
        },

        // 账号登录表单有效性更新
        updateAccountFormValid() {
            this.isAccountFormValid =
                this.accountInfo.username.trim() !== '' &&
                this.accountInfo.password.trim() !== '' &&
                this.agreeAgreement;
        }
    },

    onHide() {
        if (this.timer) {
            this.lastCountDown = this.countDown;
            clearInterval(this.timer);
            this.timer = null;
        }
        this.clearWechatCountDown();
    },
    onShow() {
        if (this.lastCountDown > 0 && !this.timer) {
            this.countDown = this.lastCountDown;
            this.startCountDown();
        }
        this.updateSmsFormValid();
        this.updateAccountFormValid();
        this.$nextTick(() => {
            this.wechatUserInfo = { ...this.wechatUserInfo };
        });
    },
    onUnload() {
        this.clearCountDown();
        this.clearWechatCountDown();
    }
};
</script>

<style scoped>
/* 页面整体布局 - 高级渐变背景 */
.login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f8f8f8;
    padding: 60rpx 0;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
}

/* 装饰背景元素 */
.login-page::before {
    content: '';
    position: absolute;
    width: 400rpx;
    height: 400rpx;
    background: radial-gradient(circle, rgba(7, 193, 96, 0.06) 0%, transparent 70%);
    top: -100rpx;
    right: -150rpx;
    border-radius: 50%;
    z-index: 0;
}

.login-page::after {
    content: '';
    position: absolute;
    width: 500rpx;
    height: 500rpx;
    background: radial-gradient(circle, rgba(0, 122, 255, 0.05) 0%, transparent 70%);
    bottom: -150rpx;
    left: -200rpx;
    border-radius: 50%;
    z-index: 0;
}

/* 品牌区域 */
.brand-section {
    width: 100%;
    max-width: 540rpx;
    margin-top: 60rpx;
    margin-bottom: 40rpx;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
    animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30rpx);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 欢迎标题 */
.welcome-title {
    font-size: 40rpx;
    font-weight: 600;
    color: #1d2129;
    letter-spacing: 2rpx;
    margin-bottom: 10rpx;
}

.brand-logo {
    width: 160rpx;
    height: 80rpx;
    object-fit: contain;
    filter: drop-shadow(0 4rpx 12rpx rgba(0, 122, 255, 0.15));
    transition: all 0.3s ease;
}

.brand-logo:hover {
    transform: scale(1.05);
}

.brand-title {
    font-size: 48rpx;
    font-weight: 700;
    color: #1d2129;
    letter-spacing: 3rpx;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.05);
}

.brand-subtitle {
    font-size: 28rpx;
    color: #86909c;
    font-weight: 400;
    letter-spacing: 1rpx;
    text-align: center;
    line-height: 1.4;
    margin-bottom: 20rpx;
}

/* 登录插图 */
.login-illustration {
    width: 100%;
    max-width: 480rpx;
    margin: 20rpx 0;
    border-radius: 20rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.1);
}

.login-illustration image {
    width: 100%;
    height: 200rpx;
    object-fit: cover;
}

/* 短信登录按钮 */
.btn-sms {
    height: 96rpx;
    border-radius: 48rpx;
    background: linear-gradient(135deg, #007aff 0%, #0066cc 100%);
    color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    border: none;
    margin: 20rpx 0;
    transition: all 0.2s ease;
    letter-spacing: 2rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.25);
}

.btn-sms:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
}

/* 其他登录方式 */
.login-methods {
    margin-top: 40rpx;
}

/* 其他登录方式标题 */
.login-methods-title {
    display: block;
    text-align: center;
    font-size: 26rpx;
    color: #86909c;
    margin-bottom: 24rpx;
    position: relative;
}

.login-methods-title::before,
.login-methods-title::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 30%;
    height: 1rpx;
    background: #e5e6eb;
}

.login-methods-title::before {
    left: 0;
}

.login-methods-title::after {
    right: 0;
}

/* 其他登录方式按钮容器 */
.login-methods-buttons {
    display: flex;
    gap: 20rpx;
}

/* 其他登录方式按钮 */
.login-method-btn {
    flex: 1;
    height: 88rpx;
    border-radius: 44rpx;
    background: #f7f8fa;
    color: #4e5969;
    font-size: 28rpx;
    font-weight: 500;
    border: 1rpx solid #e5e6eb;
    transition: all 0.2s ease;
    letter-spacing: 1rpx;
}

.login-method-btn:active {
    background: #e8f0fe;
    color: #007aff;
    border-color: #007aff;
    transform: translateY(2rpx);
}

/* 登录卡片 - 精致毛玻璃效果 */
.login-card {
    width: 85%;
    max-width: 500px;
    /* background: rgba(255, 255, 255, 0.95); */
    /* border-radius: 36rpx; */
    padding: 60rpx 40rpx;
    /* box-shadow: 0 16rpx 64rpx rgba(0, 122, 255, 0.1); */
    box-sizing: border-box;
    /* border: 1rpx solid rgba(255, 255, 255, 0.95); */
    position: relative;
    z-index: 1;
    /* margin-bottom: 80rpx; */
    /* animation: slideIn 0.8s ease-out; */
    backdrop-filter: blur(10rpx);
    min-height: calc(100vh - 120rpx - 36px);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(40rpx);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 登录标签页 */
.login-tab,
.register-tab {
    display: flex;
    flex-direction: column;
    gap: 32rpx;
}

/* 表单头部 */
.form-header {
    margin-bottom: 16rpx;
}

/* 表单标题 */
.form-title {
    font-size: 36rpx;
    font-weight: 600;
    color: #1d2129;
    text-align: center;
    letter-spacing: 2rpx;
    margin-bottom: 8rpx;
}

/* 表单内容 */
.form-content {
    display: flex;
    flex-direction: column;
    gap: 40rpx;
}

/* 输入组 */
.input-group {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    position: relative;
}

.input-label {
    font-size: 28rpx;
    color: #4e5969;
    font-weight: 500;
    padding-left: 4rpx;
    letter-spacing: 0.5rpx;
}

/* 输入框样式 */
.input-wrapper {
    height: 88rpx;
    border-radius: 20rpx;
    border: 1.5rpx solid #e5e6eb;
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    background-color: #fafbfc;
    transition: all 0.3s ease;
    box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.input-wrapper:focus-within {
    border-color: #007aff;
    background-color: #fff;
    box-shadow: 0 0 0 6rpx rgba(0, 122, 255, 0.06), inset 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
    transform: translateY(-2rpx);
}

input {
    flex: 1;
    font-size: 30rpx;
    color: #1d2129;
    border: none;
    outline: none;
    background: transparent;
    letter-spacing: 0.5rpx;
}

input::placeholder {
    color: #c9cdd4;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

/* 验证码按钮 */
.btn-code {
    width: 180rpx;
    height: 60rpx;
    border-radius: 12rpx;
    background: linear-gradient(to left, rgba(196, 222, 255, 0.996), rgb(68, 136, 251));
    color: #fff;
    font-size: 24rpx;
    border: none;
    margin-left: 16rpx;
    flex-shrink: 0;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
}

.btn-code:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);
}

.btn-code:disabled {
    background: #f2f3f5;
    color: #c9cdd4;
    transform: none;
    box-shadow: none;
}

/* 主按钮 */
.btn-primary {
    /* height: 96rpx; */
    background: linear-gradient(to left, rgba(196, 222, 255, 0.996), rgb(68, 136, 251));
    color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.25);
    transition: all 0.2s ease;
    letter-spacing: 2rpx;
    margin-top: 8rpx;
    width: 100%;
}

.btn-primary:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
}

.btn-primary:disabled {
    opacity: 0.4;
    box-shadow: none;
    transform: none;
}

/* 微信按钮 */
.btn-wechat {
    height: 104rpx;
    border-radius: 24rpx;
    background: linear-gradient(to left, rgba(196, 222, 255, 0.996), rgb(68, 136, 251));
    ;
    color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    border: none;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.25);
    transition: all 0.2s ease;
    letter-spacing: 2rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    width: 100%;
    margin-bottom: 16rpx;
}

.btn-wechat:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
}

.btn-wechat:disabled {
    opacity: 0.4;
    box-shadow: none;
    transform: none;
}

.wechat-icon {
    width: 48rpx;
    height: 48rpx;
    filter: drop-shadow(0 2rpx 4rpx rgba(255, 255, 255, 0.3));
}

/* 协议样式 */
.agreement {
    display: flex;
    align-items: flex-start;
    gap: 12rpx;
    font-size: 22rpx;
    color: #86909c;
    line-height: 1.5;
    padding: 0 4rpx;
    margin-top: 24rpx;
}

.agreement-checkbox {
    transform: scale(0.8);
    margin-top: 4rpx;
}

.link {
    color: #007aff;
    font-weight: 500;
    text-decoration: none;
    padding: 2rpx 4rpx;
    border-radius: 4rpx;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1rpx;
    background: #007aff;
    transition: width 0.3s ease;
}

.link:active {
    background-color: rgba(0, 122, 255, 0.1);
}

.link:hover::after {
    width: 100%;
}

/* 错误提示 */
.error-tip {
    position: absolute;
    bottom: -30rpx;
    left: 8rpx;
    font-size: 22rpx;
    color: #f53f3f;
    animation: shake 0.3s ease;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-4rpx);
    }

    75% {
        transform: translateX(4rpx);
    }
}

.agreement-error {
    font-size: 22rpx;
    color: #f53f3f;
    margin-top: -16rpx;
    padding-left: 8rpx;
    animation: shake 0.3s ease;
}

/* 登录选项 */
.login-options {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    margin-top: 8rpx;
}

.option-item {
    font-size: 26rpx;
    color: #86909c;
    padding: 8rpx 12rpx;
    transition: all 0.2s ease;
    border-radius: 8rpx;
    position: relative;
}

.option-item:active {
    color: #07c160;
    background-color: rgba(7, 193, 96, 0.05);
    transform: translateY(-2rpx);
}

.divider {
    color: #e5e6eb;
    font-size: 24rpx;
    margin: 0 8rpx;
}

/* 切换登录方式 */
.login-switch {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-top: 8rpx;
}

.switch-item {
    font-size: 26rpx;
    color: #007aff;
    font-weight: 500;
    padding: 8rpx 16rpx;
    transition: all 0.2s ease;
    border-radius: 8rpx;
    position: relative;
}

.switch-item:active {
    background-color: rgba(0, 122, 255, 0.1);
    transform: translateY(-2rpx);
}

/* 返回登录 */
.back-link {
    text-align: center;
    margin-top: 8rpx;
}

.back-text {
    font-size: 26rpx;
    color: #86909c;
    padding: 8rpx 16rpx;
    transition: all 0.2s ease;
    border-radius: 8rpx;
}

.back-text:active {
    color: #007aff;
    background-color: rgba(0, 122, 255, 0.05);
    transform: translateY(-2rpx);
}

/* 底部版权 */
.copyright {
    width: 100%;
    text-align: center;
    font-size: 24rpx;
    color: #c9cdd4;
    padding: 20rpx 30rpx;
    /* position: fixed; */
    z-index: 1;
    margin-top: 20rpx;
    bottom: 0;
}
</style>