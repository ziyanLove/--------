const app = getApp();

Page({
  data: {
    navigationSetting: {
      title: '搜索',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    // 默认显示
    search_item: '',
    // 搜索历史
    search_history: [],
    // 控制搜索历史是否显示
    search_history_flag: false,
    // 搜索发现
    search_discovery: [],
    // 控制搜索发现是否显示
    search_discovery_flag: true,
    // 搜索内容
    search_play: [],
    // 控制搜索内容是否显示
    search_display_flag: false,
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 搜索历史和搜索发现的渲染(搜索历史可能隐身，但搜索发现不用更改)
  onLoad: function (option) {
    // 从navgateto中获取默认书本search_item显示
    this.setData({
      search_item: option.search_item
    })
    // 获取本地存储的搜索历史
    const history = wx.getStorageSync('searchHistory')
    if (history) {
      this.setData({
        search_history: history,
        search_history_flag: true
      })
    } else {
      this.setData({
        search_flag: false
      })
    }
    // 发送请求，请求搜索发现
    let that = this
    wx.request({
      url: `${app.globalData.url}/home/searchfind`,
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        // 更新数据
        console.log(res.data);
        that.setData({
          search_discovery: res.data.data
        });
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  // 删除之后搜索历史的渲染
  delete() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success(res) {
        if (res.confirm) {
          wx.clearStorage(),
            that.setData({
              search_history_flag: false
            })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 显示历史情况 + 搜索情况
  onSearch(event) {
    let item
    if (event.detail.value) {
      item = event.detail.value
    } else {
      item = this.data.search_item
    }
    let history = wx.getStorageSync('searchHistory') || []
    // 将内容放到前面
    history.unshift(item)
    // 只留最新的20个
    wx.setStorageSync('searchHistory', history.slice(0, 20))
    // 修改内容
    this.setData({
      search_item: item,
      search_history: history
    })
    // 同时调用查书的函数
    this.searchbook(item)
  },
  // 查书
  searchbook(event) {
    wx.showLoading({title: '加载中…'})
    // 根据不同情况给item赋值，以完成搜索]
    let item
    if (typeof event === 'object') {
      item = event.currentTarget.dataset.item;
    } else {
      if (event == '') {
        item = this.data.search_item
      } else {
        item = this.data.search_item
      }
    }
    console.log(item);
    // 发送搜索书本请求请求数据
    wx.request({
      url: `${app.globalData.url}/home/search`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      // 将搜索内容传输
      data: {
        search_term: item
      },
      success: (res) => {
        // 控制搜索情况使之显示,并取消显示搜索发现和搜索历史
        // 赋值并渲染
        this.setData({
          search_play: res.data.data,
          search_display_flag: true,
          search_discovery_flag: false,
          search_history_flag: false,
        })
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
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
    // }
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
    // }
  }
})