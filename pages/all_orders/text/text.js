var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",
    order_id:""
  },
  // 获取输入框的值
  bindinput:function(e){
    var value = e.detail.value
    this.setData({
      value:value
    })
  },
  // 确认
  affirm:function(){
    var order_id = this.data.order_id;
    var value = this.data.value;
    wx.request({
      url: app.globalData.domain + '/api/v1/operate/default/save',
      data: {
        type:2,
        content:value,
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        order_id:order_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.msg)
        if (res.data.msg == "上传广告成功"){
          wx.showToast({
            title: '上传广告成功',
            icon: 'none',
            duration: 1500
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/all_orders/all_orders'
            })
          }, 1000)
        }else{
          wx.showToast({
            title: '上传广告失败',
            icon: 'none',
            duration: 1500
          });
        }
        
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      order_id: options.id
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