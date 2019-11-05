var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    value:"",
    useful_profit:"",
  },
  // 获取提现金额
  getvalue:function(e){
    this.setData({
      value:e.detail.value
    })
  },
  // 确认提现
  affirm:function(){
    var that = this;
    var value = this.data.value;
    var useful_profit = this.data.useful_profit;
    var money = Number(useful_profit) - Number(value);
    if (value){
      if(value!=0){
        if (money>0){
          wx.request({
            url: app.globalData.domain + '/api/v1/share/default/get-cash',
            method: "POST",
            data: {
              user_id: app.globalData.userInfo.userinfo.id,
              token: app.globalData.userInfo.token,
              money: value
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data);
              if (res.data.msg == "提现提交成功,请等候审核"){
                wx.showToast({
                  title: '提现提交成功,请等候审核',
                  icon: 'none',
                  duration: 1500
                });
                that.setData({
                  useful_profit:money
                })            
              }
            },
            fail(res) {
              console.log(res.data);
            }
          })
        }else{
          wx.showToast({
            title: '请输入正确金额',
            icon: 'none',
            duration: 1500
          });
        }
      }else{
        wx.showToast({
          title: '请输入正确金额',
          icon: 'none',
          duration: 1500
        });
      }
    }else{
      wx.showToast({
        title: '请输入金额',
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
    var that = this;
    // 查看是否绑定支付宝
    wx.request({
      url: app.globalData.domain + '/api/v1/share/default/alipay',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data);
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
    // 获取可用金额
    wx.request({
      url: app.globalData.domain + '/api/v1/share/default/index',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data);
        if (res.data.data.list.useful_profit>1){
          that.setData({
            isShow:false,
            useful_profit: res.data.data.list.useful_profit
          })
        }else{
          that.setData({
            useful_profit: res.data.data.list.useful_profit
          })
        }
        
      },
      fail(res) {
        console.log(res.data);
      }
    })
  },
})