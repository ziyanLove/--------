// commpnents/index/index_tab/index_tab.js
const app = getApp();
Component({
  data: {
    // tab栏标头
    navList: ['热门', '畅销', '男生', '女生', '玄幻', '武侠'],
    nav_type: 0,
    // tab栏内容
    tabNav: [{
        tab1: '热门推荐榜',
      },
      {
        tab1: '畅销精选榜',
      },
      {
        tab1: '男生阅读榜',
      },
      {
        tab1: '女生阅读榜',
      },
      {
        tab1: '玄幻推荐榜',
      },
      {
        tab1: '武侠推荐榜',
      },
    ],
    // 书籍tab显示
    booksuggest: [],
    itemWidth: 0,
    windowWidth: 0,
    tabIndex: 0,
    sliderLeft: 0,
    sliderOffset: 0,
    sliderOffsets: [],
  },
  attached(options) {
    let that = this
    wx.request({
      // 第一次请求hot
      url: `${app.globalData.url}/home/book/${0}`,
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
      fail(res) {}
    })
    // 计算
    wx.getSystemInfo({
      success: function (res) {
        // 每个item应占的宽度向上取整，限tab栏不会滑动的情况。
        let windowWidth = res.windowWidth;
        let itemWidth = Math.ceil(windowWidth / that.data.navList.length);
        // 初始化每个项目的偏移量，存入数组
        let tempArr = [];
        for (let i in that.data.navList) {
          tempArr.push(itemWidth * i);
        }
        // 32是两个字体（16px）的宽度。tab中字数不同的话需要调整...
        that.setData({
          sliderLeft: (res.windowWidth / that.data.navList.length - 32) / 2,
          sliderOffsets: tempArr,
          sliderOffset: 0,
          itemWidth: itemWidth,
          windowWidth: windowWidth
        });
      }
    });
  },
  // tab栏跳转
  methods: {
    changeType(e) {
      let {
        index
      } = e.currentTarget.dataset;
      let that = this
      if (that.data.nav_type === index || index === undefined) {
        return false;
      } else {
        // 切换tab
        that.setData({
            nav_type: index
          }),
          // 修改数据
          wx.request({
            // 请求
            url: `${app.globalData.url}/home/book/${index}`,
            method: 'GET',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              that.setData({
                booksuggest: res.data.data
              });
            },
            fail(res) {
              // console.log(res.data);
            }
          })
      }
    },
  }

})