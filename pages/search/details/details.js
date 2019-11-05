var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stypeBox: false,
    isfull3: false,
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 点击立即购买
  btn:function(){
    this.setData({
      istypeBox: true,
      isfull3: true,
    })
  },
  // 点击取消
  typeBoxQX: function () {
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
  },
  // 点击视屏
  typeBoxSP(e) {
    app.globalData.type = e.currentTarget.dataset.sp;
    app.globalData.chooseCar = this.data.list;
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
    wx.navigateTo({
      url: '/pages/duration/duration',
    })
  },
  // 点击文字
  typeBoxWZ(e) {
    app.globalData.type = e.currentTarget.dataset.wz
    app.globalData.chooseCar = this.data.list;
    this.setData({
      istypeBox: false,
      isfull3: false,
    })
    wx.navigateTo({
      url: '/pages/duration/duration',
    })
  },
  onLoad: function (options) {
    var that = this;
    this.setData({
      domain: app.globalData.domain
    })
    wx.request({
      url: app.globalData.domain + '/api/v2/advert/adverts/advertdetails',
      method: "POST",
      data: {
        id: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          list: res.data.data,
          name: res.data.data[0].name,
          address: res.data.data[0].address,
          type: res.data.data[0].typename,
          img: res.data.data[0].pics
        })
        if (res.data.data[0].content){
          let data = app.towxml.toJson(res.data.data[0].content, 'markdown');                //设置文档显示主题，默认'light'
          data.theme = 'light';                //设置数据
          that.setData({
            article: data,
          });
        }
      },
      fail(res) {
        console.log(res.data);
      }
    })  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})