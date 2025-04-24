// pages/book/book.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '悦听',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default',
    },
    manageHidden: false, //图书管理，浏览记录的显示隐藏
    booksList: [],
    day: {},
    listenlength: '',
    playtime: '',
    phoneheight: '',
  },
  //获取swiper高度
  getHeight: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth - 2 * 100; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var sH = winWid * imgh / imgw + "px"
    this.setData({
      swiperH: sH
    })
  },
  //swiper滑动事件
  swiperChange: function (e) {
    this.setData({
      nowIdx: e.detail.current
    })
  },
  // 跳转图书管理页面
  managebooks() {
    this.setData({
      manageHidden: true
    })
    wx.navigateTo({
      url: '/subPackagemymessage/bookshelfmanagement/bookshelfmanagement',
    })
  },
  // 跳转浏览记录页面
  BrowsingHistory() {
    this.setData({
      manageHidden: true
    })
    wx.navigateTo({
      url: '/subPackagemymessage/browsinghistory/browsinghistory',
    })
  },
  // 图书管理和浏览记录的显示隐藏
  toggleManage() {
    ;
    // 判断当前状态
    if (this.data.manageHidden) {
      this.setData({
        manageHidden: !this.data.manageHidden,
      })
    } else {
      this.setData({
        manageHidden: !this.data.manageHidden,
      })
    }
  },
  // 跳转详情页
  detailpage(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/subPackagedetails/bookdetails/bookdetails?book_id=${id}`,
    })
    if (this.data.manageHidden) {
      this.setData({
        manageHidden: !this.data.manageHidden
      })
    }
  },
  // 去找书
  findbook() {
    this.setData({
      manageHidden: true
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  // 跳转搜索页
  search() {
    this.setData({
      manageHidden: true
    })
    wx.navigateTo({
      url: '/subPackageSearch/search/search',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  //页面一加载发送请求获取
  getbookList() {
    var that = this;
    const userinfo = wx.getStorageSync('userinfo');
    if(userinfo.userid == undefined) {
      wx.request({
        url: `${app.globalData.url}/bookshelf/user?userid=114511`,
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            booksList: res.data.data,
          })
        },
        fail(res) {
          console.log(res.errMsg + "失败了")
        }
      })
    }else {
      wx.request({
        url: `${app.globalData.url}/bookshelf/user?userid=${userinfo.userid}`,
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          that.setData({
            booksList: res.data.data,
          })
        },
        fail(res) {
          console.log(res.errMsg + "失败了")
        }
      })
    }
  },

  dayread() {
    let that = this;
    wx.request({
      url: `${app.globalData.url}/bookshelf/introduction`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          day: res.data.data
        })
      },
      fail(res) {
        console.log(res.errMsg + "失败了")
      }
    })
  },

  getlistenlength() {
    let that = this
    // 请求,请求获得听书时间
    wx.request({
      url: `${app.globalData.url}/bookshelf/minute`,
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        that.setData({
          listenlength: res.data.data
        })
      },
      fail(res) {
        console.log(res.errMsg + "失败了")
      }
    })
  },
  // 效果
  dd() {
    if (this.data.manageHidden) {
      this.setData({
        manageHidden: !this.data.manageHidden
      })
    }
  },

  // 监听页面加载
  onLoad(options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  // 在适当的地方定义 formatTimestamp 方法
  formatTimestamp(timestamp) {
    const minutes = Math.floor(timestamp / 60000);
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
      return `${remainingMinutes}分钟`;
    } else {
      return `${hours}小时${remainingMinutes}分钟`;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userinfo = wx.getStorageSync('userinfo') || {}
    const that = this
    if (Object.keys(userinfo).length == 0) {
      wx.showModal({
        title: '提示',
        content: '悦听想获取您的信息以登录',
        complete: (res) => {
          if (res.confirm) {
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
          }
          if (res.cancel) {
            wx.switchTab({
              url: '/pages/index/index',
            })
          }
        }
      })
    } else {
      // 已登录
      this.getbookList();
      this.getlistenlength();
      this.dayread();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

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