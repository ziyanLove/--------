// subPackagelisteningdetails/listeningdetails/listeningdetails.js
const app = getApp();
// 格式化时间
function formatTime(time) {
  var minute = Math.floor(time / 60) % 60;
  var second = Math.floor(time) % 60
  return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
}
// 创建一个音频实例
const innerAudioContext = wx.createInnerAudioContext({
})
Page({
  data: {
    navigationSetting: {
      title: '悦听',
      height: app.globalData.navBarHeight,
      paddingTop: app.globalData.statusBarHeight,
      backgroundColor: '#fff',
      size: 'default'
    },
    showList: false, //播放列表默认是隐藏的
    speesList: false, //倍速播放列表默认是隐藏的
    housing: false,
    loading: false,
    bookid: '',
    playlist: [], // 播放列表数组playlist
    doublespeed: ['0.5', '0.75', '1.0', '1.25', '1.5', '2.0'],
    state: 'paused', //播放状态
    playIndex: 0, //播放的索引
    play: {
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      bookcoverurl: '',
      id: '',
    },
    booksList: '', //是否在书架中存在
    playspeed: '1.0', //默认播放速度
    showplayspeedIndex: 2, //默认播放速度1.0对应倍速播放列表中的第二个
    order: true, //播放顺序true为正序播放,
    AIText: false, //AI文稿默认是隐藏的,
    bookText: {
      content: '<div>' +
        '<p style="text-indent:2em;">中国发展是一个令世界瞩目的奇迹。几十年来，中国经济快速发展，取得了卓越的成就。</p>' +
        '<p style="text-indent:2em;">在过去的几十年里，中国实现了从封闭到开放、从贫穷到富裕的巨大转变。中国坚持科技创新，加强教育，提高人民的生活水平。中国的经济改革和开放政策为国家的发展做出了巨大贡献。</p>' +
        '<p style="text-indent:2em;">中国的经济增长不仅带来了实实在在的经济利益，也增强了国家的影响力和地位。中国逐渐成为全球制造业和贸易的中心。中国坚持走和平发展的道路，积极参与全球事务并推动全球治理体系的改革。</p>' +
        '<p style="text-indent:2em;">除了经济领域，中国在科技、教育、文化、体育等领域也取得了重大进展。中国在人工智能、5G技术、航天航空等方面处于世界领先地位。中国的文化传统深厚，悠久的历史、丰富的文化资源为世界所称颂。</p>' +
        '<p>中国发展还面临一些挑战，如人口老龄化、环境污染和经济结构转型等。然而，中国政府采取了有力的措施来解决这些问题，并致力于实现可持续发展。未来，中国将继续推进改革开放，促进经济社会发展，为世界贡献更多。</p>' +
        '<p style="text-indent:2em;">中国的发展让我们深感自豪和振奋。作为中国人，我们应该为中国的成就感到骄傲，并为中国梦的实现而努力奋斗。相信在不久的将来，中国将继续迈向更加美好的未来！</p>' +
        '</div>',
      title: '中国的近期发展',
    },
    playtime: 0, //记录开始播放的时间
    scrolltop: 0,
    gatherid: '', //目录id
    voicesettings: false, //声音设置默认是隐藏的
    roles: [ //角色
      {
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
      },
    ],
    voiceselected: 1, //选择声音，默认是第一个
    bookcoverurl: '',
    bookname: '',
    videourl: '', //播放地址
    audioCurrentTime: 0, // 音频当前播放时间
    audioDuration: 0, // 音频总时长
    sliderValue: 0, // 滑动条当前值
    sliderMax: 0, // 滑动条最大值
    myAudioPos: 0,
    namemap: {},
    loadingflag: true,
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
  },
  // 返回
  reindex: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 改变顺序
  order() {
    const playlist = this.data.playlist;
    const playIndex = this.data.playIndex;
    // 改变顺序(反转数组)
    const reversedPlaylist = [...playlist].reverse();
    // 找到当前播放音频在新的播放列表中的索引位置
    const newIndex = reversedPlaylist.indexOf(playlist[playIndex]);
    this.setData({
      order: !this.data.order,
      playlist: reversedPlaylist,
      playIndex: newIndex
    })
  },
  // 隐藏音频，倍速，文本列表
  onHideSongList: function (event) {
    const target = event.currentTarget;
    const id = event.target.id;
    if (target && id == "myy") {
      this.setData({
        showList: false,
        housing: false,
        speedList: false,
        AIText: false,
        voicesettings: false
      });
    }
  },
  // 显示音频列表
  onShowSongList: function () {
    this.setData({
      showList: true,
      housing: true,
      scrolltop: this.data.order ? this.data.play.id * 66 : this.data.play.id * 160
    });
  },
  // 选择再播放
  selectplay(e) {
    const index = e.currentTarget.dataset.index;
    this.getmusic(index);
  },
  // 往前跳15秒
  qian() {
    let currentTime1 = parseInt(innerAudioContext.currentTime) - 15;
    console.log(currentTime1);
    if (currentTime1 <= 0) {
      currentTime1 = 0;
    }
    innerAudioContext.seek(currentTime1);
    this.setData({
      audioCurrentTime: formatTime(currentTime1),
    })
  },
  // 往后跳15秒
  hou() {
    let currentTime1 = parseInt(innerAudioContext.currentTime) + 15;
    if (currentTime1 >= this.data.audioCurrentTime + 15) {
      currentTime1 = this.data.audioCurrentTime;
    }
    innerAudioContext.seek(currentTime1);
    this.setData({
      audioCurrentTime: formatTime(currentTime1),
    })
  },
  sliderChangeLock: false, // 判断slider是否在滑动
  // 滑动slider时触发
  sliderChange: function (e) {
    var second = e.detail.value * innerAudioContext.duration / 100
    innerAudioContext.seek(second)
    setTimeout(() => {
      this.sliderChangeLock = false
    }, 1000)
  },
  // 滑动完slider后触发
  sliderChanging: function (e) {
    const position = e.detail.value;
    console.log(position);
    var currentTime = position / 100 * innerAudioContext.duration;
    innerAudioContext.seek(currentTime); //跳跃这些
    this.setData({
      myAudioPos: position,
      audioCurrentTime: formatTime(currentTime) //当前音频播放进度
    })
  },
  // 设置当前播放的曲目
  setMusic: function (index) {
    console.log(123);
    let music = this.data.playlist[index]
    console.log(music);
    if (!music.src) { //如果music.src不存在，给后台发请求获取过来
      this.getmusic(music.id, index);
    } else {
      this.audioBam.src = music.src
      this.audioBam.title = music.title
      this.setData({
        playIndex: index,
        'play.title': music.title,
        'play.singer': music.singer,
        'play.coverImgUrl': music.ImgUrl,
        'play.currentTime': '00:00',
        'play.duration': '00:00',
        'play.percent': 0,
        'play.id': music.id,
        'play.directoryname': music.directoryname,
        'play.bookname': music.bookname,
        state: 'running' // 新增
      })
    }

  },
  // 播放
  play() {
    innerAudioContext.play() // 播放
    this.setData({
      state: 'running'
    })
    innerAudioContext.onTimeUpdate(() => {
      this.setData({
        myAudioPos: innerAudioContext.currentTime / innerAudioContext.duration * 100,
        audioCurrentTime: formatTime(innerAudioContext.currentTime)
      });
    })
  },
  // 暂停
  pause() {
    innerAudioContext.pause() // 暂停
    this.setData({
      state: 'paused'
    })
  },
  // 下一个
  next() {
    // if (this.data.gatherid == gahterid) {
    //   wx.showToast({
    //     title: '已经最后一个了',
    //     icon: 'none',
    //     duration: 500
    //   })
    //   return
    // }
    let gatherid = Number(this.data.gatherid) + 1
    this.getmusic(gatherid)
  },
  // 上一个
  prev() {
    // if (this.data.IsOne) {
    //   wx.showToast({
    //     title: '已经是第一个了',
    //     icon: 'none',
    //     duration: 500
    //   })
    //   return
    // }
    var gatherid = Number(this.data.gatherid) - 1
    this.getMusic(gatherid)
  },
  // 倍速播放的点击
  Doublespeed() {
    this.setData({
      'speedList': true,
      'housing': true
    })
  },
  // 关闭倍速窗口
  closespeedList() {
    this.setData({
      'speedList': false,
      'housing': true
    })
  },
  // 添加书架
  addbook() {
    const userinfo = wx.getStorageSync('userinfo')
    const that = this;
    if (Object.keys(userinfo).length == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    } else {
      wx.request({
        url: `${app.globalData.url}/bookinfo/joinshelf`,
        method: 'POST',
        data: {
          bookid: that.data.bookid,
          userid: wx.getStorageSync('userinfo').userid || 11
        },
        success(res) {
          console.log("添加成功" + res)
          that.setData({
            'booksList': true
          })
        },
        fail(res) {
          console.log("添加失败" + res)
          wx.showToast({
            title: '添加失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  // 倍速播放
  SpeedPlay(e) {
    const speesIndex = parseFloat(e.currentTarget.dataset.speed);
    const index = e.currentTarget.dataset.index;
    setTimeout(function () {
      innerAudioContext.playbackRate = speesIndex;
    }, 2000)
    this.setData({
      playspeed: speesIndex,
      showplayspeedIndex: index
    })
  },
  // 显示文本
  showText() {
    this.getxt();
    this.setData({
      AIText: true,
      housing: true
    })
  },
  // 显示选择声音
  task() {
    console.log("点击了");
    this.setData({
      voicesettings: true,
      housing: true
    })
  },
  // 请求播放列表中的全部数据
  requestAudioList() {
    // 开始获取
    var that = this;
    wx.request({
      method: 'GET',
      url: `${app.globalData.url}/listen/playlist?bookid=${that.data.bookid}`,
      success: res => {
        res.data.data.forEach(element => {
          element.src = '';
          element.singer = '';
          element.ImgUrl = '';
        });
        const playlist = res.data.data;
        that.setData({
          playlist: playlist,
          booksList: false
        })
      },
      fail: function (error) {
        console.error('请求音频列表失败', error);
      }
    });
  },
  // 请求书本基本信息
  getmusic(gatherid) {
    let directoryid = gatherid
    const userinfo = wx.getStorageSync('userinfo') || {}
    const that = this;
    let videourl = ''
    // 请求namemap
    wx.request({
      url: `${app.globalData.url}/chaptercard/cardbase`,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: {
        userid: userinfo.userid,
        bookid: that.data.bookid
      },
      success: res => {
        let namemap = {}
        // 挨个添加赋值,数据处理
        for (let index = 0; index < res.data.data.length; index++) {
          const element = res.data.data[index].map;
          namemap = Object.assign(element, namemap);
        }
        that.setData({
          namemap: namemap
        })
        // 请求音乐
        wx.request({
          url: `${app.globalData.url}/listen/tts`,
          method: 'POST',
          data: {
            bookid: that.data.bookid,
            directoryid: directoryid, // 章节id
            namemap: namemap,
            voiceselected: that.data.voiceselected
          },
          success(res) {
            that.setData({
              videourl: res.data.data
            })
            videourl = res.data.data
            // 请求该书的基本信息
            wx.request({
              url: `${app.globalData.url}/listen/info`,
              method: 'POST',
              data: {
                directoryid: gatherid, // gatherid
                bookid: that.data.bookid,
                userid: userinfo.userid
              },
              success(res) {
                const src = res.data.src;
                const singer = res.data.data.bookauthor;
                const ImgUrl = res.data.data.bookcoverurl;
                const directoryname = res.data.data.directoryname
                const bookname = res.data.data.bookname
                let playlist = that.data.playlist
                let videourl = that.data.videourl
                playlist.forEach(item => {
                  if (item.bookid === gatherid) {
                    item.url = `http://82.156.157.176:666/qianduan${videourl}`
                    item.singer = singer
                    item.ImgUrl = ImgUrl;
                    item.directoryname = directoryname;
                    item.bookname = bookname;
                  }
                })
                that.setData({
                  bookcoverurl: ImgUrl,
                  bookname: res.data.data.bookname,
                  title: res.data.data.bookauthor,
                  playlist: playlist,
                  booksList: res.data.data.shelfStatu, //控制加入书架是否显示
                  loadingflag: false
                })
                innerAudioContext.src = `http://82.156.157.176:666/qianduan${videourl}`
                // 自动播放
                innerAudioContext.autoplay = 'false'
                innerAudioContext.onCanplay(() => {
                  // 获取当前音频的长度
                  innerAudioContext.duration; //必须写，不然获取不到。。。
                  setTimeout(() => {
                    that.setData({
                      audioDuration: formatTime(innerAudioContext.duration),
                      audioCurrentTime: formatTime(innerAudioContext.currentTime),
                    });
                  }, 1000);
                  that.play()
                });
              },
              fail(res) {
                console.log("失败" + res);
              }
            })
          },
          fail(res) {
            console.log("失败" + res);
          }
        })
      },
      fail: res => {
        console.log(res.data);
      }
    })
  },
  // 获取原著
  getxt() {
    const bookis = this.data.bookid;
    const that = this;
    console.log(this.data.directoryid);
    wx.request({
      url: `${app.globalData.url}/listen/txt`,
      method: 'POST',
      data: {
        bookid: this.data.bookid,
        directoryid: this.data.gatherid
      },
      success(res) {
        console.log(res.data);
        let txt = res.data.data.directorytxt
        that.setData({
          'bookText.content': txt,
          'bookText.title': res.data.data.title
        })
      },
      fail(res) {
        console.log(res.data.data);
      }
    })
  },
  onLoad: function (options) {
    const systemInfo = wx.getSystemInfoSync()
    this.setData({
      windowHeight: systemInfo.windowHeight
    })
    //  从书本详情页(目录)传过来的具体的目录id(第几集的id)
    const gatherid = options.directoryid;
    this.setData({
      bookid: options.bookid, //本书id
      gatherid: gatherid,
    })
    this.requestAudioList();
    this.getmusic(gatherid);
    // this.getxt()
  },
  onReady() {
    let that = this
    // 播放完成
    innerAudioContext.onEnded((res) => {
      that.setData({
        state: 'paused'
      })
      console.log(that.data.gatherid+1);
      console.log(this.data.playlist.length);
      if((that.data.gatherid+1) > this.data.playlist.length){
      // 显示已经是最后一章了
      wx.showToast({
        title: '已经是最后一章了！',
        icon: none
      })
      }else{
      // 自动播放下一章节
      that.getmusic(this.data.gatherid+1)
      }
    });
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
  onShareTimeline() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          title: this.data.play.title
        })
      }, 1000)
    })
    return {
      title: this.data.play.title,
      path: '/pages/ListeningDetails/ListeningDetails.wxml',
      imageUrl: this.data.play.imgurl,
      promise
    }
  },
  // 在适当的地方定义 getCurrentTimestamp 方法
  getCurrentTimestamp() {
    // 获取SDK版本号
    const SDKVersion = wx.getSystemInfoSync().SDKVersion;
    // 版本号大于或等于 "2.9.0"
    if (this.compareVersion(SDKVersion, "2.9.0") >= 0) {
      return Date.now();
    } else {
      return new Date().getTime();
    }
  },
  compareVersion(v1, v2) {
    v1 = v1.split('.');
    v2 = v2.split('.');
    const len = Math.max(v1.length, v2.length);
    while (v1.length < len) {
      v1.push('0');
    }
    while (v2.length < len) {
      v2.push('0');
    }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i]);
      const num2 = parseInt(v2[i]);
      if (num1 > num2) {
        return 1;
      } else if (num1 < num2) {
        return -1;
      }
    }
    return 0;
  },
  // 切换默认声音
  selectvoicerole(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      voiceselected: index
    })
    this.getmusic(this.data.gatherid)
  }
})