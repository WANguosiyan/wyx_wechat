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
  onLoad: function (options) {
    var that = this;
    this.setData({
      domain:app.globalData.domain
    })
    var id = app.globalData.userInfo.userinfo.id;
    wx.request({
      url: app.globalData.domain + '/api/v1/share/default/my-invite',
      method: "GET",
      data: {
        user_id: id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          member_money: res.data.data.member_money,
          member_count: res.data.data.member_count,
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