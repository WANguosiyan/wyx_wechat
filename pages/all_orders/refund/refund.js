var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
    name:"",
    number:"",
    order_id:"",
  },
  // 获取退款原因
  text:function(e){
    this.setData({
      text: e.detail.value
    })
  },
  // 获取联系人
  name:function(e){
    this.setData({
      name: e.detail.value
    })
  },
  number: function (e) {
    this.setData({
      number: e.detail.value
    })
  },

  bindtap:function(){
    var text = this.data.text;
    var name = this.data.name;
    var number = this.data.number;
    var order_id = this.data.order_id;
    if (text&&name&&number){
      var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
      if (number.length === 0) {
        wx.showToast({
          title: '请输入正确账号',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (number.length < 11) {
        wx.showToast({
          title: '请输入正确账号',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else if (!myreg.test(number)) {
        wx.showToast({
          title: '请输入正确账号',
          icon: 'none',
          duration: 1500
        });
        return false;
      } else {
        // 发送请求
        wx.request({
          url: app.globalData.domain + '/api/v1/operate/default/apply-back',
          method: "POST",
          data: {
            user_id: app.globalData.userInfo.userinfo.id,
            token: app.globalData.userInfo.token,
            order_id: order_id,
            reason:text,
            back_person:name,
            back_account: number
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            if (res.data.msg == "申请退款成功,请耐心等待"){
              wx.showToast({
                title: '申请退款成功,请耐心等待',
                icon: 'none',
                duration: 1500
              });
              setTimeout(function(){
                wx.redirectTo({
                  url: '/pages/all_orders/all_orders'
                })
              },1000)
            } else if (res.data.msg == "该订单已经申请过退款,请耐心等待"){
              wx.showToast({
                title: "该订单已经申请过退款,请耐心等待",
                icon: 'none',
                duration: 1500
              });
            }
          },
          fail(res) {
            console.log(res.data)
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
    this.setData({
      order_id: options.order_id
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