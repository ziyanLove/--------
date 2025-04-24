// pages/mine/mine.js
const app = getApp();
Page({
  /* 页面的初始数据  */
  data: {
    navigationSetting: {
      title: '悦听',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    // 用户头像
    avatarUrl: '',
    // 控制用户登录注册显示什么
    login_flag: true,
    // 获取到的用户信息
    userInfo: {},
    loadingflag: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    // 获取存储的用户授权信息
    const userinfo = wx.getStorageSync('userinfo') || {}
    // 判断是否存在已经授权的用户信息
    if (Object.keys(userinfo).length == 0) {
      this.setData({
        // 更改用户信息
        userInfo: userinfo,
        // true就是提示登录
        login_flag: true,
      })
    } else {
      this.setData({
        // 更改用户信息
        userInfo: userinfo,
        // false就是显示用户名
        login_flag: false,
        // 头像
        avatarUrl: userinfo.avatarUrl,
      })
    }
    let that = this
    setTimeout(function() {
      that.setData({
        loadingflag: false
      })
      }, 300);
  },
  // 登录
  getUser() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '悦听想获取您的信息以登录',
      success(res) {
        if (res.confirm) {
          //先获取登录凭证
          let code;
          wx.login({
            success: res => {
              // 赋值
              code = res.code;
              // 请求用户登录信息和token
              wx.request({
                url: `${app.globalData.url}/wechat/login`,
                method: 'POST',
                header: {
                  'content-type': 'application/json'
                },
                // 需要传给后端的数据
                data: {
                  code: code,
                },
                success: (res) => {
                  // 将用户授权信息存储到本地
                  wx.setStorageSync('userinfo', res.data.data.userInfo)
                  // 将后端返回的token存储到本地
                  wx.setStorageSync('satoken', res.data.data.token.tokenValue)
                  let userinfo = res.data.data.userInfo
                  that.setData({
                    // 更改用户信息
                    userInfo: userinfo,
                    // 切换成头像用户名
                    login_flag: false,
                    // 头像
                    avatarUrl: userinfo.avatarUrl,
                  })
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            },
            fail: res => {
              wx.showToast({
                title: '登录失败',
                icon: 'error',
                duration: 1000 //持续的时间
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 切换头像
  onChooseAvatar(e) {
    let that = this
    const url = e.detail //获取图片临时路径
    console.log(url);
    const userinfo = wx.getStorageSync('userinfo')
    // 发送请求，后台保存这个临时的头像地址
    wx.uploadFile({
      url: `${app.globalData.url}/my/picupdate`, //地址
      filePath: url.avatarUrl, //上传资源的路径
      name: 'picurl', //自定义名称
      formData: {
        userid: userinfo.userid
      },
      success(res) {
        console.log(res.data);
        // 先修改
        that.setData({
          avatarUrl: res.data
        })
        // 将获得的头像地址保存到本地中
        wx.setStorageSync('avatarUrl', url)
      },
      fail(err) {
        console.log(err);
        wx.showToast({
          title: '上传失败',
          icon: 'error',
          duration: 1000 //持续的时间
        })
      }
    })
  },
  // 切换用户名
  getnickname(e) {
    // 获取存储的用户授权信息
    const userinfo = this.data.userInfo
    let name = e.detail.value
    // 发送请求将userInfo更新
    wx.request({
      url: `${app.globalData.url}/my/changename`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      // 需要传给后端的数据
      data: {
        userid: userinfo.userid, // userinfo.openid
        name: name
      },
      success: (res) => {
        // 将用户输入的用户名赋值
        this.data.userInfo.nickName = name
        // 将用户授权信息存储到本地
        wx.setStorageSync('userinfo', this.data.userInfo)
        let userinfo = wx.getStorageSync('userinfo')
        console.log(res.data);
        this.setData({
          userInfo: userinfo
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '修改失败',
          icon: 'error',
          duration: 1000 //持续的时间
        })
      }
    })
  },
  // 分享给其他人
  onShareAppMessage(res) {
    return {
      title: '悦听',
      path: '/pages/index/index', // 显示的页面
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 500 //持续的时间
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '修改失败',
          icon: 'error',
          duration: 1000 //持续的时间
        })
      }
    }
  },
  // 分享到朋友圈
  onShareTimeline(res) {
    return {
      title: '悦听',
      path: '/pages/index/index', // 显示的页面
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 500 //持续的时间
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '修改失败',
          icon: 'error',
          duration: 1000 //持续的时间
        })
      }
    }
  },
  // 手动分享
  shareapp() {
    this.onShareAppMessage();
  },
  // 退出登录
  loginout() {
    const userinfo = wx.getStorageSync('userinfo') || {}
    if(Object.keys(userinfo).length == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '您确定要退出登录吗',
        success: function (res) {
          if (res.confirm) { //这里是点击了确定以后
            wx.setStorageSync('token', ''); //将token置空
            wx.setStorageSync('userinfo', {}) // 将存储的用户信息置空
            wx.reLaunch({
              url: '/pages/index/index',
            })
          } else { //这里是点击了取消以后
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 进入我分享的书界面
  mysharebook() {
    wx.navigateTo({
      url: '/subPackagesharednovel/sharednovel/sharednovel',
    })
  },
  // 进入用户须知界面
  userknow() {
    wx.navigateTo({
      url: '/commpnents/usersnotice/usersnotice',
    })
  },
  // 进入问题反馈页面
  noticefankui() {
    wx.navigateTo({
      url: '/subPackagesharednovel/feedback/feedback',
    })
  },
})