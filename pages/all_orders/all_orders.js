var app = getApp();
// 将时间戳转化为具体时间
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = change(date.getDate()) + ' ';
  var h = change(date.getHours()) + ':';
  var m = change(date.getMinutes()) + ':';
  var s = change(date.getSeconds());
  return Y + M + D + h + m + s;
}
function change(t) {
  if (t < 10) {
    return "0" + t;
  } else {
    return t;
  }
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    xianshi: false,
    num: 10,
    orderObj: {},
    allList: [],
    navList: ['全部', '待支付', '未上传', '审核中', '未通过', '已通过', '已完成', '已取消'],
    itemList: [],
    heigh: 1000

  },
  // 选择tab
  xuanzhong: function (e) {
    app.globalData.pagenum = 1;
    if (e.currentTarget.dataset.currenttab == 0) {
      app.globalData.statusNum = -1;
    } else if (e.currentTarget.dataset.currenttab == 1) {
      app.globalData.statusNum = 0;
    } else if (e.currentTarget.dataset.currenttab == 2) {
      app.globalData.statusNum = 1;
    } else if (e.currentTarget.dataset.currenttab == 3) {
      app.globalData.statusNum = 2;
    } else if (e.currentTarget.dataset.currenttab == 4) {
      app.globalData.statusNum = 3;
    } else if (e.currentTarget.dataset.currenttab == 5) {
      app.globalData.statusNum = 4;
    } else if (e.currentTarget.dataset.currenttab == 6) {
      app.globalData.statusNum = 5;
    } else if (e.currentTarget.dataset.currenttab == 7) {
      app.globalData.statusNum = 6;
    }
    console.log(app.globalData.statusNum);
    this.setData({
      currentTab: e.currentTarget.dataset.currenttab,
    })
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-list-xcx',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        status: e.currentTarget.dataset.currenttab - 1,
        page: 1,
        pagesize: 6
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        that.setData({
          itemList: res.data.data
        })
      }
    })
  },
  //滑动切换
  bindChange: function (e) {
    console.log(e);
    app.globalData.pagenum = 1;
    if (e.currentTarget.dataset.currenttab == 0) {
      app.globalData.statusNum = -1;
    } else if (e.currentTarget.dataset.currenttab == 1) {
      app.globalData.statusNum = 0;
    } else if (e.currentTarget.dataset.currenttab == 2) {
      app.globalData.statusNum = 1;
    } else if (e.currentTarget.dataset.currenttab == 3) {
      app.globalData.statusNum = 2;
    } else if (e.currentTarget.dataset.currenttab == 4) {
      app.globalData.statusNum = 3;
    } else if (e.currentTarget.dataset.currenttab == 5) {
      app.globalData.statusNum = 4;
    } else if (e.currentTarget.dataset.currenttab == 6) {
      app.globalData.statusNum = 5;
    } else if (e.currentTarget.dataset.currenttab == 7) {
      app.globalData.statusNum = 6;
    }
    this.setData({
      currentTab: e.detail.current,
    })
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-list-xcx',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        status: e.detail.current - 1,
        page: 1,
        pagesize: 6
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data.data.length);
        that.setData({
          itemList: res.data.data
        })
      }
    })
  },
  // 切换到待支付订单页
  tounpaid: function (e) {
    var id = e.currentTarget.dataset.item.id;
    var status = e.currentTarget.dataset.item.status;
    var format_pay_back = e.currentTarget.dataset.item.format_pay_back;
    wx.navigateTo({
      url: '/pages/unpaid/unpaid?id=' + id + '&status=' + status + '&format_pay_back=' + format_pay_back
    })
  },
  //支付
  topay: function (e) {
    var item = e.currentTarget.dataset.item;
    var all_money = e.currentTarget.dataset.item.all_money;
    var order_number = e.currentTarget.dataset.item.order_number;
    var id = e.currentTarget.dataset.item.id;
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
  // 上传
  toload: function (e) {
    var id = e.currentTarget.dataset.item.id;
    var type_name = e.currentTarget.dataset.item.type_name
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
  // 已通过
  toaffirm: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.item.id;
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
              that.onLoad();
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
  // 删除订单
  todel: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.item.id;
    var type = e.currentTarget.dataset.item.type_name
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

        }
      }
    })
  },
  // 确认完成
  toaffirm: function (e) {
    var that = this;
    var order_id = e.currentTarget.dataset.item.id;
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
    wx.showLoading({
      title: '请稍后',
    })
    this.setData({
      domain: app.globalData.domain
    })
    var that = this;
    var obj = {};
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    if (options.currentTab) {
      that.setData({
        currentTab: options.currentTab,
      })
    }
    var that = this;
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-list-xcx',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        status: app.globalData.statusNum,
        page: 1,
        pagesize: 6
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log(res.data);
        that.setData({
          itemList: res.data.data
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 800)
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
    if (this.data.cancal) {
      this.onLoad();
    }
  },
  // 触底加载更多
  onReachBottom: function () {
    wx.showLoading({
      title: '请稍后',
    })
    var that = this;
    var numPage = app.globalData.pagenum;
    numPage++;
    app.globalData.pagenum = numPage;
    console.log(app.globalData.statusNum, app.globalData.pagenum, this.data.currentTab)
    wx.request({
      url: app.globalData.domain + '/api/v1/info/default/order-list-xcx',
      method: "GET",
      data: {
        user_id: app.globalData.userInfo.userinfo.id,
        token: app.globalData.userInfo.token,
        status: app.globalData.statusNum,
        page: app.globalData.pagenum,
        pagesize: 6
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        setTimeout(function () {
          wx.hideLoading()
        }, 800)
        console.log(res.data);
        if (res.data.msg == '获取数据成功') {
          var arr = that.data.itemList
          var arr2 = arr.concat(res.data.data);
          that.setData({
            itemList: arr2
          })
        }
      }
    })
  },
})