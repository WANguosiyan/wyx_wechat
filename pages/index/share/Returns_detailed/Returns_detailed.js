var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */

  // 跳转到提现
  toalipay: function () {
    wx.navigateTo({
      url: '/pages/index/share/draw_money/draw_money',
    })
  },
  onLoad: function (options) {
    var that = this;
    var id = app.globalData.userInfo.userinfo.id;
    wx.request({
      url: app.globalData.domain + '/api/v1/share/default/my-detail',
      method: "GET",
      data: {
        user_id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data);
        that.setData({
          list: res.data.data.detail,
        })
      },
      fail(res) {
        console.log(res.data)
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

  },

})