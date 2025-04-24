// subPackagecharactertab/useraddcharacter/useraddcharacter.js
const app = getApp()
var startX, endX;
var moveFlag = true; // 判断执行滑动事件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '添加人物',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    radioItems: [{
        name: '男',
        value: '1',
        checked: 'true'
      },
      {
        name: '女',
        value: '0',
      }
    ],
    // 音色选择
    namemap: [{
      mapid: '1',
      nameurl: 'http://82.156.157.176:666/qianduan/开朗青年.jpg',
      namemap: '开朗青年音'
    }, {
      mapid: '2',
      nameurl: 'http://82.156.157.176:666/qianduan/磁性大叔.jpg',
      namemap: '磁性大叔音'
    }, {
      mapid: '3',
      nameurl: 'http://82.156.157.176:666/qianduan/甜美少女.jpg',
      namemap: '甜美少女音'
    }, {
      mapid: '4',
      nameurl: 'http://82.156.157.176:666/qianduan/高冷御姐.jpg',
      namemap: '高冷御姐音'
    }, {
      mapid: '5',
      nameurl: 'http://82.156.157.176:666/qianduan/软萌萝莉.jpg',
      namemap: '软萌萝莉音'
    }, {
      mapid: '6',
      nameurl: 'http://82.156.157.176:666/qianduan/温柔姐姐.jpg',
      namemap: '温柔姐姐音'
    }, ],
    hidden: false,
    namevalue: '',
    shenfenvalue: '',
    checked: '男',
    bookid: '',
    nav_type: '1',
    proList: [],
    scrollLeft: ''
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  radioChange(e) {
    const checked = e.detail.value
    const changed = {}
    for (let i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed['radioItems[' + i + '].checked'] = true
      } else {
        changed['radioItems[' + i + '].checked'] = false
      }
    }
    this.setData(changed)
    this.setData({
      changed: e.detail.value
    })
  },
  xuanshengyin(e) {
    // 先修改值
    // 控制边框变色
    let index = e.currentTarget.dataset.mapid;
    let that = this
    if (that.data.nav_type === index || index === undefined) {
      return false;
    } else {
      // 切换tab
      that.setData({
        nav_type: index
      })
    }
  },
  // 提交
  tijiao() {
    wx.showModal({
      title: '你确定要为本书设计这个角色吗？',
      complete: (res) => {
        if (res.confirm) {
          let userinfo = wx.getStorageSync('userinfo')
          let namevalue = this.data.namevalue
          let identity
          let bookid = this.data.bookid
          let namemap = this.data.nav_type
          let src
          let gender
          // 找到要配置的人物
          this.data.proList.forEach((e) => {
            if (e.selected) {
              namevalue = e.chaptername
              identity = e.identity
              gender = e.gender
              src = e.chaptersrc
            }
          });
          wx.request({
            url: `${app.globalData.url}/chaptercard/addcard`,
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            data: {
              // 书的id
              bookid: bookid,
              // 用户的id
              userid: userinfo.userid,
              // 人物姓名
              chaptername: namevalue,
              // 人物的声音选择
              namemap: namemap,
              // 身份
              identity: identity,
              // 性别
              gender: gender,
              // 头像图片
              chaptersrc: src
            },
            success: res => {
              wx.navigateBack({
                delta: 1
              })
            },
            fail: res => {
              console.log(res.data);
              wx.showToast({
                title: '添加失败',
                icon: 'none'
              })
            }
          })
        }
      }
    })

  },
  // 切换人物
  getSelectItem: function (e) {
    var that = this;
    wx.getSystemInfoAsync({
      success: function (res) {
        that.setData({
          windowWidth: res.windowWidth
        })
      }
    })
    var itemWidth = e.detail.scrollWidth / that.data.proList.length; //每个商品的宽度
    var scrollLeft = e.detail.scrollLeft; //滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth); //通过Math.round方法对滚动大于一半的位置进行进位
    console.log(curIndex);
    var centerPosition = (that.data.windowWidth - itemWidth) / 4; //计算位置
    var scrollTo = curIndex * itemWidth - centerPosition; //最终结果
    console.log(scrollTo);
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
      that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
      proList: that.data.proList,
      giftNo: this.data.proList[curIndex].id,
      scrollLeft: scrollTo
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      bookid: options.bookid
    })
    let that = this
    let userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: `${app.globalData.url}/chaptercard/personinfo`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        // 书的id
        bookid: that.data.bookid,
        // 用户的id
        userid: userinfo.userid,
      },
      success: res => {
        console.log(res.data.data);
        that.setData({
          proList: res.data.data
        })
      },
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