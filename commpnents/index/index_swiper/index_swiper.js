const app = getApp();
Component({
  data: {
    // 轮播图显示
    swiperlist: [],
    swiperIndex: 0
  },
  methods: {
    change(e) {
      this.setData({
        swiperIndex: e.detail.current
      })
    },
  },
  /* 生命周期函数--页面加载调用 请求获得数据并渲染 */
  attached() {
    let that = this
    wx.request({
      url: `${app.globalData.url}/home/rotation`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 更新数据
        that.setData({
          swiperlist: res.data.data
        });
      },
      fail(res) {
        console.log(res);
      }
    })
  },
})