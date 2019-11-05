// pages/submit/submit.js
var app = getApp();
function s_to_hs(s) {
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  var h;
  h = Math.floor(s / 60);
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = s % 60;
  //将变量转换为字符串
  h += '';
  s += '';
  //如果只有一位数，前面增加一个0
  h = (h.length == 1) ? '0' + h : h;
  s = (s.length == 1) ? '0' + s : s;
  return h + '分' + s + '秒';
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipment:[],
    time_hour:[],
    time_date:[],
    play_num:"",
    time_long:"",
    all_money:"",
    order_number:"",
    delID1:[]

  },
  // 已授权
  payment: function () {
    var all_money = this.data.all_money;
    var order_number = this.data.order_number;
    var delID1 = this.data.delID1;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: app.globalData.domain + '/api/v1/pay/xcxpay/wxpay',
          data: {
            code: code,
            order_number: order_number,
            all_money: all_money,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            var preData = res.data;
            var newstr = preData.substring(preData.indexOf('{'), preData.length)
            var newdata = JSON.parse(newstr);
            wx.requestPayment({    //请求支付
              timeStamp: newdata.timeStamp,
              nonceStr: newdata.nonceStr,
              package: newdata.package,
              signType: newdata.signType,
              paySign: newdata.paySign,
              success: function (res) {
                if (res.errMsg == "requestPayment:ok") {
                  wx.request({
                    url: app.globalData.domain + '/api/v1/info/default/change-order-status',
                    data: {
                      order_id: order_number
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: 'GET',
                    success: function (data) {
                      if (data.data.code == 200) {
                        wx.showToast({
                          title: '付款成功',
                          icon: 'success',
                          duration: 2000
                        })
                        app.globalData.delID1 = delID1;
                        wx.redirectTo({
                          url: '/pages/all_orders/all_orders'
                        })
                      }
                    },
                    fail: function (error) {
                      console.log(error);
                    }
                  })
                }
                console.log(res);
              },
              fail: function (error) {
                console.log(error);
                app.globalData.delID1 = delID1;
                wx.reLaunch({
                  url: '/pages/all_orders/all_orders'
                })
              }
            })
          },
          fail: function (res) {
            console.log(res.data);
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '请稍后',
    })
    var id = options.id;
    var arr = options.delID1.split(",");
    this.setData({
      delID1:arr
    })
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-detail-xcx',
      method: "GET",
      data: {
        order_id:id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res);
        var play_long = s_to_hs(res.data.data.play_long);
        var time_total = s_to_hs(res.data.data.time_total);
        that.setData({
          equipment: res.data.data.equipment,
          time_date: res.data.data.time_date,
          time_hour: res.data.data.time_hour,
          play_num: res.data.data.play_num,
          all_money: res.data.data.detail.all_money,
          order_number: res.data.data.detail.order_number,
          date_num: res.data.data.date_num,
          time_total: time_total,
          play_long: play_long
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 500);
      },
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