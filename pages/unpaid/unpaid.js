var app = getApp();
// 将秒转化成分秒
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
    height:0,
    equipment: [],
    time_hour: [],
    time_date: [],
    play_num: "",
    time_long: "",
    all_money: "",
    order_number: "",
    type:"",
    order_id:"",
    status:"",
    fileType:"",
  },
  // 查看电子合同
  toEC:function(){
    var create_time = this.data.create_time;
    var time_date = JSON.stringify(this.data.time_date);
    wx.navigateTo({
      url: '/pages/all_orders/ElectronicContract/ElectronicContract?time_date=' + time_date + '&create_time=' + create_time,
    })
  },
  // 支付
  topay: function (e) {
    console.log(this.data);
    // var item = e.currentTarget.dataset.item;
    var all_money = this.data.all_money;
    var order_number = this.data.order_number;
    var id = this.data.order_id;
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: app.globalData.domain + '/api/v1/pay/xcxpay/wxpay',
          data: {
            code: code,
            order_number: order_number,
            all_money: all_money
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
                        setTimeout(function () {
                          wx.redirectTo({
                            url: '/pages/all_orders/all_orders'
                          })
                        }, 1000)
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
  // 取消订单
  cancal:function(){
    var order_id = this.data.order_id;
    var id = app.globalData.userInfo.userinfo.id;
    var token = app.globalData.userInfo.token;
    wx.showModal({
      title: '确认取消？',
      content: '您确认要取消次订单吗？',
      success(res) {
        console.log(res.confirm);
        if (res.confirm == true) {
          console.log(123);
          wx.request({
            url: app.globalData.domain + '/api/v1/operate/default/quxiao',
            method: "GET",
            data:{
              user_id: id,
              token: token,
              order_id: order_id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              console.log(res.data)
              if (res.data.msg == "取消订单成功"){
                let pages = getCurrentPages();
                let prevPage = pages[pages.length - 2];
                prevPage.setData({
                  cancal:true
                })
                wx.redirectTo({
                  url: '/pages/all_orders/all_orders'
                })
              }
            },
            fail(res) {
              console.log(res.data)
            }
          })


        } else if (res.cancel == false) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 申请退款
  refund:function(){
    var order_id = this.data.order_id;
    wx.navigateTo({
      url: '/pages/all_orders/refund/refund?order_id=' + order_id,
    })
  },
  // 上传广告
  toload: function (e) {
    var id = this.data.order_id;
    var type_name = this.data.type;
    if (type_name == "文字广告") {
      wx.navigateTo({
        url: '/pages/all_orders/text/text?id=' + id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/all_orders/video/video?id=' + id,
      })
    }
  },
  // 删除
  del:function(){
    var that = this;
    var order_id = this.data.order_id;
    var type = this.data.type
    wx.showModal({
      title: '确认删除',
      content: '您确认要删除此订单吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/api/v1/order/default/new-choose',
            method: "GET",
            data: {
              user_id: app.globalData.userInfo.userinfo.id,
              token: app.globalData.userInfo.token,
              order_id: order_id,
              type: type
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              wx.redirectTo({
                url: '/pages/all_orders/all_orders'
              })
            },
            fail(res) {
              console.log(res.data)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 确认完成
  toaffirm: function (e) {
    var that = this;
    var order_id = this.data.order_id;
    wx.showModal({
      title: '确认完成',
      content: '您确认完成此订单吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.domain + '/api/v1/operate/default/complete',
            method: "GET",
            data: {
              user_id: app.globalData.userInfo.userinfo.id,
              token: app.globalData.userInfo.token,
              order_id: order_id
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res) {
              wx.redirectTo({
                url: '/pages/all_orders/all_orders'
              })
            },
            fail(res) {
              console.log(res.data)
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      domain: app.globalData.domain,
      status: options.status,
      order_id: options.id,
      height: app.globalData.height,
      format_pay_back: options.format_pay_back
    })
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-detail-xcx',
      method: "GET",
      data: {
        order_id: options.id,
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
          play_long: play_long,
          time_total: time_total,
          date_num: res.data.data.date_num,
          all_money: res.data.data.detail.all_money,
          order_number: res.data.data.detail.order_number,
          create_time: res.data.data.detail.create_time,
          pay_way: res.data.data.detail.pay_way,
          type: res.data.data.type,
        })
        if (res.data.data.advert.content){
          that.setData({
            fileType: res.data.data.advert.type_name,
            img: res.data.data.advert.content,
          })
        }
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

  },
})