var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取消息
    wx.request({
      url: app.globalData.domain + '/api/v1/user/default/info',
      method: "GET",
      data: {
        type:1,
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.msg == "获取数据成功"){
          that.setData({
            list: res.data.data
          })
        }
      },
      fail(res) {
        console.log(res.data);
      }
    })
    // 让消息变成已读
    wx.request({
      url: app.globalData.domain + '/api/v2/user/users/upfeedback',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        
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

  },
})