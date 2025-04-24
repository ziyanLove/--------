const app = getApp();
Component({
  data: {
    height: app.globalData.navBarHeight + app.globalData.statusBarHeight,    // 整个导航栏高度
    statusBarHeight: app.globalData.statusBarHeight,     // 状态栏高度
    navBarHeight: app.globalData.navBarHeight + 0.5,     // 导航栏高度
  },
  // 多slot支持
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  // 获得
  onLoad() {
    const systemInfo = wx.getSystemInfoSync()
    const statusBarHeight = systemInfo.statusBarHeight // 状态栏高度
    const menuButtonRect = wx.getMenuButtonBoundingClientRect() // 菜单按钮信息
    const navBarHeight = statusBarHeight + menuButtonRect.height + (menuButtonRect.top - statusBarHeight) * 2 // 导航栏高度
    const height = navBarHeight + systemInfo.statusBarHeight // 整个导航栏高度
    this.setData({
      statusBarHeight,
      navBarHeight,
      height
    })
  },
  //接收 外部传入到属性值
  properties: {
    defaultSetting: {
      type: Object,
      value: {
        title: '悦听',
        height: 20,
        paddingTop: 0,
        backgroundColor: '#fff',
        size: 'default'
      }
    },
  },
})