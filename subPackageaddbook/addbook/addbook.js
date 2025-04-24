// subPackagesharednovel/addbook/addbook.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationSetting: {
      title: '添加书籍',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    bookname: '', // 书名
    author: '', // 作者
    message: '', // 提交的信息
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  submitFeedback: function (e) {
    let bookname = e.detail.value.bookname
    let author = e.detail.value.author
    let message = e.detail.value.message
    if (bookname == '' || author == '') {
      wx.showToast({
        title: '请输入完整书本信息！',
        duration: 1000,
      })
    } else {
      // 将想添加的书籍和建议发送
      wx.request({
        url: `${app.globalData.url}/my/complaint`,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        // 需要传给后端的数据
        data: {
          bookname: bookname,
          bookauthor: author,
          message: message
        },
        success: (res) => {
          // 显示提交成功
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000,
            success: () => {
              this.setData({
                message: '',
                bookname: '',
                author: ''
              });
            },
          });
        },
        fail: (res) => {
          wx.showToast({
            title: '提交失败!',
            icon: 'error',
            duration: 1000 //持续的时间
          })
        }
      })
    }

  },
})