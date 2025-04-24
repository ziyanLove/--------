// subPackagecharactertab/charactes/characters.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '角色档案',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    chapter: {
      bookid: '123',
      bookname: '完美世界',
      chapterid: '1',
      chaptername: '张三',
      gender: '男',
      identity: '男主',
      chaptersrc: '/icon/头像男.jpg',
      birthday: '02/16',
      height: '150',
      weight: '52',
      // 人物关系
      relationships: [{
          name: '李四',
          chapterid: '2',
          relationships: '姐弟'
        },
        {
          name: '王五',
          chapterid: '3',
          relationships: '朋友'
        },
      ],
      // 标签
      chapterspecial: [{
        chapterspecial: '原神'
      }, {
        chapterspecial: '职业选手',
      }, {
        chapterspecial: '捷豹',
      }, {
        chapterspecial: '啊哈',
      }, {
        chapterspecial: '天选之人',
      }]
    },
    flag: 0,
    bookid: '',
    chapterid: '',
    danganflag: true
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
    if (options.chapterid == undefined) {
      wx.showModal({
        title: '提示',
        confirmText: "立即去设置",
        content: '您还没有给此人物设置信息',
        complete: (res) => {
          if (res.cancel) {
            wx.redirectTo({
              url: '/subPackagecharactertab/charactertab/charactertab',
            })
          }
        }
      })
    }
    this.setData({
      bookid: options.bookid,
      chapterid: options.chapterid
    })
  },
  // 角色档案中，点击人物进入另一个人物的详情页
  chaptername: function (e) {
    console.log(e.currentTarget.dataset['chapterid']);
    const chapterid = e.currentTarget.dataset['chapterid']
    wx.navigateTo({
      url: `/subPackagecharactertab/charactes/characters?chapterid=${chapterid}`,
    })
  },
  // 删除角色档案
  deleate() {
    const chapterid = this.data.chapterid
    wx.showModal({
      title: '删除',
      content: '您确定要删除此角色吗?',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后执行删除操作
          wx.request({
            url: `${app.globalData.url}/chaptercard/delcard/${chapterid}`,
            method: 'DELETE',
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              console.log(res.data.data);
              // 删除之后跳转
              wx.navigateBack({
                delta: 1
              })
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    let userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: `${app.globalData.url}/chaptercard/cardinfo`,
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
          chapter: res.data.data[0]
        })
        if(res.data.data[0].userid == 1) {
          that.setData({
            danganflag: false
          })
        }
      },
      fail: res => {
        console.log(res.data);
      }
    })
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