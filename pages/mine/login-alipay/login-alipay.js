var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    name:''
  },
  // 获取账户
  inpAccount:function(e){
    this.setData({
      account:e.detail.value
    })
  },
  // 获取姓名
  inpName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 确认
  affirm:function(){
    var account = this.data.account;
    var name = this.data.name;
    if (account&&name){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (account.length === 0) {
        wx.showToast({
          title: '支付宝账号输入错误',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (account.length < 11) {
        wx.showToast({
          title: '支付宝账号输入错误',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (!myreg.test(account)) {
        wx.showToast({
          title: '支付宝账号输入错误',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else {

        wx.request({
          url: app.globalData.domain + '/api/v2/home/index/bindalipay',
          method: "POST",
          data:{
            user_id: app.globalData.userInfo.userinfo.id,
            token: app.globalData.userInfo.token,
            true_name:name,
            alipay_account: account
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            wx.navigateBack({
              delta: 1
            })
          },
          fail(res) {
            console.log(res.data);
          }
        })
      }
    }else{
      wx.showToast({
        title: '请输入完整信息',
        icon: 'none',
        duration: 1500
      });
    }
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

  },
})