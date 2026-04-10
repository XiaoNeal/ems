<template>
    <view class="container">
        <view class="wrapper">
            <u-toast ref="uToast"></u-toast>
            <view class="box"></view>
            <view class="login-title" style="text-align: center;">
                <image src="../../static/company_logo.png" mode="widthFix" style="width: 50vw;"></image>
                <view style="letter-spacing: 2px;">欢迎来到GIEMS云</view>
            </view>
            <view class="input-content">
                <view style="justify-content: end;display: flex;font-size: 24rpx;align-items: center;"></view>
                <view v-show="!isShow">
                    <view class="input-box">
                        <uni-easyinput trim="all" v-model="username" placeholder="请输入账号" :inputBorder="false"
                            @clear="clearUsername"></uni-easyinput>
                    </view>
                    <view class="input-box">
                        <uni-easyinput type="password" v-model="password" :inputBorder="false"
                            placeholder="请输入密码"></uni-easyinput>
                    </view>
                </view>
                <view v-show="isShow">
                    <view class="input-box">
                        <uni-easyinput type="number" placeholder="请输入手机号" v-model="phone"
                            :inputBorder="false"></uni-easyinput>
                    </view>
                    <view class="input-box" style="display: flex;align-items: center;justify-content: space-between;">
                        <uni-easyinput type="number" v-model="verificationCode" :inputBorder="false"
                            placeholder="请输入验证码"></uni-easyinput>
                        <view @tap="getCode" style="color: #4488fb;">获取验证码</view>
                    </view>
                    <text v-show="codeText" style="color: red;font-size: 3vw;position: absolute;">验证码不能为空</text>
                </view>
            </view>
            <view class="remember-me">
                <view>
                    <radio class="radio-style" color="rgba(26, 165, 241, 0.6)" :checked="isRememberMe"
                        @click="rememberMe" />记住我
                </view>
            </view>
            <view class="privacy-policy">
                <radio class="radio-style" color="rgba(26, 165, 241, 0.6)" :checked="isRead"
                    @click="isRead = !isRead" />
                我已阅读并同意<text style="color: rgb(30, 138, 214);" @click="goToAgreement(1)">《用户协议》</text>和<text
                    style="color: rgb(30, 138, 214);" @click="goToAgreement(2)">《隐私政策》</text>
            </view>
            <button v-if="!isShow" class="confirm-btn button" @click="toLogin(username, password)">登录</button>
            <button v-if="isShow" class="confirm-btn button" @tap="submitPhone">登录</button>
            <view style="width: 100%;margin: 50rpx auto;text-align: center;font-size: 30rpx;color: #909090;">
                <!-- <text style="margin-right: 40rpx;" @click="exampleConfirm">示例电站</text> -->
                <!-- <text @click="toRegist">注册</text> -->
                <text style="margin-left: 40rpx;" @click="loginSwitch">{{ loginWay }}</text>
            </view>
        </view>
    </view>
</template>

<script>

import { mapMutations } from 'vuex';
import { sendSmsCode, userLogin, loginPermission } from '@/api/user.js';
import md5 from "@/utils/md5.min.js";
import request from '@/utils/request.js';
import sapi from '@/store/sapi'

export default {
    name: 'login',

    data() {
        return {
            isRememberMe: false,
            isRead: false,
            username: '',
            password: '',
            logining: false,
            countdown: 60,
            timer: null,
            showPassword: false,
            loginWay: "短信验证码登录",
            loginTitle: '账号密码登录',
            isShow: false,
            text: '获取验证码',
            phone: '',
            verificationCode: '',
            codeText: false,
            columns: [
                ['家居社区系统']
            ],
            showExample: false
        };
    },
    computed: {
        isCorretPhoneNumber() {
            return /^1[3456789]\d{9}$/.test(this.username);
        }
    },
    mounted() {
        if (uni.getStorageSync('isRememberMe')) {
            this.isRememberMe = uni.getStorageSync('isRememberMe');
            this.password = uni.getStorageSync('rememberPassword');
            this.username = uni.getStorageSync('rememberUserName');
        }
        // #ifdef MP-WEIXIN
        wx.onNeedPrivacyAuthorization();
        // #endif
    },
    // watch: {},
    onShow() {
        this.$u.vuex('currentTemplate', 0);
    },
    methods: {
        ...mapMutations(['login']),
        clearUsername() {
            if (this.clearPasswordToo) {
                this.password = "";
            }
            this.$u.vuex('clearPasswordToo', false);
        },
        exampleConfirm() {
            this.isRead = true;
            const username = 'rocky';
            const password = 'neiic2024';
            this.toLogin(username, password);
        },
        rememberMe() {
            this.isRememberMe = !this.isRememberMe;
            uni.setStorageSync('isRememberMe', this.isRememberMe);
        },
        goToAgreement(e) {
            const url = e === 1 ? '/pages-public/agreement/user-agreement' : '/pages-public/agreement/privacy-policy';
            uni.navigateTo({ url });
        },
        mpLogin() { },
        submitPhone() {
            if (!this.isRead) {
                this.showToast('error', '请先阅读并勾选同意服务条款');
                return;
            }
            const reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/;
            if (!this.phone) {
                this.showToast('error', '手机号不能为空');
                return;
            } else if (!reg.test(this.phone)) {
                this.showToast('error', '请输入正确的手机号');
                return;
            } else if (!this.verificationCode) {
                this.showToast('error', '验证码不能为空');
                return;
            }
            this.showToast('loading', "正在加载");
            this.$store.dispatch('user/loginByPhone', {
                phone: this.phone,
                verificationCode: this.verificationCode
            }).then((res) => {
                console.log(res, "----------------------------------");
                if (res.code === 200) {
                    // this.showToast('success', "登录成功");
                    this.setLoginInfo(res);
                } else if (res.status === 500) {
                    this.showToast('error', "验证码错误，请重新输入");
                } else {
                    this.showToast('error', "登录失败");
                }
            }).catch(() => {
                this.logining = false;
            });
        },
        checkCode() {
            if (!this.verificationCode) {
                this.showToast('error', "验证码不能为空");
                this.codeText = true;
                return;
            }
            this.codeText = false;
        },
        checkPhone() {
            const reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/;
            if (!reg.test(this.phone)) {
                this.showToast('error', '请输入正确的手机号');
            }
        },
        startCountdown() {
            this.timer = setInterval(() => {
                if (this.countdown === 0) {
                    clearInterval(this.timer);
                    this.text = '获取验证码';
                    this.countdown = 60; // 重置倒计时
                } else {
                    this.countdown--;
                    this.text = `${this.countdown}秒后可重发`;
                }
            }, 1000);
        },
        validateLoginForm(username, password) {
            if (!this.isRead) {
                this.showToast('error', '请先阅读并勾选同意服务条款');
                return false;
            }
            if (!username) {
                this.showToast('error', '账号不能为空');
                return false;
            }
            if (!password) {
                this.showToast('error', '密码不能为空');
                return false;
            }
            return true;
        },
        getCode() {
            const reg = /^1([38]\d|4[579]|5[0-3,5-9]|66|7[0135678]|9[89])\d{8}$/;
            if (!reg.test(this.phone)) {
                this.showToast('error', '请输入正确的手机号');
                return;
            }
            this.showToast('success', "验证码已发送，请查收");
            this.startCountdown();
            sendSmsCode(this.phone).then(() => { });
        },
        resetPassword() {
            uni.navigateTo({ url: '/pages-public/password/password' });
        },
        toRegist() {
            uni.navigateTo({ url: '/pages-public/register/register' });
        },
        iconClick(type) {
            uni.showToast({ icon: "default", title: `点击了${type === 'prefix' ? '左侧' : '右侧'}的图标` });
        },
        navBack() {
            uni.navigateBack();
        },
        showToast(type, title) {
            this.$refs.uToast.show({
                type,
                icon: false,
                message: title
            });
        },

        async setLoginInfo(res) {

           
            // uni.navigateTo({ url: '/charging/index' });
            // return;


            this.$u.vuex('sessionId', res.sessionId);
            if (this.isRememberMe) {
                uni.setStorageSync('rememberPassword', this.password);
                uni.setStorageSync('rememberUserName', this.username);
            }
            this.$u.vuex('hasLogin', true);
            this.$u.vuex('userId', res.data.code);
            // 解析并过滤系统列表
            // const allowedIds = [5, 14, 25];
            const allowedIds = [25,27];
            const systems = Object.entries(res.data.plugininfo)
                .filter(([key]) => {
                    const id = key.replace('system', '');
                    return allowedIds.includes(parseInt(id));
                })
                .map(([_, sys]) => {
                    const matches = sys.match(/id=(\d+),\s*systemName='([^']+)',\s*systemType=(\d+)/);
                    return {
                        id: parseInt(matches[1]),
                        name: matches[2],
                        type: parseInt(matches[3]),
                        path: this.getSystemPath(parseInt(matches[3]))
                    };
                });

            const systemConfig1 = Object.values(res.data.plugininfo)[0];
            const systemType1 = systemConfig1.match(/systemType=(\d+)/)[1];
            console.log(systems, "systems--------------");

            // 系统跳转逻辑
            if (systems.length === 1) {
                let targetPath; // 默认路径
                if (systems[0].type == 1) {
                    // 珠海能源管理系统 
                    targetPath = '/pages/FIEMS/index';
                    uni.navigateTo({ url: targetPath });
                } else if (systems[0].type == 2) {
                    // 珠海能源管理系统 
                    // const { code, data } = await request({
                    //     url: '/ApihomecommunityKoa/login',
                    //     method: 'POST',
                    //     data: {
                    //         username: this.username,
                    //         password: md5(this.password)
                    //     }
                    // });
                    // if (code == 10000) {
                        // this.$u.vuex('token', "Bearer " + data.token);
                        // uni.setStorageSync('token', "Bearer " + data.token);

                        const result = await loginPermission({
                            userid: res.data.code,
                            systemId: systems[0].id
                        })
                        console.log(result, "result--------------");
                        const userInfo = {
                            _id: result.data.homecommunityRole.roleId,
                            username: result.data.username,
                            name: result.data.username,
                            __v: 0,
                            role: {
                                _id: result.data.homecommunityRole.roleId,
                                name: result.data.homecommunityRole.roleName,
                                description: result.data.homecommunityRole.roleDescription
                            },
                            level: result.data.homecommunityRole.roleName
                        }

                        // const userInfo = {
                        //     _id: "60054086019dcc42e41c91f7",
                        //     username: "homeAdmin",
                        //     name: "NEIIC 国创联能",
                        //     __v: 0,
                        //     role: {
                        //         _id: "60068a98fa3cf1513b206a74",
                        //         name: "admin",
                        //         description: "管理员"
                        //     },
                        //     level: "admin"
                        // }
                        const roleId = userInfo.role._id
                        sapi.getCenterList({ roleId }).then(res => {
                            if (res.code == 10000) {
                                this.showToast('success', "登录成功");
                                this.$u.vuex('centerList', res.data);
                                this.$store.commit('UPDATE_CENTERLIST', res.data)
                                targetPath = '/community/index';
                                uni.navigateTo({ url: targetPath });
                            } else {
                                this.showToast('error', '登录失败:服务器繁忙 ');
                            }
                        })


                    
                    
                    // } else {
                    //     this.showToast('error', '登录失败:服务器繁忙 ');
                    // }
                } else if (systems[0].type == 3) {

                    // IEMS光储直柔云控平台
                    targetPath = '/pages/cloud-system/index';
                    uni.navigateTo({ url: targetPath });

                }

                return


            } else {


                uni.navigateTo({
                    url: '/pages/system-selector/system-selector?systems=' +
                        encodeURIComponent(JSON.stringify(systems)) +
                        '&username=' + encodeURIComponent(this.username) +
                        '&password=' + encodeURIComponent(md5(this.password).toString()) +
                        '&userId=' + encodeURIComponent(res.data.code) +
                        '&sessionId=' + encodeURIComponent(res.sessionId)

                });
            }
        },



        getSystemPath(type) {
            const pathMap = {
                1: '/FIEMS/index',
                2: '/community/index',
                3: '/cloud-system/index'
            };
            return pathMap[type] || '/cloud-system/index';
        },

        loginSwitch() {
            this.isShow = !this.isShow;
            this.loginWay = this.isShow ? "账号密码登录" : "短信验证码登录";
            // 清空输入框内容
            if (this.isShow) {
                this.username = '';
                this.password = '';
            } else {
                this.phone = '';
                this.verificationCode = '';
            }
        },
        async toLogin(username, password) {
            if (!this.isRead) {
                this.showToast('error', '请先阅读并勾选同意服务条款');
                return;
            }
            if (!username) {
                this.showToast('error', '账号不能为空');
                return;
            } else if (!password) {
                this.showToast('error', '密码不能为空');
                return;
            }
            this.showToast('loading', "正在加载");
            userLogin(username, md5(password).toString())
                .then(res => {
                    console.log(res)
                    // res = JSON.parse(decrypt(res));
                    if (res.code === 200) {
                        // this.showToast('success', "登录成功");
                        this.setLoginInfo(res);
                    } else if (res.status === 500) {
                        this.showToast('error', "用户密码错误，请重新输入");
                    } else {
                        this.showToast('error', "用户不存在或密码错误");
                    }
                    this.logining = false;
                });
        }
    }
};
</script>

<style lang="scss" scoped>
/* 页面左右间距 */
$page-row-spacing: 30upx;
$page-color-base: #f8f8f8;
$page-color-light: #f8f6fc;
$base-color: #fa436a;

// /* 文字尺寸 */
$font-sm: 24upx;
$font-base: 28upx;
$font-lg: 32upx;
/*文字颜色*/
$font-color-dark: #303133;
$font-color-base: #606266;
$font-color-light: #909399;
$font-color-disabled: #C0C4CC;
$font-color-spec: #4399fc;
/* 边框颜色 */
$border-color-dark: #DCDFE6;
$border-color-base: #E4E7ED;
$border-color-light: #EBEEF5;
/* 图片加载中颜色 */
$image-bg-color: #eee;
/* 行为相关颜色 */
$uni-color-primary: #fa436a;
$uni-color-success: #4cd964;
$uni-color-warning: #f0ad4e;
$uni-color-error: #dd524d;

::v-deep.u-button {
    width: 6rem !important;
    height: 30px !important;
}



.input-box {
    border-radius: 500px;
    margin-top: 5vw;
    background-color: #f3f8ff;
    padding: 2vw 3vw;
}

.container {
    position: relative;
    width: 100vw;
    height: 100%;
    overflow: auto;
    background-color: #fff;
}

.box {
    padding-top: 44px;
    background-image: linear-gradient(rgba(26, 165, 241, 0.6), rgb(200, 240, 240), rgba(88, 234, 172, 0));
    height: 160px;
    display: flex;
}

.wrapper {
    position: relative;
    z-index: 90;
    padding-bottom: 40upx;
}


.input-content {
    padding: 0 60upx;
    margin-top: 13vw;
}

.input-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 0 30upx;
    // background: $page-color-light;
    height: 120upx;
    border-radius: 4px;
    margin-bottom: 50upx;

    &:last-child {
        margin-bottom: 0;
    }

    .tit {
        height: 50upx;
        line-height: 56upx;
        font-size: $font-sm + 2upx;
        color: $font-color-base;
    }

    input {
        height: 60upx;
        font-size: $font-base + 2upx;
        color: $font-color-dark;
        width: 100%;
    }
}



.confirm-btn {
    letter-spacing: 1vw;
    width: 83vw;
    height: 11vw;
    line-height: 76upx;
    border-radius: 50px;
    margin-top: 6vw;
    color: #fff;
    font-size: 5vw;
    background-image: linear-gradient(90deg, #1ba5f1 0%, #57eaac 100%);
    box-shadow: 0vw 2vw 2vw 0vw rgba(34, 217, 233, 0.38);
    border-radius: 5vw;

    &:after {
        border-radius: 100px;
        border: 0;
    }
}



.login-title {
    font-size: 1.3rem;
}

.remember-me {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 70upx;
    margin-top: 6vw;
    color: #2d3931;
    font-size: 24rpx;
}



.privacy-policy {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20vw;
    font-size: 24rpx;
}

.radio-style {
    transform: scale(0.8);
}
</style>
