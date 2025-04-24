// subPackagedetails/bookdetails/bookdetails.js
const app = getApp();
var minOffset = 30;
var minTime = 60;
var startX = 0; //开始坐标1111
var startY = 0;
var startTime = 0;

Page({
  data: {
    navigationSetting: {
      title: '悦听',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    height: '41',
    hid: '450rpx',
    // 背景色
    backgrounds: [
      'background: linear-gradient(220.55deg, #FF8570 0%, #418CB7 100%);',
      'background: linear-gradient(220.55deg, #00E0EE 0%, #AD00FE 100%);',
      'background: linear-gradient(220.55deg, #61C695 0%, #133114 100%);',
      'background: linear-gradient(220.55deg, #5D85A6 0%, #0E2C5E 100%);',
      'background: linear-gradient(220.55deg, #FF9D7E 0%, #4D6AD0 100%);',
      'background: linear-gradient(220.55deg, #24CFC5 0%, #001C63 100%);',
      'background: linear-gradient(220.55deg, #5EE2FF 0%, #00576A 100%);',
      'background: linear-gradient(220.55deg, #a8c0ff 0%, #3f2b96 100%);',
      'background: linear-gradient(220.55deg, #a8c0ff 0%, #3f2b96 100%);',
      'background: linear-gradient(220.55deg, #ffd89b 0%, #19547b 100%);',
    ],
    backgroudl: '',
    // 推荐
    booksuggest: [],
    // 书本详情
    bookinfo: {},
    // 判断本书是否在书架
    bookflag: '0',
    tabflag: 'true',
    zisize: 10,
    bookid: '',
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 收藏该书
  collectionbook: function (e) {
    let userinfo = wx.getStorageSync('userinfo') || {}
    let that = this
    if (Object.keys(userinfo).length == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.request({
        // 请求
        url: `${app.globalData.url}/bookinfo/joinshelf`, //发送请求
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          userid: userinfo.userid, //userinfo.openid
          bookid: this.data.bookid
        },
        success(res) {
          // 更新数据
          that.setData({
            bookflag: 1
          });
        },
        fail(res) {
          // console.log(res.data);
        }
      })
    }
  },
  // 取消收藏该书
  deletecollectbook: function (e) {
    let userinfo = wx.getStorageSync('userinfo') || {}
    let that = this
    wx.request({
      // 请求
      url: `${app.globalData.url}/bookshelf/dels`, //发送请求
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        userid: userinfo.userid, //userinfo.openid
        idList: [`${this.data.bookid}`]
      },
      success(res) {
        // 更新数据
        that.setData({
          bookflag: 0
        });
      },
      fail(res) {
        // console.log(res.data);
      }
    })
  },
  // 跳转到设置人物选项卡界面
  shezhi() {
  let userinfo = wx.getStorageSync('userinfo') || {}
  let that = this
  let bookid = this.data.bookid
  if (Object.keys(userinfo).length == 0) {
    wx.showToast({
      title: '请先登录',
      icon: 'none'
    })
  }else {
    wx.navigateTo({
      url: `/subPackagecharactertab/charactertab/charactertab?bookid=${bookid}`,
    })
  }
  },
  // 切换tab栏
  changeTab: function (e) {
    let stabflag = !this.data.tabflag
    this.setData({
      tabflag: stabflag
    });
  },
  onLoad: function (options) {
    this.setData({
      bookid: options.book_id
    })
    // 换色
    let min = Math.ceil(0);
    let max = Math.floor(9);
    let shul = Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    let that = this
    that.setData({
      backgroudl: this.data.backgrounds[shul],
    })
    // 发送请求，详情页和图书推荐页,并渲染
    // 先请求图书推荐功能
    let userinfo = wx.getStorageSync('userinfo') || {}
    wx.request({
      // 请求
      url: `${app.globalData.url}/bookinfo/recommend`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 更新数据
        that.setData({
          booksuggest: res.data.data
        });
      },
      fail(res) {
        // console.log(res.data);
      }
    })
    // 紧接着请求图书详情页
    let book_id = options.book_id
    wx.request({
      // 请求
      url: `${app.globalData.url}/bookinfo/base`, //发送请求
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        userid: userinfo.userid, //userinfo.userid
        bookid: book_id
      },
      success(res) {
        // 更新数据
        that.setData({
          bookinfo: res.data.data,
          bookflag: res.data.data.shelfStatu
        });
      },
      fail(res) {
        // console.log(res.data);
      }
    })
  },
  // 抽屉
  touchStart: function (e) {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
    startTime = new Date().getTime();
  },
  touchCancel: function (e) {
    startX = 0; //开始时的X坐标
    startY = 0; //开始时的Y坐标
    startTime = 0; //开始时的毫秒数
  },
  touchEnd: function (e) {
    var endX = e.changedTouches[0].pageX;
    var endY = e.changedTouches[0].pageY;
    var touchTime = new Date().getTime() - startTime; //计算滑动时间
    //开始判断
    if (touchTime >= minTime) {
      var xOffset = endX - startX;
      var yOffset = endY - startY;
      if (Math.abs(xOffset) >= Math.abs(yOffset) && Math.abs(xOffset) >= minOffset) {
        if (xOffset < 0) {} else {}
      } else if (Math.abs(xOffset) < Math.abs(yOffset) && Math.abs(yOffset) >= minOffset) {
        //上下滑动
        if (yOffset < 0 || (e.target.offsetTop > 400)) {
          this.setData({
            height: 50
          })
        } else {
          this.setData({
            height: 25
          })
        }
      }
    } else {
      console.log('滑动时间过短', touchTime)
    }
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
  },
})