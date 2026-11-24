<template>
    <view class="login-page">

        <!-- 设计背景图：天空/标题/产品柜体/标语/云层/地面（官方资源） -->
        <image class="login-bg" src="/static/images/login-bg.png" mode="scaleToFill"></image>
        <!-- 表单页淡化背景：避免表单文字与柜体/标题/竖排标语重叠打架 -->
        <view class="login-bg-mask" v-if="loginType !== 'none'"></view>

        <!-- 顶部标题 -->
        <view class="nav-title">
            <!-- 表单页左上角返回箭头，回到登录入口页 -->
            <view class="nav-back" v-if="loginType !== 'none'" @click="switchLoginType('none')">
                <view class="nav-back-arrow"></view>
            </view>
            <text>登录</text>
        </view>

        <!-- 登录卡片主体 -->
        <view class="login-card" :class="{ 'login-card--form': loginType !== 'none' }">

            <!-- 登录方式入口 -->
            <view class="login-actions" v-if="loginType === 'none'">
                <!-- #ifdef MP-WEIXIN -->
                <!-- 小程序：主按钮一键登录 + 两个描边按钮 -->
                <button class="btn-main" open-type="getUserInfo" @getuserinfo="handleWechatAuth">
                    <text class="btn-main-label">手机号快捷登录</text>
                </button>
                <view class="alt-buttons">
                    <button class="btn-alt" @click="switchLoginType('sms')">短信验证码登录</button>
                    <button class="btn-alt" @click="switchLoginType('account')">账号密码登录</button>
                </view>
                <!-- #endif -->
                <!-- #ifndef MP-WEIXIN -->
                <!-- APP/H5：主按钮短信登录 + 文字链接账号登录 -->
                <button class="btn-main" @click="switchLoginType('sms')">
                    <text class="btn-main-label">短信验证码登录</text>
                </button>
                <text class="alt-link" @click="switchLoginType('account')">账号密码登录</text>
                <!-- #endif -->
            </view>

            <!-- #ifdef MP-WEIXIN -->
            <!-- 一键登录 -->
            <view class="login-tab" v-if="loginType === 'wechat' && !showWechatRegister">
                <!-- 一键登录按钮 -->
                <button class="btn-wechat" open-type="getUserInfo" @getuserinfo="handleWechatAuth">
                    <text style="min-width:fit-content;">手机号快捷登录</text>
                </button>

                <view class="login-switch">
                    <text class="switch-item" @click="switchLoginType('sms')">短信验证码登录</text>
                    <text class="switch-item" @click="switchLoginType('account')">账号密码登录</text>
                    <text class="switch-item" @click="switchLoginType('none')">返回</text>
                </view>
            </view>
            <!-- #endif -->

            <!-- #ifdef MP-WEIXIN -->
            <!-- 新用户完善信息 -->
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
                                <text class="btn-code-text">{{ wechatCountDown > 0 ? `${wechatCountDown}秒后重试` : '获取验证码' }}</text>
                            </button>
                        </view>
                        <text class="error-tip"
                            v-if="wechatUserInfo.verifyCode && wechatUserInfo.verifyCode.length !== 6">
                            请输入6位验证码
                        </text>
                    </view>

                    <button class="btn-primary" :disabled="!isWechatFormValid" @click="submitWechatRegister">
                        <text class="btn-primary-text">完成注册</text>
                    </button>

                    <view class="back-link">
                        <text class="back-text" @click="cancelWechatRegister">返回登录</text>
                    </view>
                </view>
            </view>
            <!-- #endif -->

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
                                <text class="btn-code-text">{{ countDown > 0 ? `${countDown}秒后重试` : '获取验证码' }}</text>
                            </button>
                        </view>
                        <text class="error-tip" v-if="verifyCode && verifyCode.length !== 6">
                            请输入6位验证码
                        </text>
                    </view>

                    <button class="btn-primary" :class="{ 'is-form-invalid': !isSmsFormValid }" @click="smsLoginOrRegister">
                        <text class="btn-primary-text">登录</text>
                    </button>

                    <view class="login-switch">
                        <!-- #ifdef MP-WEIXIN -->
                        <text class="switch-item" @click="switchLoginType('wechat')">手机号快捷登录</text>
                        <!-- #endif -->
                        <text class="switch-item" @click="switchLoginType('account')">账号密码登录</text>
                        <text class="switch-item" @click="switchLoginType('none')">返回</text>
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
                            <input
                                :password="!showPassword"
                                placeholder="请输入密码"
                                v-model="accountInfo.password"
                            />
                            <view class="pwd-toggle" hover-class="pwd-toggle-hover" @click.stop="togglePasswordVisible">
                                <uni-icons
                                    :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
                                    size="20"
                                    :color="showPassword ? '#3b7bf0' : '#96a0b0'"
                                />
                            </view>
                        </view>
                    </view>

                    <button class="btn-primary" :class="{ 'is-form-invalid': !isAccountFormValid }" @click="accountLogin">
                        <text class="btn-primary-text">登录</text>
                    </button>

                    <view class="login-switch">
                        <!-- #ifdef MP-WEIXIN -->
                        <text class="switch-item" @click="switchLoginType('wechat')">手机号快捷登录</text>
                        <!-- #endif -->
                        <text class="switch-item" @click="switchLoginType('sms')">短信登录</text>
                        <text class="switch-item" @click="switchLoginType('none')">返回</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 设备直连入口 -->
        <view class="device-direct-entry">
            <view class="entry-divider">
                <view class="divider-line"></view>
                <text class="divider-text">设备直连模式</text>
                <view class="divider-line"></view>
            </view>
            <view class="direct-card" @click="goDirectDevice">
                <text class="direct-title">局域网连接</text>
                <text class="direct-desc">无需账号登录，直连本地设备进行调试</text>
            </view>
        </view>

        <!-- 底部协议与版权 -->
        <view class="page-bottom">
            <view class="agreement">
                <checkbox :checked="agreeAgreement" @click="toggleAgreement" class="agreement-checkbox"></checkbox>
                <text class="agreement-text">
                    阅读并同意我们的
                    <text class="link" @click="showAgreement('service')">《服务协议与隐私条款》</text>
                    以及
                    <text class="link" @click="showAgreement('privacy')">《个人信息保护声明》</text>
                </text>
            </view>

            <view class="copyright">
                Copyright © {{ new Date().getFullYear() }} 国创能源互联网创新中心（广东）有限公司
            </view>
        </view>
    </view>
</template>

<script>
import { wechatLoginByTel, sendSmsCode, wxLoginApi, wxRegisterApi, wechatLogin, userLoginEs } from '@/api/user'
import { decrypt } from "@/utils/decryptData.js"
import md5 from "@/utils/md5.min.js"
export default {
    data() {
        return {
            // 基础状态
            agreeAgreement: false,
            // 'none'：登录方式入口页；'sms'/'account'：对应表单；'wechat'：小程序一键登录
            loginType: 'none',
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

            // 注册补充信息
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
            },
            // 密码是否明文显示
            showPassword: false
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
        // 进入无网络直连设备模式
        goDirectDevice() {
            uni.navigateTo({ url: '/pages/profile/direct-device-config' });
        },

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
                this.showPassword = false;
                this.updateAccountFormValid();
            }
        },

        // 授权登录
        handleWechatAuth(e) {
            if (!this.agreeAgreement) {
                uni.showToast({ title: '请先同意协议', icon: 'none' });
                return;
            }

            if (e.detail.userInfo) {
                uni.showLoading({ title: '登录中...' });
                wx.login({
                    success: (loginRes) => {
                        this.checkWechatUserStatus(loginRes.code, e.detail.userInfo);
                    },
                    fail: (err) => {
                        uni.hideLoading();
                        uni.showToast({ title: '登录失败', icon: 'none' });
                    }
                });
            } else {
                uni.showToast({ title: '请授权后再登录', icon: 'none' });
            }
        },

        // 检查用户状态
        checkWechatUserStatus(code, userInfo) {
            wxLoginApi(code).then(res => {
                uni.hideLoading();
                if (res.code === 200) {
                    if (res.data.newUser) {
                        this.showWechatRegister = true;
                        this.tempWechatCode = code;
                        this.wechatUserInfo.nickname = (userInfo.nickName || '').trim();
                        this.wechatUserInfo.avatarUrl = userInfo.avatarUrl || '';
                    } else {
                        this.saveLoginState(res.data);
                        uni.showToast({ title: '登录成功', icon: 'success' });
                    }
                } else {
                    uni.showToast({ title: res.message || '登录失败，请重试', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '网络异常，登录失败', icon: 'none' });
            });
        },

        // 新用户-验证手机号
        validatePhoneForWechat() {
            this.isWechatPhoneValid = /^1[3-9]\d{9}$/.test(this.wechatUserInfo.phone);
        },

        // 新用户-获取验证码
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

        // 新用户-开始倒计时
        startWechatCountDown() {
            this.wechatCountDown = 60;
            this.wechatTimer = setInterval(() => {
                this.wechatCountDown > 0 ? this.wechatCountDown-- : this.clearWechatCountDown();
            }, 1000);
        },

        // 新用户-清除倒计时
        clearWechatCountDown() {
            if (this.wechatTimer) {
                clearInterval(this.wechatTimer);
                this.wechatTimer = null;
            }
            this.wechatCountDown = 0;
        },

        // 新用户-提交注册信息
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
                    uni.showToast({ title: '获取登录凭证失败', icon: 'none' });
                }
            });
        },

        // 取消注册
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
                } else {
                    uni.showToast({ title: res.message || '操作失败', icon: 'none' });
                }
            }).catch(err => {
                uni.hideLoading();
                uni.showToast({ title: '网络异常，登录失败', icon: 'none' });
            });
        },

        // 账号密码登录（参考网页版 micro-energy-station 登录流程）
        accountLogin() {
            if (!this.agreeAgreement) {
                return uni.showToast({ title: '请先同意服务协议与隐私条款', icon: 'none' });
            }
            if (!this.accountInfo.username || !this.accountInfo.password) {
                return uni.showToast({ title: '请输入账号和密码', icon: 'none' });
            }
            uni.showLoading({ title: '登录中...' });
            const encryptedPassword = md5(this.accountInfo.password).toString();
            userLoginEs(this.accountInfo.username, encryptedPassword).then(res => {
                uni.hideLoading();
                if (res.code === 200 && res.data) {
                    // 新接口直接返回 ES 用户模型（含 sessionId 与能源站），无需再查旧用户表
                    this.saveLoginState({ ...res.data, loginType: 'account' });
                    uni.showToast({ title: '登录成功', icon: 'success' });
                    return;
                }
                uni.showToast({ title: res.msg || res.message || '账号或密码错误', icon: 'none' });
            }).catch(() => {
                uni.hideLoading();
                uni.showToast({ title: '登录失败，请检查网络后重试', icon: 'none' });
            });
        },

        // 统一存储登录状态
        saveLoginState(res) {
            try {
                // 确保 token 存进 storage——shouldSkipCloudSocket 要读它
                if (res.sessionId) {
                    uni.setStorageSync('token', res.sessionId);
                }

                // 确保 energyStations 中每个对象都有 esId 字段
                const stations = (res.energyStations || []).map(s => ({ ...s, esId: s.esId || s.id }));
                const userInfo = {
                    ...res,
                    isLogin: true,
                    loginType: res.loginType || 'phone',
                    userId: res.id || res.userid,
                    userName: res.user_name,
                    mobile_phone: res.mobile_phone,
                    balance: res.accountBalance,
                    sessionId: res.sessionId,
                    loginTime: new Date().getTime(),
                    areaLevelId: res.areaLevelId,
                    esIds: stations,
                    energyStations: stations,
                    roleId: res.roleId,
                    esUsers: res.es_users || []
                };
                this.$store.commit("SET_LOGIN", userInfo);
                // 强制写入 storage，确保 reLaunch 后能立即读取
                uni.setStorageSync('lifeData', {
                    ...(uni.getStorageSync('lifeData') || {}),
                    userInfo: userInfo,
                    hasLogin: true
                });

                // 登录成功后延迟创建云端 WebSocket（模块加载时因无 token 被 skip 了）
                this.$nextTick(() => {
                    try {
                        const { realtimeDataProvider } = require('@/service/websocket.js');
                        if (realtimeDataProvider && typeof realtimeDataProvider.ensureConnected === 'function') {
                            realtimeDataProvider.ensureConnected();
                        }
                    } catch (e) {
                        console.warn('延迟创建 WebSocket 失败（可忽略，首页会重试）:', e.message);
                    }
                });

                // 跳转首页
                setTimeout(() => {
                    uni.reLaunch({ url: '/pages/index/index' });
                }, 50);

                // #ifdef APP-PLUS
                // 启动时若尚未登录，检查更新请求可能因缺少 token 失败；登录态就绪后补查一次。
                // 启动检查已成功时模块内去重会自动跳过，不会重复弹窗；
                // 延到 reLaunch 之后，避免刚打开的升级弹窗被页面栈重置清掉。
                setTimeout(() => {
                    try {
                        const { checkAppUpdate } = require('@/utils/appUpdate.js');
                        checkAppUpdate();
                    } catch (e) {
                        console.warn('[AppUpdate] 登录后补查失败（可忽略）:', e);
                    }
                }, 1500);
                // #endif
            } catch (e) {
                console.error('存储登录状态失败:', e);
            }
        },

        // 切换密码明文显示
        togglePasswordVisible() {
            this.showPassword = !this.showPassword;
        },

        // 协议勾选状态变化：小程序 checkbox 的 change.detail.checked 不可靠，统一用点击切换
        toggleAgreement() {
            this.agreeAgreement = !this.agreeAgreement;
        },

        // 展示协议详情
        showAgreement(type) {
            const url = type === 'service'
                ? '/pages-public/agreement/user-agreement'
                : '/pages-public/agreement/privacy-policy';
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
/* 页面整体布局 - 天空渐变背景 */
.login-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #e9f2fb;
    /* #ifndef APP-PLUS */
    padding: 30rpx 0 0;
    /* #endif */
    /* #ifdef APP-PLUS */
    padding: 20rpx 0 0;
    /* #endif */
    box-sizing: border-box;
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
}

/* 设计背景图：铺满全屏，标题/柜体/标语/云层/地面均在图内 */
.login-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
}

/* 表单页背景遮罩：不透明渐变彻底盖住品牌图，避免柜体/标语透出干扰表单 */
.login-bg-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(180deg, #e9f2fb 0%, #f2f8fd 55%, #ffffff 100%);
    z-index: 0;
}

/* 顶部标题 */
.nav-title {
    width: 100%;
    text-align: center;
    padding: 30rpx 0 6rpx;
    position: relative;
    z-index: 1;
    /* #ifdef APP-PLUS */
    /* 自定义导航需避让状态栏/水滴屏挖孔，避免标题被遮挡 */
    padding-top: calc(var(--status-bar-height) + 20rpx);
    /* #endif */
}

.nav-title text {
    font-size: 36rpx;
    font-weight: 600;
    color: #1d2129;
    letter-spacing: 2rpx;
}

/* 表单页左上角返回箭头（纯 CSS 绘制，避免组件依赖） */
.nav-back {
    position: absolute;
    left: 24rpx;
    /* #ifndef APP-PLUS */
    top: 46rpx;
    /* #endif */
    /* #ifdef APP-PLUS */
    top: calc(var(--status-bar-height) + 36rpx);
    /* #endif */
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
}

.nav-back-arrow {
    width: 20rpx;
    height: 20rpx;
    border-left: 4rpx solid #1d2129;
    border-bottom: 4rpx solid #1d2129;
    transform: rotate(45deg);
    margin-left: 6rpx;
}

.nav-back:active {
    opacity: 0.6;
}

/* 登录方式入口 */
.login-actions {
    width: 100%;
    max-width: 540rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
}

/* 主按钮：设计稿渐变胶囊（左深右浅蓝）+ 下方淡蓝阴影 */
.btn-main {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    padding: 0;
    margin: 0;
    border-radius: 48rpx;
    background: linear-gradient(90deg, #4488fb 0%, #5b9cfb 48%, #a9cdfd 100%);
    color: #ffffff;
    font-size: 34rpx;
    font-weight: 600;
    font-style: normal;
    border: none;
    letter-spacing: 2rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14rpx 22rpx rgba(133, 180, 253, 0.42);
    transition: all 0.2s ease;
}

.btn-main::after {
    border: none;
}

.btn-main-label {
    font-style: normal;
    font-weight: 600;
    color: #ffffff;
    line-height: 1;
}

.btn-main:active {
    transform: translateY(2rpx);
    opacity: 0.9;
}

/* 小程序：次级描边按钮（短信 / 账号密码） */
.alt-buttons {
    width: 100%;
    display: flex;
    gap: 24rpx;
    margin-top: 28rpx;
}

.btn-alt {
    flex: 1;
    height: 88rpx;
    line-height: 88rpx;
    padding: 0;
    margin: 0;
    border-radius: 44rpx;
    background: rgba(255, 255, 255, 0.65);
    border: 1rpx solid rgba(59, 127, 216, 0.35);
    color: #3b7fd8;
    font-size: 28rpx;
    font-weight: 500;
    letter-spacing: 1rpx;
    transition: all 0.2s ease;
}

.btn-alt::after {
    border: none;
}

.btn-alt:active {
    background: rgba(232, 240, 254, 0.9);
    transform: translateY(2rpx);
}

/* 次级登录方式链接 */
.alt-link {
    margin-top: 28rpx;
    font-size: 28rpx;
    color: #3b7fd8;
    font-weight: 500;
    padding: 8rpx 16rpx;
    transition: all 0.2s ease;
}

.alt-link:active {
    color: #1e63c8;
    opacity: 0.8;
}

/* 登录卡片 - 精致毛玻璃效果 */
.login-card {
    width: 85%;
    max-width: 500px;
    /* background: rgba(255, 255, 255, 0.95); */
    /* border-radius: 36rpx; */
    padding: 12rpx 40rpx;
    /* box-shadow: 0 16rpx 64rpx rgba(0, 122, 255, 0.1); */
    box-sizing: border-box;
    /* border: 1rpx solid rgba(255, 255, 255, 0.95); */
    position: relative;
    z-index: 1;
    /* margin-bottom: 80rpx; */
    /* animation: slideIn 0.8s ease-out; */
    /* backdrop-filter: blur(10rpx); */
    padding-bottom: 20rpx;
    margin-top: 50vh;
    /* min-height: calc(100vh - 120rpx - 36px); */
}

/* 表单页：不套用入口页对齐柜体的 50vh 顶部留白，与导航保持适度间距 */
.login-card--form {
    margin-top: 100rpx;
    padding-top: 24rpx;
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
    background-color: #ffffff;
    transition: all 0.3s ease;
    box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.input-wrapper:focus-within {
    border-color: #007aff;
    background-color: #fff;
    box-shadow: 0 0 0 6rpx rgba(0, 122, 255, 0.06), inset 0 1rpx 2rpx rgba(0, 0, 0, 0.05);
    transform: translateY(-2rpx);
}

/* 密码明文切换按钮 */
.pwd-toggle {
    flex-shrink: 0;
    width: 56rpx;
    height: 56rpx;
    margin-left: 12rpx;
    margin-right: -10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.pwd-toggle-hover {
    background-color: #f0f4fa;
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
    background: linear-gradient(90deg, #4488fb 0%, #5b9cfb 48%, #a9cdfd 100%);
    color: #fff !important;
    -webkit-text-fill-color: #fff;
    font-size: 24rpx;
    border: none;
    margin-left: 16rpx;
    flex-shrink: 0;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.2);
}

/* 小程序原生 button 文字色会覆盖 scoped color，文字包 text 显式设白 */
.btn-code-text {
    color: #fff !important;
    -webkit-text-fill-color: #fff;
}

.btn-code:active {
    transform: scale(0.96);
    box-shadow: 0 2rpx 8rpx rgba(0, 122, 255, 0.2);
}

.btn-code:disabled {
    background: #f2f3f5;
    transform: none;
    box-shadow: none;
}

.btn-code:disabled .btn-code-text {
    color: #c9cdd4 !important;
    -webkit-text-fill-color: #c9cdd4;
}

/* 主按钮 */
.btn-primary {
    /* 与入口登录按钮一致的官方渐变胶囊背景 */
    background: linear-gradient(90deg, #4488fb 0%, #5b9cfb 48%, #a9cdfd 100%);
    color: #fff !important;
    -webkit-text-fill-color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    border: none;
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 122, 255, 0.25);
    transition: all 0.2s ease;
    letter-spacing: 2rpx;
    margin-top: 8rpx;
    width: 100%;
}

.btn-primary-text {
    color: #fff !important;
    -webkit-text-fill-color: #fff;
}

.btn-primary:active {
    transform: translateY(2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 122, 255, 0.2);
}

.btn-primary:disabled,
.btn-primary.is-form-invalid {
    opacity: 0.4;
    box-shadow: none;
    transform: none;
}

/* 一键登录按钮 */
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

/* 协议样式 */
.agreement {
    display: flex;
    align-items: flex-start;
    gap: 8rpx;
    font-size: 20rpx;
    color: #86909c;
    line-height: 1.5;
    padding: 0;
    margin-top: 0;
    width: 100%;
}

.agreement-checkbox {
    transform: scale(0.8);
    transform-origin: left top;
    margin-top: 2rpx;
    flex-shrink: 0;
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

/* 登录选项 */
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

/* 底部协议与版权 */
.page-bottom {
    width: 100%;
    margin-top: auto;
    margin-bottom: 3vh;
    padding: 20rpx 20rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
}

/* 底部版权 */
.copyright {
    width: 100%;
    text-align: center;
    font-size: 20rpx;
    color: #a9bccf;
    white-space: nowrap;
    /* #ifndef APP-PLUS */
    padding: 10rpx 10rpx 20rpx;
    /* #endif */
    /* #ifdef APP-PLUS */
    padding: 8rpx 10rpx calc(8rpx + env(safe-area-inset-bottom));
    /* #endif */
    z-index: 1;
}

/* 设备直连入口 - 白卡样式 */
.device-direct-entry {
    width: 100%;
    max-width: 520rpx;
    margin-top: 3vh;
    padding: 30rpx 0rpx 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
    position: relative;
    z-index: 1;
    box-sizing: border-box;
}

.entry-divider {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
}

.divider-line {
    flex: none;
    width: 120rpx;
    height: 1rpx;
    background: rgba(169, 188, 207, 0.5);
}

.divider-text {
    font-size: 22rpx;
    color: #a9bccf;
    letter-spacing: 1rpx;
}

.direct-card {
    width: 100%;
    background: #ffffff;
    border: 2rpx solid #7aa6e6;
    border-radius: 60rpx;
    padding: 12rpx 30rpx 12rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    box-shadow: 0 8rpx 24rpx rgba(120, 160, 210, 0.14);
    transition: all 0.2s ease;
    box-sizing: border-box;
}

.direct-card:active {
    transform: scale(0.98);
    box-shadow: 0 4rpx 12rpx rgba(120, 160, 210, 0.12);
}

.direct-title {
    font-size: 32rpx;
    color: #3b7fd8;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.direct-desc {
    font-size: 24rpx;
    color: #9aa9bd;
    text-align: center;
}
</style>