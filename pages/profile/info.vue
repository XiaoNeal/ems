<template>
  <view :style="'background-color:' + bGColor" class="container">
    <u-navbar title="个人信息" :titleStyle="{ 'color': fontColor, 'width': '100%' }" :leftText="null" :autoBack="true"
      :placeholder="true" :bgColor="headerTabBg" :leftIconColor="fontColor"></u-navbar>

    <!-- 个人信息模块 -->
    <view class="section">
      <view class="list" :style="'color:' + fontColor">
        <text style="flex: 1;">个人头像</text>
        <image :src="avatar || '/static/logo_n.png'" mode="aspectFill" style="margin-right: 10px;border-radius: 50%;width: 60rpx;height: 60rpx;" @click="changeAvatar">
        </image>
        <uni-icons type="right" :color="fontColor"></uni-icons>
      </view>
      <view class="list" @click="goto(1)">
        <text style="flex: 1;">用户名</text>
        <text>{{ userName }}</text>
        <uni-icons type="right" />
      </view>

      <view class="list" @click="goto(2)">
        <text style="flex: 1;">手机号码</text>
        <text>{{ phone }}</text>
        <uni-icons type="right" />
      </view>
      <view class="list" @click="goto(3)" :style="'color:' + fontColor">
        <text style="flex: 1;">邮箱</text>
        <text>{{ email }}</text>
        <uni-icons type="right" :color="fontColor"></uni-icons>
      </view>
      <!-- <view class="list" :style="'color:' + fontColor">
        <text style="flex: 1;">注册时间</text>
        <text>{{ registerDate }}</text>
      </view> -->
    </view>


  </view>
</template>

<script>
import store from '@/store'
import {
  updateUserInfo
} from "@/api/user.js"
import md5 from "@/utils/md5.min.js"
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      setUserName: '',
      setUserPhone: '',
      setUserPassword: '',
      isOK: true,
      oldPassword: '',
      // iconColor:'#000',
      isAdmin: null,
      userEmail: 'user@example.com',
      registerDate: '2023-01-01',
      userLevel: 'VIP 1'
    }
  },
  mounted() {

  },
  computed: {
    ...mapState('user', ['userId', 'userName', 'phone', 'email', 'avatar']),
  },
  onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
    this.isAdmin = option.admin
  },


  methods: {
    goto(e) {
      // if (this.isAdmin == "admin") {
      //   this.showToast('error', '您无权修改该账号个人信息')
      //   return
      // }
      uni.navigateTo({
        url: `/pages-public/userOptions/setUserName?type=${e}`
      })
    },
    save() { //保存
      let that = this
      if (!that.isOK) return
      let obj = {
        userId: that.memberId,
        userName: that.setUserName ? that.setUserName : that.userName,
      }
      if (that.setUserPhone != '') {
        obj['Phone'] = that.setUserPhone
      }
      if (that.setUserPassword != '') {
        if (that.oldPassword == '') {
          that.showToast('error', '旧密码不能为空')
          return
        } else {
          obj.oldPassword = md5(that.oldPassword).toString()
          obj.newPassword = md5(that.setUserPassword).toString()
        }

      }

      let formData = JSON.stringify(obj)
      updateUserInfo(formData).then(res => {
        if (res.status == 200) {
          uni.showModal({
            title: '温馨提示',
            content: '修改完成，请点击确定重新登录',
            showCancel: false,
            success(response) {
              if (response.confirm) {
                uni.navigateBack()
                that.$u.vuex('currentTemplate', 0);
              }
            }
          })
        } else if (res.status == 500 && res.msg == '原密码不正确') {
          that.showToast('error', res.msg)
        }
      })
    },

    changeAvatar() {
      // if (this.isAdmin == "admin") {
      //   this.showToast('error', '您无权修改该账号个人信息')
      //   return
      // }
      let that = this
      
      // 获取用户ID
      const userId = this.$store.state.userInfo?.userId || this.$store.state.user?.id || ''
      const token = this.$store.state.token || this.$store.state.user?.token || ''
      
      if (!userId) {
        uni.showToast({
          title: '用户信息未加载',
          icon: 'none'
        })
        return
      }

      uni.chooseImage({
        count: 1,
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          uni.uploadFile({
            url: 'https://iems.nelic.com/SsoServer/es/upload/imageByCodeId',
            filePath: tempFilePaths[0],
            name: 'file',
            formData: {
              CodeId: userId
            },
            header: {
              'Content-Type': 'multipart/form-data',
              token: token
            },
            success: (res) => {
              try {
                const data = JSON.parse(res.data)
                if (data.code === 200) {
                  that.$store.commit('UPDATE_USER', { avatar: data.data.imageUrl })
                  uni.setStorageSync('userInfo', { ...that.$store.state.user, avatar: data.data.imageUrl })
                  uni.showToast({
                    title: '上传成功',
                    icon: 'success'
                  })
                } else {
                  uni.showToast({
                    title: data.msg || '上传失败',
                    icon: 'none'
                  })
                }
              } catch (e) {
                console.error('解析响应失败:', e)
                uni.showToast({
                  title: '解析失败',
                  icon: 'none'
                })
              }
            },
            fail: (err) => {
              console.error('上传失败:', err)
              uni.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          })
        },
        fail: (err) => {
          console.error('选择图片失败:', err)
        }
      })
    },
    showToast(type, title) {
      this.$refs.uToast.show({
        type: type,
        icon: false,
        title: '失败主题',
        message: title
      })
    }
  }
}
</script>

<style scoped lang="scss">
.section {
  margin: 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #f5f5f5;
}

.container {
  height: 100%
}

.list {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.center-list {
  background-color: #16379A;
  padding-left: 9vw;
  padding-right: 9vw;
  margin: 1rem;

  image {
    width: 80rpx;
    height: 80rpx;
  }

}
</style>


<style scoped lang="scss">
.section {
  margin: 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #f5f5f5;
}

.container {
  height: 100%
}

.list {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}

.center-list {
  background-color: #16379A;
  padding-left: 9vw;
  padding-right: 9vw;
  margin: 1rem;

  image {
    width: 80rpx;
    height: 80rpx;
  }

}
</style>
