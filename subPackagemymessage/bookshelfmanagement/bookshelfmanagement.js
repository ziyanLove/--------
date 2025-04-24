// subPackagemymessage/bookshelfmanagement/bookshelfmanagement.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '书架管理',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default',
    },
    selected: [],
    state: null,
    booksList: [],
    zhezhaoflag: true
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 取消
  cancle() {
    this.setData({
      selected: [],
      state: false,
      zhezhaoflag: true
    })
  },
  // 选择全部checkbox
  checkAll(e) {
    const checkboxStatus = e.detail.value.length > 0;
    // 取消全选
    if (!checkboxStatus) {
      this.setData({
        selected: [],
        state: false,
        zhezhaoflag: true
      })
    } else {
      // 点击全选
      let all = [];
      this.data.booksList.forEach(book => {
        all.push(book.id)
      })
      this.setData({
        state: true,
        selected: all,
        zhezhaoflag: false
      })
    }
  },
  // 选择单个checkbox
  onSelectedChange: function (e) {
    // 获取被选的书id
    const id = e.currentTarget.dataset.id;
    const checkboxStatus = e.detail.value.length > 0;
    // 复制原始数组 selected，并判断 id 是否已经在原始数组中
    let selected = this.data.selected.slice();
    const indexInselected = selected.indexOf(id);
    if (indexInselected === -1) {
      // 如果 id 不在原始数组中，将其添加到原始数组中
      selected.push(id);
    } else {
      // 如果 id 已经在原始数组中，将其从原始数组中删除
      selected.splice(indexInselected, 1);
    }
    if (this.data.selected.length === -1) {
      this.setData({
        zhezhaoflag: true
      })
    } else {
      this.setData({
        zhezhaoflag: false
      })
    }
    this.setData({
      selected: selected,
      total: selected.length,
    });
  },
  //点击删除
  delete() {
    // 如果选择的书的数量为0，不让删除
    if (this.data.selected.length === 0) {
      wx.showToast({
        title: '请选择删除的书',
        duration: 1500,
        icon: 'none'
      })
      return
    }
    var taht = this
    wx.showModal({
      title: '提示',
      content: '你确定要删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了确定');
          taht.deletebooks(taht.data.selected);
          console.log("删除书的id是", taht.data.selected)
        } else if (res.cancel) {
          console.log('用户点击了取消');
        }
      }
    })
  },
  // 点击置顶 
  zhiding() {
    let userinfo = wx.getStorageSync('userinfo')
    var that = this;
    wx.request({
      // 置顶url，按照顺序置顶
      url: `${app.globalData.url}/bookshelf/gotop`,
      method: 'POST',
      data: {
        userid: userinfo.userid,
        idList: this.data.selected
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data.data);
        that.getbookList();
        that.setData({
          selected: [],
          total: 0,
          state: '',
          booksList: res.data.data
        })
      },
      fail(res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '置顶失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 获取书架里的书
  getbookList() {
    let userinfo = wx.getStorageSync('userinfo')
    var that = this;
    wx.request({
      url: `${app.globalData.url}/bookshelf/bookmanageinfo?userid=${userinfo.userid}`,
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data.data[0].bookcoverurl+"成功")
        that.setData({
          booksList: res.data.data
        })
      },
      fail(res) {
        console.log(res.errMsg + "失败")
      }

    })

  },
  // 删除图书
  deletebooks() {
    let userinfo = wx.getStorageSync('userinfo')
    var that = this;
    wx.request({
      url: `${app.globalData.url}/bookshelf/dels`,
      method: 'POST',
      data: {
        userid: userinfo.userid,
        idList: this.data.selected
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1500
        })
        that.getbookList();
        that.setData({
          selected: [],
          total: 0,
          state: ''
        })
      },
      fail(res) {
        console.log(res.errMsg)
        wx.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getbookList();
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