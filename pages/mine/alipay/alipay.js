var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    alipay_account:"",
    true_name:""
  },

  // 更换支付宝
  affirm:function(){
    wx.navigateTo({
      url: '/pages/mine/login-alipay/login-alipay',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    console.log(this);
    if (this.data.backLA){

    }else{
      var that = this;
      wx.request({
        url: app.globalData.domain + '/api/v2/home/index/getalipay',
        method: "POST",
        data: {
          user_id: app.globalData.userInfo.userinfo.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success(res) {
          if (res.data.data.alipay_account) {
            that.setData({
              alipay_account: res.data.data.alipay_account,
              true_name: res.data.data.true_name
            })
          } else {
            wx.navigateTo({
              url: '/pages/mine/login-alipay/login-alipay',
            })
          }
        },
        fail(res) {
          console.log(res.data);
        }
      })
    }
  }
})