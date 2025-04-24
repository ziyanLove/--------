// subPackagecharactertab/charactertab/charactertab.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '设置人物选项卡',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    chapterinfo: [],
    bookid: '',
    loadingflag: true,
    selected: ''
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
    this.setData({
      bookid: options.bookid
    })
  },
  onShow() {
    this.qidong()
  },
  qidong() {
    let bookid = this.data.bookid
    let that = this
    // 发送请求请求人物选项卡(已经设置的)
    let userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: `${app.globalData.url}/chaptercard/cardbase`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userid: userinfo.userid,
        bookid: bookid
      },
      success: res => {
        that.setData({
          chapterinfo: res.data.data,
          loadingflag: false
        })
      },
      fail: res => {
        console.log(res.data);
      }
    })
  },
  getSelectItem(e) {
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.chapterinfo.length; //每个商品的宽度
    var scrollLeft = e.detail.scrollLeft; //滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth); //通过Math.round方法对滚动大于一半的位置进行进位
    for (var i = 0, len = that.data.chapterinfo.length; i < len; ++i) {
      that.data.chapterinfo[i].selected = false;
    }
    that.data.chapterinfo[curIndex].selected = true;
    if( (scrollLeft/itemWidth) > (that.data.chapterinfo.length-1)){
      that.setData({
        selected: true
      })
      that.data.chapterinfo[curIndex].selected = false;
    }
    if( (scrollLeft/itemWidth) < (that.data.chapterinfo.length-1)) {
      that.setData({
        selected: false
      })
      that.data.chapterinfo[curIndex].selected = true;
    }
    that.setData({
      chapterinfo: that.data.chapterinfo,
      giftNo: this.data.chapterinfo[curIndex].id,
      scrollLeft: scrollLeft
    });
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