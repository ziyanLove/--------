// subPackagemymessage/browsinghistory/browsinghistory.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '浏览记录',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default',
    },
    //浏览记录
    booksList: [],
    content: '+ 书架',
    yangshi: ''
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onShow() {},
  // 添加书架
  add(e) {
    let userinfo = wx.getStorageSync('userinfo')
    const bookid = e.currentTarget.dataset.id;
    const that = this;
    wx.request({
      url: `${app.globalData.url}/bookinfo/joinshelf`,
      method: 'POST',
      data: {
        userid: userinfo.userid,
        bookid: bookid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        // 成功添加书架后不在给第二次后端发请求获取最新的数据，而是只是改变已经添加书架的书的态
        that.changeaddstate(bookid);
        that.Getbrowsingbooks();
      },
      fail(res) {
        that.changeaddstate(bookid);
        console.log(res.errMsg)
        wx.showToast({
          title: '添加图书失败',
          duration: 1500,
          icon: 'none'
        })
        // that.changeaddstate(bookid);
      }
    })
  },

  // 删除图书
  removebook(bookid) {
    let userinfo = wx.getStorageSync('userinfo')
    const that = this;
    wx.request({
      url: `${app.globalData.url}/history/delone`,
      method: 'POST',
      data: {
        userid: userinfo.userid,
        bookid: bookid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        that.Getbrowsingbooks();
        wx.showToast({
          title: '删除成功',
          duration: 1500,
          icon: 'none'
        })
      },
      fail(res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '删除图书失败',
          duration: 1500,
          icon: 'none'
        })
      }
    })
  },

  // 单个删除记录
  delete(e) {
    const bookid = e.target.dataset.id;
    var taht = this
    wx.showModal({
      title: '提示',
      content: '你确定要删除此记录吗？',
      success: function (res) {
        if (res.confirm) {
          taht.removebook(bookid);
        } else if (res.cancel) {
          console.log('用户点击了取消');
        }
      }
    })
  },
  // 添加书架
  changeaddstate(id) {
    const booksList = this.data.booksList.map(book => {
      if (book.id === id) {
        book.have = 1; // 将该图书设置为已添加
      }
      return book;
    });
    this.setData({
      booksList: booksList
    })
  },
  //  清空
  clearAll() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '你确定清空吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了确定');
          // 清除浏览记录
          that.clearAll1();
        } else if (res.cancel) {
          console.log('用户点击了取消');
        }
      }
    })
  },
  clearAll1() {
    let userinfo = wx.getStorageSync('userinfo')
    var that = this;
    wx.request({
      url: `${app.globalData.url}/history/delall/${userinfo.userid}`,
      method: 'DELETE',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log("删除成功")
        that.Getbrowsingbooks();
      },
      fail(err) {
        console.log("删除失败")
      }
    })
  },
  Getbrowsingbooks() {
    let userinfo = wx.getStorageSync('userinfo')
    const that = this;
    // 获取浏览记录
    wx.request({
      url: `${app.globalData.url}/history/bookrecord?userid=${userinfo.userid}`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data);
        that.setData({
          booksList: res.data.data
        })
      },
      fail(res) {
        console.log("失败了")
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.Getbrowsingbooks()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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