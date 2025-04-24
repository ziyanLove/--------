// subPackagecharactertab/characterrelationship/characterrelationship.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '人物关系',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    // 关系
    relationships: [{
        name: '李四',
        chapterid: '2',
        relationships: '姐弟',
        relationshipid: '10'
      },
      {
        name: '王五',
        chapterid: '3',
        relationships: '朋友',
        relationshipid: '11'
      }
    ],
    showModalStatus: false,
    valuename: '',
    valuerelations: '',
    bookid: '',
    chapterid: '',
    chaptername: ''
  },
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
  // bindput实时监控valuename和valuerelations的值
  inputCom1(e) {
    this.setData({
      valuename: e.detail.value
    })
  },
  inputCom2(e) {
    this.setData({
      valuerelations: e.detail.value
    })
  },
  // 添加关系
  addrelations(e) {
    // 截头去尾取出用户输入的空格
    let valuename = this.data.valuename
    let valuerelations = this.data.valuerelations
    let userinfo = wx.getStorageSync('userinfo')
    let bookid = this.data.bookid
    let that = this
    if (valuename === undefined || valuename == '') {
      wx.showToast({
        title: '关联人不可为空！',
        icon: 'none'
      })
    } else if (valuerelations === undefined || valuerelations == '') {
      wx.showToast({
        title: '关系不可为空！',
        icon: 'none'
      })
    } else {
      wx.request({
        url: `${app.globalData.url}/chaptercard/addrelationship`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: {
          bookid: bookid,
          userid: userinfo.userid,
          chapterid: that.data.chapterid,
          valuename: valuename,
          valuerelations: valuerelations
        },
        success: res => {
          that.setData({
            chapterspecial: res.data.data,
            valuename: '',
            valuerelations: ''
          })
          that.xianshi()
        },
        fail: res => {
          console.log(res.data);
        }
      })
      that.powerDrawer()
    }
  },
  // 点击进入另一个人的详情页
  // chaptername: function (e) {
  //   console.log(e.currentTarget.dataset['chapterid']);
  //   const chapterid = e.currentTarget.dataset['chapterid']
  //   wx.navigateTo({
  //     url: `/subPackagecharactertab/charactes/characters?chapterid=${chapterid}`,
  //   })
  // },
  // 删除关系
  shanchu(e) {
    let bookid = this.data.bookid
    let chapterid = this.data.chapterid
    let {
      relationshipid
    } = e.currentTarget.dataset
    let that = this
    wx.showModal({
      title: '删除',
      content: '您确定要删除此标签吗?',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后执行删除操作
          wx.request({
            url: `${app.globalData.url}/chaptercard/delrelationship/${relationshipid}`,
            method: 'DELETE',
            header: {
              'content-type': 'application/json'
            },
            success: res => {
              that. xianshi()
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
    // 请求默认标签
    let bookid = options.bookid
    let chapterid = options.chapterid
    let chaptername = options.chaptername
    let userinfo = wx.getStorageSync('userinfo')
    this.setData({
      bookid: bookid,
      chapterid: chapterid,
      chaptername: chaptername
    })
  },
  // 监听总执行
  xianshi(){
    let that = this
    const userinfo = wx.getStorageSync('userinfo')
    wx.request({
      url: `${app.globalData.url}/chaptercard/relationship`,
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
          relationships: res.data.data,
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
   this. xianshi()
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