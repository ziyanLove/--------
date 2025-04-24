const app = getApp();

Page({
  data: {
    navigationSetting: {
      title: '悦听',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default',
    },
    // 无限滑轮
    listData: [],
    page: 1,
    itemCount: 10, // 每页展示的项目数
    endIndex: 10, // 初始截止项索引
    scrollHeight: ''
  },

  // 渲染时发送请求，并赋予数据包括swiperlist和search_item
  onLoad(){
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight // 状态栏高度
    const menuButtonRect = wx.getMenuButtonBoundingClientRect() // 菜单按钮信息
    const navBarHeight = statusBarHeight + menuButtonRect.height + (menuButtonRect.top - statusBarHeight) * 2 // 导航栏高度
    const height = navBarHeight + systemInfo.statusBarHeight // 整个导航栏高度
    let scrollHeight = wx.getSystemInfoSync().windowHeight - height + 30
    this.setData({
      scrollHeight: scrollHeight
    })
    this.loadMore()
  },
  // 请求
  onShow() {
    // 获取存储的用户授权信息
    const userinfo = wx.getStorageSync('userinfo') || {}
    // 判断是否存在已经授权的用户信息
    if (Object.keys(userinfo).length == 0) {
      this.setData({
        userInfo: userinfo,
        flag: true
      })
    } else {
      this.setData({
        userInfo: userinfo,
        flag: false
      })
    }
  },
  // 个性化推荐
  //加载更多数据
  loadMore: function () {
    var that = this;
    wx.request({
      url: `${app.globalData.url}/home/scroll/${that.data.page}`,
      method: "GET",
      success: function (res) {
        if (res.data.data.length > 0) {
          that.setData({
            listData: that.data.listData.concat(res.data.data),
            page: that.data.page + 1,
            endIndex: that.data.endIndex + that.data.itemCount,
          });
        } else {
          wx.showToast({
            title: '没有更多数据了',
          });
        }
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      }
    });
  },
  // 分享给其他人
  onShareAppMessage: function (res) {
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
    // }
  },
  // 分享到朋友圈
  onShareTimeline: function (res) {
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
    // }
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
                  console.log(res.data.data);
                  // 将用户授权信息存储到本地
                  wx.setStorageSync('userinfo', res.data.data.userInfo)
                  // 将后端返回的token存储到本地
                  wx.setStorageSync('satoken', res.data.data.token.tokenValue)
                  that.setData({
                    userInfo: res.data.data.userInfo,
                    flag: false
                  })
                },
                fail: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '登录失败',
                    icon: 'error',
                    duration: 1000 //持续的时间
                  })
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
  }
})