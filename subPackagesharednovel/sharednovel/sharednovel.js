// subPackagesharednovel/sharednovel/sharednovel.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '爱分享',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default',
    },
    flag: true,
    listData: [],
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const userinfo = wx.getStorageSync('userinfo') || {}
    let that = this
    // 判断是否存在已经授权的用户信息
    if (Object.keys(userinfo).length == 0) {
      // 未登录，好，那就直接跳个登录，登录成功之后跳转到主页
      that.setData({
        flag: true
      })
      // 提示登录
      wx.showModal({
        title: '提示',
        content: '您还未登录，请登录后查看',
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
                    that.setData({
                      userInfo: res.data.data.userInfo,
                    })
                    // 登录成功后进行跳转
                    wx.switchTab({
                      url: '/pages/index/index',
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
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    } else {
      wx.request({
        url: `${app.globalData.url}/my/bookshare?userid=${userinfo.userid}`,
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        // 需要传给后端的数据
        success: (res) => {
          console.log(res.data.data);
          that.setData({
            listData: res.data.data
          })
        },
        fail: function (res) {
          console.log(res)
        }
      }, )
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})