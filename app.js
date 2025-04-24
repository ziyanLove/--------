//app.js

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    const systemInfo = wx.getSystemInfoSync(); //获取系统信息
    const menuInfo = wx.getMenuButtonBoundingClientRect(); // 获取胶囊按钮的信息
    this.globalData.menuHeight = menuInfo.height; // 获取胶囊按钮的高
    this.globalData.statusBarHeight = systemInfo.statusBarHeight; // 获取状态栏的高
    this.globalData.menuRight = menuInfo.right; // 获取胶囊按钮的距离屏幕最右边的距离（此处用于设置导航栏左侧距离屏幕的距离）
    this.globalData.navBarHeight = (menuInfo.top - systemInfo.statusBarHeight) * 2 + menuInfo.height; // 计算出导航栏的高度
    // 拿到userinfo
    let userinfo = wx.getStorageSync('userinfo') || {}
    if (Object.keys(userinfo).length == 0) {
      // 假如没有登录信息就不用管
    } else {
      // 假如有登录信息
      let satoken = wx.getStorageSync('satoken')
      const that = this
      // 发送请求判断token是否过期
      console.log();
      wx.request({
        url: `${that.globalData.url}/Redis`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          satoken: satoken
        },
        success: res => {
          wx.setStorageSync('satoken', res.data.tokenValue)
        },
        fail: res => {
          // 提示登录过期重新登录
          wx.showToast({
            title: '您的登陆已过期，请重新登录',
            icon: 'none',
            duration: 2000,
            complete: res => {
              // 先执行一次退出登录
              wx.removeStorageSync('userinfo')
              wx.removeStorageSync('satoken')
              // 然后把页面进行跳转
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
        }
      })
    }
  },
  globalData: {
    navBarHeight: 0, // 导航栏高度
    menuHeight: 0, //胶囊按钮 高度
    statusBarHeight: 0, //状态栏高度
    menuRight: 0, //胶囊按钮 距离屏幕右边的距离
    url: 'https://www.yueting666.top'
  }
})