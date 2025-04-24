// subPackagecharactertab/addnotice/addnotice.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '标签',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    chapterspecial: [{
      chapterspecialid: '1',
      chapterspecial: '原神'
    }, {
      chapterspecialid: '2',
      chapterspecial: '职业选手',
    }, {
      chapterspecialid: '3',
      chapterspecial: '捷豹',
    }, {
      chapterspecialid: '4',
      chapterspecial: '啊哈',
    }, {
      chapterspecialid: '5',
      chapterspecial: '天选之人',
    }],
    showModalStatus: false,
    bookid: '',
    chapterid: ''
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });
    this.animation = animation;
    // 执行动画：Y轴偏移240px后(盒子高度是240px)，停
    animation.translateY(240).step();
    this.setData({
      animationData: animation.export()
    })
    // 执行第二组动画
    setTimeout(function () {
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
      //关闭抽屉
      if (currentStatu == "close") {
        this.setData({
          showModalStatus: false
        });
      }
    }.bind(this), 200)
    // 显示抽屉
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },
  // 添加标签
  addnotice(e) {
    // 截头去尾取出用户输入的空格
    let value = this.data.value.trim()
    let bookid = this.data.bookid
    let chapterid = this.data.chapterid
    let userinfo = wx.getStorageSync('userinfo')
    const that = this
    if (value === undefined || value == '') {
      wx.showToast({
        title: '不可为空！',
        icon: 'none'
      })
    } else {
      wx.request({
        url: `${app.globalData.url}/chaptercard/addspecial`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          bookid: bookid,
          userid: userinfo.userid,
          chapterid: chapterid,
          chapterspecial: value
        },
        success: res => {
          that.qingqiu()
          that.setData({
            chapterspecial: res.data.data,
            value: ''
          })
        },
        fail: res => {
          console.log(res.data);
        }
      })
      that.setData({
        showModalStatus: false
      });
    }
  },
  // 删除标签
  shanchu(e) {
    let bookid = this.data.bookid
    let chapterid = this.data.chapterid
    let {
      chapterspecialid
    } = e.currentTarget.dataset
    let that = this
    wx.showModal({
      title: '删除',
      content: '您确定要删除此标签吗?',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后执行删除操作
          wx.request({
            url: `${app.globalData.url}/chaptercard/delspecial/${chapterspecialid}`,
            method: 'delete',
            header: {
              'content-type': 'application/json'
            },
            data: {
              bookid: bookid,
              chapterid: chapterid,
              chapterspecialid: chapterspecialid,
            },
            success: res => {
              console.log(res.data.data);
              that.qingqiu()
            },
            fail: res => {
              console.log(res.data);
            }
          })
        } else { //这里是点击了取消以后什么也不做
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 请求默认关系
    let bookid = options.bookid
    let chapterid = options.chapterid
    this.setData({
      bookid: bookid,
      chapterid: chapterid
    })
    this.qingqiu()
  },
  // 进入页面直接请求
  qingqiu(){
    let that = this
    const userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: `${app.globalData.url}/chaptercard/special`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        bookid: that.data.bookid,
        userid: userinfo.userid,
        chapterid: that.data.chapterid
      },
      success: res => {
        that.setData({
          chapterspecial: res.data.data,
          value: ''
        })
      },
      fail: res => {
        console.log(res.data);
      }
    })
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